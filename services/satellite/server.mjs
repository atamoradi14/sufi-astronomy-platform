import http from "node:http";
import { createHash, randomBytes, randomInt } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, existsSync, readFileSync, createReadStream } from "node:fs";
import { dirname, join } from "node:path";
import { WebSocketServer, WebSocket } from "ws";
import { signClaims, verifyClaims } from "../../src/lib/satellite/auth.ts";
import {
  AttitudeKalman,
  normalized,
  norm,
  finiteVec,
} from "../../src/lib/mobile-sensors/math.ts";
const hash = (s) => createHash("sha256").update(s).digest("hex");
const fail = (status, message) => Object.assign(new Error(message), { status });
const text = (v, max = 120) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const email = (v) => text(v, 254).toLowerCase();
const json = (res, status, value) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(value));
};
async function body(req) {
  let size = 0,
    chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 16384) throw fail(413, "Request too large");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    throw fail(400, "Invalid JSON");
  }
}
export function validTelemetry(p) {
  if (
    !p ||
    p.type !== "telemetry" ||
    !Number.isSafeInteger(p.seq) ||
    p.seq < 0 ||
    !Number.isFinite(p.at)
  )
    return false;
  for (const [key, max] of [
    ["accel", 2000],
    ["gyro", 200],
    ["mag", 10000],
  ])
    if (
      p[key] !== null &&
      p[key] !== undefined &&
      (!finiteVec(p[key]) || p[key].some((v) => Math.abs(v) > max))
    )
      return false;
  if (
    p.q !== null &&
    p.q !== undefined &&
    (!Array.isArray(p.q) ||
      p.q.length !== 4 ||
      !p.q.every(Number.isFinite) ||
      Math.abs(norm(p.q) - 1) > 0.15)
  )
    return false;
  if (
    p.gps &&
    (!Number.isFinite(p.gps.lat) ||
      Math.abs(p.gps.lat) > 90 ||
      !Number.isFinite(p.gps.lon) ||
      Math.abs(p.gps.lon) > 180 ||
      !Number.isFinite(p.gps.accuracy) ||
      p.gps.accuracy < 0 ||
      !Number.isFinite(p.gps.at))
  )
    return false;
  return true;
}
export function createSatellite({
  secret = process.env.SATELLITE_SHARED_SECRET,
  dbPath = process.env.SATELLITE_DB_PATH || "/data/satellite.sqlite",
  origin = process.env.PUBLIC_ORIGIN || "https://fanous.online",
  apkDir = process.env.APK_DIR || "/app/downloads",
} = {}) {
  if (!secret || secret.length < 32)
    throw Error(
      "A private SATELLITE_SHARED_SECRET of at least 32 characters is required",
    );
  if (dbPath !== ":memory:") mkdirSync(dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`PRAGMA journal_mode=WAL;PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS devices(id TEXT PRIMARY KEY,owner TEXT NOT NULL,email TEXT NOT NULL,name TEXT NOT NULL,model TEXT NOT NULL,created INTEGER NOT NULL,version INTEGER NOT NULL DEFAULT 1,revoked INTEGER NOT NULL DEFAULT 0,last_seen INTEGER);
    CREATE TABLE IF NOT EXISTS pairing(id TEXT PRIMARY KEY,email TEXT NOT NULL,name TEXT NOT NULL,model TEXT NOT NULL,code TEXT NOT NULL,secret_hash TEXT NOT NULL,status TEXT NOT NULL,expires INTEGER NOT NULL,device_id TEXT);
    CREATE INDEX IF NOT EXISTS pairing_email ON pairing(email,status);CREATE INDEX IF NOT EXISTS devices_owner ON devices(owner);`);
  const devices = new Map(),
    tickets = new Map(),
    limits = new Map();
  for (const table of ["devices", "pairing"]) {
    if (
      !db
        .prepare(`PRAGMA table_info(${table})`)
        .all()
        .some((c) => c.name === "installation")
    )
      db.exec(`ALTER TABLE ${table} ADD COLUMN installation TEXT`);
  }
  db.exec(
    "CREATE UNIQUE INDEX IF NOT EXISTS device_installation_active ON devices(installation) WHERE installation IS NOT NULL AND revoked=0",
  );
  const revoke = (id) => {
    db.prepare(
      "UPDATE devices SET revoked=1,version=version+1 WHERE id=? AND revoked=0",
    ).run(id);
    const state = devices.get(id);
    if (state) {
      state.publisher?.close(1008, "Device revoked");
      for (const viewer of state.viewers) viewer.close(1008, "Device revoked");
      devices.delete(id);
    }
  };
  const control = (req) => {
    const c = verifyClaims(
      (req.headers.authorization || "").replace(/^Bearer /, ""),
      secret,
      "control",
    );
    if (!c || !email(c.email)) throw fail(401, "Sign in required");
    return c;
  };
  const owned = (id, c) => {
    const d = db
      .prepare("SELECT * FROM devices WHERE id=? AND owner=? AND revoked=0")
      .get(id, c.sub);
    if (!d) throw fail(404, "Device not found");
    return d;
  };
  const deviceAuth = (req) => {
    const c = verifyClaims(
      (req.headers.authorization || "").replace(/^Bearer /, ""),
      secret,
      "device",
    );
    if (!c) return null;
    const d = db
      .prepare(
        "SELECT * FROM devices WHERE id=? AND owner=? AND version=? AND revoked=0",
      )
      .get(c.sub, c.owner, c.version);
    return d || null;
  };
  const publicDevice = (d) => ({
    id: d.id,
    name: d.name,
    model: d.model,
    created: d.created,
    lastSeen: devices.get(d.id)?.lastSeen || d.last_seen,
    connected: devices.get(d.id)?.publisher?.readyState === WebSocket.OPEN,
    camera:
      !!devices.get(d.id)?.camera &&
      Date.now() - devices.get(d.id).camera.at < 5000,
  });
  const ensureState = (id) => {
    if (!devices.has(id))
      devices.set(id, {
        history: [],
        viewers: new Set(),
        publisher: null,
        lastSeen: 0,
        lastSeq: -1,
        filter: new AttitudeKalman(),
        at: 0,
        camera: null,
        absolute: false,
      });
    return devices.get(id);
  };
  const send = (ws, p) => {
    if (ws.readyState === WebSocket.OPEN && ws.bufferedAmount < 512000)
      ws.send(
        typeof p === "string" || Buffer.isBuffer(p) ? p : JSON.stringify(p),
      );
  };
  const broadcast = (state, p) => {
    for (const viewer of state.viewers) send(viewer, p);
  };
  const server = http.createServer(async (req, res) => {
    try {
      const path = new URL(req.url, "http://local").pathname.replace(
        /^\/satellite-api/,
        "",
      );
      if (req.method === "GET" && path === "/health") {
        db.prepare("SELECT 1").get();
        return json(res, 200, { status: "ok", service: "fanous-satellite" });
      }
      if (req.method === "GET" && path === "/download/manifest.json") {
        const f = join(apkDir, "manifest.json");
        if (!existsSync(f)) throw fail(503, "Android release not ready");
        return json(res, 200, JSON.parse(readFileSync(f, "utf8")));
      }
      if (req.method === "GET" && path === "/download/fanous-satellite.apk") {
        const f = join(apkDir, "fanous-satellite.apk");
        if (!existsSync(f)) throw fail(503, "Android release not ready");
        res.writeHead(200, {
          "Content-Type": "application/vnd.android.package-archive",
          "Content-Disposition": 'attachment; filename="fanous-satellite.apk"',
          "Cache-Control": "public, max-age=300",
          "X-Content-Type-Options": "nosniff",
        });
        return createReadStream(f).pipe(res);
      }
      if (req.method === "POST" && path === "/pair/request") {
        const ip = req.socket.remoteAddress || "local",
          key = "pair:" + ip,
          limit = limits.get(key) || { n: 0, expires: Date.now() + 600000 };
        if (limit.expires < Date.now()) {
          limit.n = 0;
          limit.expires = Date.now() + 600000;
        }
        if (++limit.n > 60)
          throw fail(429, "Too many pairing requests; try later");
        limits.set(key, limit);
        const p = await body(req),
          address = email(p.email);
        const installation = text(p.installationId, 64);
        if (!/^[a-f0-9]{64}$/.test(installation))
          throw fail(400, "Update the Android app before pairing");
        if (
          db
            .prepare(
              "SELECT id FROM devices WHERE installation=? AND revoked=0",
            )
            .get(installation)
        )
          throw fail(
            409,
            "This phone is already paired. Cancel its connection first in the app or revoke it in the dashboard.",
          );
        if (
          db
            .prepare(
              "SELECT id FROM pairing WHERE installation=? AND status='pending' AND expires>?",
            )
            .get(installation, Date.now())
        )
          throw fail(409, "Cancel the pending request before requesting again");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address))
          throw fail(400, "Enter a valid Google email address");
        if (
          db
            .prepare(
              "SELECT count(*) AS n FROM pairing WHERE email=? AND status='pending' AND expires>?",
            )
            .get(address, Date.now()).n >= 5
        )
          throw fail(429, "Too many pending requests");
        const id = randomBytes(18).toString("hex"),
          pairSecret = randomBytes(32).toString("base64url"),
          code = String(randomInt(10000000, 100000000)),
          expires = Date.now() + 600000;
        db.prepare(
          "INSERT INTO pairing(id,email,name,model,code,secret_hash,status,expires,device_id,installation) VALUES(?,?,?,?,?,?,?,?,NULL,?)",
        ).run(
          id,
          address,
          text(p.name) || "Android phone",
          text(p.model) || "Android",
          code,
          hash(pairSecret),
          "pending",
          expires,
          installation,
        );
        return json(res, 201, {
          id,
          secret: pairSecret,
          code,
          expires,
          verificationUrl:
            origin + "/satellite?pair=" + encodeURIComponent(code),
        });
      }
      if (req.method === "POST" && path === "/pair/cancel") {
        const p = await body(req),
          r = db.prepare("SELECT * FROM pairing WHERE id=?").get(text(p.id));
        if (!r || hash(text(p.secret, 200)) !== r.secret_hash)
          throw fail(401, "Invalid pairing secret");
        if (r.device_id) revoke(r.device_id);
        db.prepare("UPDATE pairing SET status='rejected' WHERE id=?").run(r.id);
        return json(res, 200, { cancelled: true });
      }
      if (
        req.method === "POST" &&
        (path === "/device/register" || path === "/device/unpair")
      ) {
        const d = deviceAuth(req);
        if (!d) throw fail(401, "Device credential required");
        if (path === "/device/unpair") {
          revoke(d.id);
          return json(res, 200, { cancelled: true });
        }
        const p = await body(req),
          installation = text(p.installationId, 64);
        if (!/^[a-f0-9]{64}$/.test(installation))
          throw fail(400, "Invalid phone identifier");
        if (d.installation && d.installation !== installation)
          throw fail(409, "Phone identity cannot change");
        const existing = db
          .prepare("SELECT id FROM devices WHERE installation=? AND revoked=0")
          .get(installation);
        if (existing && existing.id !== d.id)
          throw fail(409, "Cancel the previous phone connection first");
        db.prepare("UPDATE devices SET installation=? WHERE id=?").run(
          installation,
          d.id,
        );
        return json(res, 200, { registered: true });
      }
      if (req.method === "POST" && path === "/pair/claim") {
        const p = await body(req),
          r = db.prepare("SELECT * FROM pairing WHERE id=?").get(text(p.id));
        if (!r || hash(text(p.secret, 200)) !== r.secret_hash)
          throw fail(401, "Invalid pairing secret");
        if (r.expires < Date.now())
          return json(res, 410, { status: "expired" });
        if (r.status === "rejected")
          return json(res, 403, { status: "rejected" });
        if (r.status === "pending")
          return json(res, 200, { status: "pending" });
        const d = db
          .prepare("SELECT * FROM devices WHERE id=? AND revoked=0")
          .get(r.device_id);
        if (!d) throw fail(410, "Device revoked");
        db.prepare("UPDATE pairing SET status='claimed' WHERE id=?").run(r.id);
        return json(res, 200, {
          status: "approved",
          deviceId: d.id,
          token: signClaims(
            {
              aud: "device",
              sub: d.id,
              owner: d.owner,
              version: d.version,
              exp: Math.floor(Date.now() / 1000) + 90 * 86400,
            },
            secret,
          ),
          socketUrl: origin.replace(/^http/, "ws") + "/satellite-api/device",
        });
      }
      if (path.startsWith("/v1/")) {
        const c = control(req);
        if (req.method === "GET" && path === "/v1/requests")
          return json(res, 200, {
            requests: db
              .prepare(
                "SELECT id,name,model,code,expires FROM pairing WHERE email=? AND status='pending' AND expires>? ORDER BY expires DESC",
              )
              .all(email(c.email), Date.now()),
          });
        if (req.method === "GET" && path === "/v1/devices")
          return json(res, 200, {
            devices: db
              .prepare(
                "SELECT * FROM devices WHERE owner=? AND revoked=0 ORDER BY created DESC",
              )
              .all(c.sub)
              .map(publicDevice),
          });
        const p = await body(req);
        if (req.method === "POST" && path === "/v1/approve") {
          const r = db
            .prepare(
              "SELECT * FROM pairing WHERE id=? AND email=? AND status='pending' AND expires>?",
            )
            .get(text(p.id), email(c.email), Date.now());
          if (!r || r.code !== text(p.code, 12))
            throw fail(404, "Pairing request/code not found");
          if (p.approve !== true) {
            db.prepare("UPDATE pairing SET status='rejected' WHERE id=?").run(
              r.id,
            );
            return json(res, 200, { status: "rejected" });
          }
          if (
            db
              .prepare(
                "SELECT count(*) AS n FROM devices WHERE owner=? AND revoked=0",
              )
              .get(c.sub).n >= 10
          )
            throw fail(409, "Maximum ten devices per account");
          const id = randomBytes(18).toString("hex");
          if (
            db
              .prepare(
                "SELECT id FROM devices WHERE installation=? AND revoked=0",
              )
              .get(r.installation)
          )
            throw fail(409, "This phone is already paired; cancel it first");
          db.exec("BEGIN IMMEDIATE");
          try {
            db.prepare(
              "INSERT INTO devices(id,owner,email,name,model,created,installation) VALUES(?,?,?,?,?,?,?)",
            ).run(
              id,
              c.sub,
              email(c.email),
              r.name,
              r.model,
              Date.now(),
              r.installation,
            );
            db.prepare(
              "UPDATE pairing SET status='approved',device_id=? WHERE id=?",
            ).run(id, r.id);
            db.exec("COMMIT");
          } catch (e) {
            db.exec("ROLLBACK");
            throw e;
          }
          return json(res, 200, { status: "approved", deviceId: id });
        }
        if (req.method === "POST" && path === "/v1/revoke") {
          const d = owned(text(p.id), c);
          db.prepare(
            "UPDATE devices SET revoked=1,version=version+1 WHERE id=?",
          ).run(d.id);
          const s = devices.get(d.id);
          if (s) {
            s.publisher?.close(1008, "Device revoked");
            for (const w of s.viewers) w.close(1008, "Device revoked");
            devices.delete(d.id);
          }
          return json(res, 200, { revoked: true });
        }
        if (req.method === "POST" && path === "/v1/ticket") {
          const d = owned(text(p.id), c),
            ticket = randomBytes(32).toString("base64url");
          tickets.set(hash(ticket), {
            id: d.id,
            owner: c.sub,
            expires: Date.now() + 30000,
          });
          return json(res, 200, {
            ticket,
            path: "/satellite-api/view?ticket=" + encodeURIComponent(ticket),
          });
        }
      }
      throw fail(404, "Not found");
    } catch (error) {
      json(res, error.status || 500, {
        error: error.status ? error.message : "Satellite service unavailable",
      });
    }
  });
  const sockets = new WebSocketServer({
    noServer: true,
    maxPayload: 300000,
    perMessageDeflate: false,
  });
  server.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url, "http://local"),
      path = url.pathname.replace(/^\/satellite-api/, "");
    let d, role;
    if (path === "/device") {
      d = deviceAuth(req);
      role = "device";
    } else if (path === "/view" && req.headers.origin === origin) {
      const key = hash(url.searchParams.get("ticket") || ""),
        ticket = tickets.get(key);
      tickets.delete(key);
      if (ticket && ticket.expires > Date.now())
        d = db
          .prepare("SELECT * FROM devices WHERE id=? AND owner=? AND revoked=0")
          .get(ticket.id, ticket.owner);
      role = "view";
    }
    if (!d) {
      socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
      socket.destroy();
      return;
    }
    sockets.handleUpgrade(req, socket, head, (ws) => {
      ws.alive = true;
      ws.on("pong", () => (ws.alive = true));
      const s = ensureState(d.id);
      if (role === "view") {
        s.viewers.add(ws);
        send(ws, {
          type: "hello",
          device: publicDevice(d),
          history: s.history,
        });
        if (s.camera && Date.now() - s.camera.at < 5000)
          send(ws, s.camera.buffer);
        ws.on("close", () => s.viewers.delete(ws));
        return;
      }
      s.publisher?.close(1000, "New device connection");
      s.publisher = ws;
      s.lastSeq = -1;
      s.at = 0;
      s.filter = new AttitudeKalman();
      broadcast(s, { type: "connection", connected: true });
      let windowStart = Date.now(),
        count = 0,
        lastCamera = 0;
      ws.on("message", (data, binary) => {
        if (s.publisher !== ws) return;
        if (Date.now() - windowStart >= 1000) {
          windowStart = Date.now();
          count = 0;
        }
        if (++count > 55) {
          ws.close(1008, "Rate exceeded");
          return;
        }
        try {
          if (binary) {
            if (Date.now() - lastCamera < 400) return;
            lastCamera = Date.now();
            if (data.length < 12 || data.length > 280000) return;
            const length = data.readUInt32BE(0);
            if (length < 2 || length > 2048 || data.length < length + 6) return;
            const meta = JSON.parse(data.subarray(4, 4 + length).toString()),
              jpeg = data.subarray(4 + length);
            if (
              meta.type !== "camera" ||
              !Number.isFinite(meta.at) ||
              !Array.isArray(meta.q) ||
              meta.q.length !== 4 ||
              !meta.q.every(Number.isFinite) ||
              Math.abs(norm(meta.q) - 1) > 0.15 ||
              jpeg[0] !== 255 ||
              jpeg[1] !== 216 ||
              !Number.isFinite(meta.width) ||
              !Number.isFinite(meta.height) ||
              meta.width < 1 ||
              meta.height < 1 ||
              meta.width > 8192 ||
              meta.height > 8192
            )
              return;
            s.camera = { at: Date.now(), buffer: Buffer.from(data) };
            broadcast(s, data);
            return;
          }
          if (data.length > 16000) return;
          const p = JSON.parse(data.toString());
          if (!validTelemetry(p) || p.seq <= s.lastSeq) return;
          s.lastSeq = p.seq;
          const receivedAt = Date.now(),
            dt = (p.at - s.at) / 1000;
          if (
            !s.at ||
            receivedAt - s.lastSeen > 2500 ||
            s.absolute !== !!p.absolute
          )
            s.filter = new AttitudeKalman();
          if (p.q) {
            if (p.gyro) s.filter.predict(p.gyro, dt);
            s.filter.update(
              normalized(p.q),
              5,
              Math.max(0.01, Math.min(0.2, dt)),
              !!p.gyro && dt > 0 && dt <= 0.15,
            );
          }
          s.absolute = !!p.absolute;
          s.at = p.at;
          s.lastSeen = receivedAt;
          const packet = {
            type: "telemetry",
            seq: p.seq,
            at: p.at,
            receivedAt,
            accel: p.accel ?? null,
            gyro: p.gyro ?? null,
            mag: p.mag ?? null,
            gps: p.gps ?? null,
            q: p.q ? s.filter.q : null,
            referenceQ: p.q ? s.filter.measured : null,
            predictedQ: s.filter.predicted,
            absolute: !!p.absolute && !!p.q,
            screenAngle: [0, 90, 180, 270].includes(p.screenAngle)
              ? p.screenAngle
              : 0,
            battery:
              typeof p.battery === "number"
                ? Math.max(0, Math.min(1, p.battery))
                : null,
            relay: !!p.relay,
            accuracy: Number.isFinite(p.accuracy) ? p.accuracy : null,
            filter: {
              innovation: s.filter.residual,
              correction: s.filter.correction,
              covariance: s.filter.p,
              gain: s.filter.gain,
              nis: s.filter.nis,
              sigma: s.filter.sigmaDeg,
            },
          };
          s.history.push(packet);
          if (s.history.length > 600) s.history.shift();
          broadcast(s, packet);
          if (p.seq % 100 === 0)
            db.prepare("UPDATE devices SET last_seen=? WHERE id=?").run(
              receivedAt,
              d.id,
            );
        } catch {
          ws.close(1008, "Invalid packet");
        }
      });
      ws.on("close", () => {
        if (s.publisher === ws) {
          s.publisher = null;
          s.camera = null;
          broadcast(s, { type: "connection", connected: false });
          db.prepare("UPDATE devices SET last_seen=? WHERE id=?").run(
            s.lastSeen || Date.now(),
            d.id,
          );
        }
      });
    });
  });
  const timer = setInterval(() => {
    for (const ws of sockets.clients) {
      if (!ws.alive) {
        ws.terminate();
        continue;
      }
      ws.alive = false;
      ws.ping();
    }
    for (const [k, t] of tickets) if (t.expires < Date.now()) tickets.delete(k);
    for (const [k, l] of limits) if (l.expires < Date.now()) limits.delete(k);
    for (const [id, s] of devices)
      if (!s.publisher && !s.viewers.size && Date.now() - s.lastSeen > 600000)
        devices.delete(id);
    db.prepare("DELETE FROM pairing WHERE expires<?").run(
      Date.now() - 86400000,
    );
  }, 15000);
  timer.unref();
  return {
    server,
    db,
    close: async () => {
      clearInterval(timer);
      for (const ws of sockets.clients) ws.terminate();
      await new Promise((resolve) => server.close(resolve));
      db.close();
    },
  };
}
if (/server\.(mjs|cjs)$/.test(process.argv[1] || "")) {
  const app = createSatellite();
  app.server.listen(Number(process.env.PORT || 3860), "0.0.0.0", () =>
    console.log("Fanous satellite service listening"),
  );
  const stop = () => app.close().then(() => process.exit(0));
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}
