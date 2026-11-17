import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { WebSocket } from "ws";
import { createSatellite, validTelemetry } from "./server.mjs";
import { signClaims } from "../../src/lib/satellite/auth.ts";
test("Pairing approval, publishing/viewing roles, owner isolation, one-use tickets and revocation", async () => {
  const secret = "isolated-test-secret-".repeat(3),
    app = createSatellite({
      secret,
      dbPath: ":memory:",
      origin: "http://localhost",
    });
  app.server.listen(0, "127.0.0.1");
  await once(app.server, "listening");
  const base = "http://127.0.0.1:" + app.server.address().port;
  const token = (id, email) =>
    signClaims(
      {
        aud: "control",
        sub: id,
        email,
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      secret,
    );
  const call = async (path, data, auth) => {
    const r = await fetch(base + path, {
      method: data ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: "Bearer " + auth } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return { status: r.status, data: await r.json() };
  };
  const owner = token("owner", "owner@example.com"),
    other = token("other", "other@example.com");
  try {
    const request = await call("/pair/request", {
      email: "owner@example.com",
      name: "Phone",
      model: "Android",
      installationId: "a".repeat(64),
    });
    assert.equal(request.status, 201);
    const pair = request.data;
    assert.equal(
      (await call("/pair/claim", { id: pair.id, secret: "wrong" })).status,
      401,
    );
    assert.equal(
      (
        await call(
          "/v1/approve",
          { id: pair.id, code: pair.code, approve: true },
          other,
        )
      ).status,
      404,
    );
    assert.equal(
      (await call("/v1/requests", null, other)).data.requests.length,
      0,
    );
    assert.equal(
      (await call("/pair/claim", { id: pair.id, secret: pair.secret })).data
        .status,
      "pending",
    );
    assert.equal(
      (
        await call(
          "/v1/approve",
          { id: pair.id, code: pair.code, approve: true },
          owner,
        )
      ).status,
      200,
    );
    const claimed = (
      await call("/pair/claim", { id: pair.id, secret: pair.secret })
    ).data;
    assert.ok(claimed.token);
    const id = claimed.deviceId;
    assert.equal(
      (
        await call("/pair/request", {
          email: "owner@example.com",
          name: "Duplicate phone",
          model: "Android",
          installationId: "a".repeat(64),
        })
      ).status,
      409,
    );
    assert.equal(
      (await call("/v1/devices", null, other)).data.devices.length,
      0,
    );
    assert.equal((await call("/v1/ticket", { id }, other)).status, 404);
    assert.equal((await call("/v1/devices", null, claimed.token)).status, 401);
    const publisher = new WebSocket(base.replace("http", "ws") + "/device", {
      headers: { Authorization: "Bearer " + claimed.token },
    });
    await once(publisher, "open");
    const ticket = (await call("/v1/ticket", { id }, owner)).data.ticket;
    const viewer = new WebSocket(
      base.replace("http", "ws") + "/view?ticket=" + ticket,
      { origin: "http://localhost" },
    );
    const hello = once(viewer, "message");
    await once(viewer, "open");
    assert.equal(JSON.parse((await hello)[0]).type, "hello");
    const received = once(viewer, "message");
    publisher.send(
      JSON.stringify({
        type: "telemetry",
        seq: 1,
        at: Date.now(),
        q: [0, 0, 0, 1],
        absolute: true,
        accel: [0, 0, 9.8],
        gyro: [0, 0, 0],
        mag: [20, 30, -40],
        gps: null,
        screenAngle: 0,
      }),
    );
    const packet = JSON.parse((await received)[0]);
    assert.equal(packet.type, "telemetry");
    assert.deepEqual(packet.mag, [20, 30, -40]);
    assert.ok(packet.filter.covariance);
    assert.equal((await call("/v1/ticket", { id }, other)).status, 404);
    const metadata = Buffer.from(
      JSON.stringify({
        type: "camera",
        at: Date.now(),
        q: [0, 0, 0, 1],
        width: 640,
        height: 480,
        screenAngle: 0,
        absolute: true,
      }),
    );
    const header = Buffer.alloc(4);
    header.writeUInt32BE(metadata.length);
    const image = Buffer.concat([
      header,
      metadata,
      Buffer.from([255, 216, 255, 217]),
    ]);
    const cameraReceived = once(viewer, "message");
    publisher.send(image);
    const [cameraData, isBinary] = await cameraReceived;
    assert.equal(isBinary, true);
    assert.deepEqual(cameraData, image);
    const denied = new WebSocket(
      base.replace("http", "ws") +
        "/view?ticket=" +
        (await call("/v1/ticket", { id }, owner)).data.ticket,
      { origin: "https://other.invalid" },
    );
    assert.ok((await once(denied, "error"))[0]);
    const reused = new WebSocket(
      base.replace("http", "ws") + "/view?ticket=" + ticket,
      { origin: "http://localhost" },
    );
    assert.ok((await once(reused, "error"))[0]);
    const closed = once(viewer, "close");
    app.db
      .prepare("UPDATE satellite_accounts SET trial_started=? WHERE owner=?")
      .run(Date.now() - 900001, "owner");
    assert.equal((await call("/v1/ticket", { id }, owner)).status, 402);
    assert.equal((await closed)[0], 4003);
    assert.equal((await call("/device/unpair", {}, claimed.token)).status, 200);
    await closed;
    assert.equal((await call("/v1/ticket", { id }, owner)).status, 404);
    assert.equal(
      (
        await call("/pair/request", {
          email: "owner@example.com",
          name: "Repaired phone",
          model: "Android",
          installationId: "a".repeat(64),
        })
      ).status,
      201,
    );
    const expired = (
      await call("/pair/request", {
        email: "owner@example.com",
        name: "Expired",
        model: "Test",
        installationId: "b".repeat(64),
      })
    ).data;
    app.db
      .prepare("UPDATE pairing SET expires=? WHERE id=?")
      .run(Date.now() - 1, expired.id);
    assert.equal(
      (await call("/pair/claim", { id: expired.id, secret: expired.secret }))
        .status,
      410,
    );
    publisher.terminate();
    viewer.terminate();
  } finally {
    await app.close();
  }
});
test("Malformed quaternion, coordinates and unbounded sensor fields are rejected", () => {
  const p = {
    type: "telemetry",
    seq: 1,
    at: 1,
    q: [0, 0, 0, 1],
    accel: [0, 0, 9.8],
    gyro: null,
    mag: null,
  };
  assert.ok(validTelemetry(p));
  assert.equal(validTelemetry({ ...p, q: [0, 0, 0, 0] }), false);
  assert.equal(validTelemetry({ ...p, mag: [1, 2, Infinity] }), false);
  assert.equal(
    validTelemetry({ ...p, gps: { lat: 120, lon: 0, accuracy: 1, at: 1 } }),
    false,
  );
});
