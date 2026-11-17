import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
const DAY = 86400000,
  TRIAL = 900000;
const fail = (status, message) => Object.assign(Error(message), { status });
const check = (ok) => {
  if (!ok) throw fail(409, "Payment verification failed");
};
export function createBilling(
  db,
  { origin, env = process.env, fetcher = fetch, now = Date.now } = {},
) {
  db.exec(`CREATE TABLE IF NOT EXISTS satellite_accounts(owner TEXT PRIMARY KEY,email TEXT NOT NULL,trial_started INTEGER);
 CREATE TABLE IF NOT EXISTS satellite_plans(id TEXT PRIMARY KEY,name_fa TEXT NOT NULL,name_en TEXT NOT NULL,days INTEGER NOT NULL,toman INTEGER NOT NULL,usd_cents INTEGER NOT NULL,active INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS satellite_orders(id TEXT PRIMARY KEY,owner TEXT NOT NULL,email TEXT NOT NULL,plan TEXT NOT NULL,name_fa TEXT NOT NULL,name_en TEXT NOT NULL,days INTEGER NOT NULL,provider TEXT NOT NULL,currency TEXT NOT NULL,amount INTEGER NOT NULL,request_key TEXT NOT NULL,status TEXT NOT NULL,created INTEGER NOT NULL,session TEXT,unique_id TEXT,receiver TEXT,url TEXT,payment TEXT UNIQUE,paid_at INTEGER,starts INTEGER,ends INTEGER,refunded INTEGER NOT NULL DEFAULT 0,UNIQUE(owner,request_key));
 CREATE TABLE IF NOT EXISTS satellite_payment_events(id TEXT PRIMARY KEY,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS satellite_billing_audit(id INTEGER PRIMARY KEY,actor TEXT NOT NULL,at INTEGER NOT NULL,action TEXT NOT NULL,detail TEXT NOT NULL);`);
  db.prepare(
    "INSERT OR IGNORE INTO satellite_plans(id,name_fa,name_en,days,toman,usd_cents,active) VALUES('monthly','یک ماه ماهواره','Satellite monthly',30,199000,500,1)",
  ).run();
  if (
    !db
      .prepare("PRAGMA table_info(satellite_orders)")
      .all()
      .some((c) => c.name === "checked_at")
  )
    db.exec(
      "ALTER TABLE satellite_orders ADD COLUMN checked_at INTEGER NOT NULL DEFAULT 0",
    );
  for(const table of ['satellite_plans','satellite_orders']) {
    const columns=db.prepare(`PRAGMA table_info(${table})`).all();
    if(!columns.some(c=>c.name==='product'))db.exec(`ALTER TABLE ${table} ADD COLUMN product TEXT NOT NULL DEFAULT 'satellite'`);
    if(!columns.some(c=>c.name==='return_path'))db.exec(`ALTER TABLE ${table} ADD COLUMN return_path TEXT NOT NULL DEFAULT '/satellite'`);
  }
  // STRIPE_WEBHOOK_SECRET is shared configuration for Fanous products.  Keep the
  // old name as a deployment-safe fallback while existing Pods roll over.
  const webhookSecret =
    env.STRIPE_WEBHOOK_SECRET || env.SATELLITE_STRIPE_WEBHOOK_SECRET;
  const isFanous=metadata=>metadata?.app==='fanous'||metadata?.app==='fanous-satellite';
  const matchesProduct=(metadata,order)=>metadata?.app==='fanous'?metadata.product===order.product:order.product==='satellite';
  const admin = (email) =>
    String(email).toLowerCase() ===
    (env.SATELLITE_BILLING_ADMIN || "atamoradi8@gmail.com").toLowerCase();
  const stripeReady = () =>
    !!(env.SATELLITE_STRIPE_KEY && webhookSecret);
  const ezReady = () =>
    !!(
      env.SATELLITE_RELAY_URL &&
      env.SATELLITE_RELAY_KEY &&
      env.SATELLITE_WALLET_PHONE
    );
  const live = () => env.SATELLITE_STRIPE_KEY?.includes("_live_") || false;
  function account(owner, email) {
    db.prepare(
      "INSERT INTO satellite_accounts(owner,email) VALUES(?,?) ON CONFLICT(owner) DO UPDATE SET email=excluded.email",
    ).run(owner, email);
  }
  function access(owner, email, product = "satellite") {
    const row = db
        .prepare("SELECT * FROM satellite_accounts WHERE owner=?")
        .get(owner),
      t = now(),
      started = row?.trial_started ?? null;
    const paid =
      db
        .prepare(
          "SELECT max(ends) end FROM satellite_orders WHERE owner=? AND status='paid' AND refunded<amount AND product=? AND starts<=? AND ends>?",
        )
        .get(owner, product, t, t)?.end ?? null;
    const until = started == null ? null : started + TRIAL,
      isAdmin = admin(email);
    return {
      allowed: isAdmin || !!paid || (product === "satellite" && (started == null || t < until)),
      admin: isAdmin,
      trialStarted: started,
      trialEnds: until,
      trialRemainingMs:
        product !== "satellite"
          ? 0
          : started == null
            ? TRIAL
            : Math.max(0, until - t),
      paidUntil:
        db
          .prepare(
            "SELECT max(ends) end FROM satellite_orders WHERE owner=? AND status='paid' AND refunded<amount AND product=? AND ends>?",
          )
          .get(owner, product, t)?.end ?? null,
      mode: isAdmin
        ? "admin"
        : paid
          ? "paid"
          : product!=="satellite" ? "expired" : started == null
            ? "not_started"
            : t < until
              ? "trial"
              : "expired",
      serverNow: t,
    };
  }
  function start(owner, email) {
    account(owner, email);
    db.prepare(
      "UPDATE satellite_accounts SET trial_started=COALESCE(trial_started,?) WHERE owner=?",
    ).run(now(), owner);
    return access(owner, email);
  }
  function assertAccess(owner, email) {
    if (!access(owner, email).allowed)
      throw fail(
        402,
        "Your 15-minute trial has ended. Purchase a plan to continue.",
      );
  }
  const plans = (product = "satellite") =>
    db.prepare("SELECT * FROM satellite_plans WHERE product=? ORDER BY days,id").all(product);
  const orders = (owner, product = "satellite") =>
    db
      .prepare(
        "SELECT id,name_fa,name_en,days,currency,amount,status,created,paid_at,starts,ends,url,refunded FROM satellite_orders WHERE owner=? AND product=? ORDER BY created DESC LIMIT 30",
      )
      .all(owner, product);
  const catalog = (c, product = "satellite") => ({
    access: access(c.sub, c.email,product),
    plans: plans(product).filter((p) => p.active),
    orders: orders(c.sub, product),
    stripeAvailable: stripeReady(),
    stripeTestMode: !live(),
    tomanAvailable: ezReady(),
    admin: admin(c.email),
    ...(admin(c.email) ? { allPlans: plans(product) } : {}),
  });
  async function stripe(path, form, key) {
    if (!env.SATELLITE_STRIPE_KEY) throw fail(503, "Stripe is not configured");
    const r = await fetcher("https://api.stripe.com/v1/" + path, {
      method: form ? "POST" : "GET",
      headers: {
        Authorization: "Bearer " + env.SATELLITE_STRIPE_KEY,
          "User-Agent": "Fanous-payments/1.0",
        "Stripe-Version": "2026-10-28.endive",
        ...(key ? { "Idempotency-Key": key } : {}),
        ...(form
          ? { "Content-Type": "application/x-www-form-urlencoded" }
          : {}),
      },
      body: form ? new URLSearchParams(form).toString() : undefined,
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) throw fail(503, "Stripe is temporarily unavailable");
    return r.json();
  }
  async function relay(path, data) {
    if (!ezReady()) throw fail(503, "Toman payments are not configured");
    const base = new URL(env.SATELLITE_RELAY_URL);
    if (base.protocol !== "https:")
      throw fail(503, "Invalid relay configuration");
    const r = await fetcher(base.href.replace(/\/$/, "") + "/broker/" + path, {
      method: data ? "POST" : "GET",
      headers: {
        "x-api-key": env.SATELLITE_RELAY_KEY,
          "User-Agent": "Fanous-payments/1.0",
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(30000),
    });
    if (!r.ok)
      throw fail(503, "Iranian payment gateway is temporarily unavailable");
    const value = await r.json();
    if (value.resultCode !== 0)
      throw fail(
        409,
        "Ezpay rejected the request (code " + String(value.resultCode) + ")",
      );
    return value;
  }
  function grant(id, payment) {
    db.exec("BEGIN IMMEDIATE");
    try {
      const o = db.prepare("SELECT * FROM satellite_orders WHERE id=?").get(id);
      check(o);
      if (o.paid_at == null && o.status !== "refunded") {
        const a = access(o.owner, o.email,o.product),
          t = now(),
          starts = Math.max(
            t,
            a.paidUntil ?? 0,
            o.product === "satellite" ? a.trialEnds ?? 0 : 0,
          ),
          ends = starts + o.days * DAY;
        db.prepare(
          "UPDATE satellite_orders SET status='paid',payment=?,paid_at=?,starts=?,ends=? WHERE id=? AND paid_at IS NULL",
        ).run(payment, t, starts, ends, id);
      }
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
  const safeOrder = (id, owner) => {
    const o = db
      .prepare("SELECT * FROM satellite_orders WHERE id=? AND owner=?")
      .get(id, owner);
    if (!o) throw fail(404, "Order not found");
    return o;
  };
  const pending = new Map();
  async function checkout(c, p, country, product = "satellite") {
    if (!/^[a-zA-Z0-9-]{16,80}$/.test(p.requestKey || ""))
      throw fail(400, "Invalid checkout request");
    if (!["USD", "IRT"].includes(p.currency))
      throw fail(400, "Choose a payment method");
    account(c.sub, c.email);
    let o = db
      .prepare("SELECT * FROM satellite_orders WHERE owner=? AND request_key=?")
      .get(c.sub, p.requestKey);
    if (o?.status === 'expired') {
      db.prepare("UPDATE satellite_orders SET request_key=? WHERE id=? AND status='expired'").run('expired-'+o.id,o.id);
      o=null;
    }
    if (o)
      check(
        o.plan === p.plan && o.currency === p.currency && o.product === product,
      );
    else {
      const plan = db
        .prepare("SELECT * FROM satellite_plans WHERE id=? AND product=? AND active=1")
        .get(p.plan, product);
      if (!plan) throw fail(404, "Plan unavailable");
      if (
        db
          .prepare(
            "SELECT count(*) n FROM satellite_orders WHERE owner=? AND created>?",
          )
          .get(c.sub, now() - 3600000).n >= 10
      )
        throw fail(429, "Too many payment requests");
      if (
        (p.currency === "USD" && !stripeReady()) ||
        (p.currency === "IRT" && !ezReady())
      )
        throw fail(503, "Payment method is not configured");
      if (p.currency === "IRT" && country && country !== "IR")
        throw fail(
          403,
          "Ezpay requires an Iranian connection. Turn off your VPN or use Stripe.",
        );
      const id = randomUUID();
      db.prepare(
        "INSERT INTO satellite_orders(id,owner,email,plan,name_fa,name_en,days,provider,currency,amount,request_key,status,created,receiver,product,return_path) VALUES(?,?,?,?,?,?,?,?,?,?,?,'created',?,?,?,?)",
      ).run(
        id,
        c.sub,
        c.email,
        plan.id,
        plan.name_fa,
        plan.name_en,
        plan.days,
        p.currency === "IRT" ? "ezpay" : "stripe",
        p.currency,
        p.currency === "IRT" ? plan.toman : plan.usd_cents,
        p.requestKey,
        now(),
        p.currency === "IRT" ? env.SATELLITE_WALLET_PHONE : null,
        plan.product,
        plan.return_path,
      );
      o = safeOrder(id, c.sub);
    }
    if (o.url || o.paid_at) return { id: o.id, status: o.status, url: o.url };
    if (now() - o.created > 3000000)
      throw fail(409, "Checkout expired. Start a new payment.");
    if (pending.has(o.id)) return pending.get(o.id);
    const task = (async () => {
      let session,
        url,
        unique = null;
      if (o.provider === "stripe") {
        const metadata = {
          "metadata[app]": "fanous",
          "metadata[product]": o.product,
          "metadata[order_id]": o.id,
          "metadata[user_id]": o.owner,
          "payment_intent_data[metadata][app]": "fanous",
          "payment_intent_data[metadata][product]": o.product,
          "payment_intent_data[metadata][order_id]": o.id,
          "payment_intent_data[metadata][user_id]": o.owner,
        };
        const s = await stripe(
          "checkout/sessions",
          {
            mode: "payment",
            customer_email: c.email,
            client_reference_id: o.owner,
            success_url: origin + o.return_path + "?payment=success&order=" + o.id,
            cancel_url: origin + o.return_path + "?payment=cancelled&order=" + o.id,
            expires_at: String(Math.floor(o.created / 1000) + 3600),
            "line_items[0][quantity]": "1",
            "line_items[0][price_data][currency]": "usd",
            "line_items[0][price_data][unit_amount]": String(o.amount),
            "line_items[0][price_data][product_data][name]":
              "Fanous · " + o.name_en,
            "line_items[0][price_data][product_data][description]":
              o.days + " days · manual renewal, no automatic charges",
            "adaptive_pricing[enabled]": "false",
            "automatic_tax[enabled]": "false",
            ...metadata,
          },
          "fanous-satellite-" + o.id,
        );
        check(
          /^cs_/.test(s.id) &&
            s.livemode === live() &&
            new URL(s.url).hostname === "checkout.stripe.com" && new URL(s.url).protocol === "https:",
        );
        session = s.id;
        url = s.url;
      } else {
        const status = await relay(
          "wallet/" + encodeURIComponent(o.receiver) + "/status",
        );
        if (status.access !== "ACTIVE" || status.identityVerified !== true)
          throw fail(503, "Receiving wallet is not ready");
        const factor = "fanous-satellite-" + o.id.replaceAll("-", "");
        const r = await relay("payments", {
          phoneNumber: o.receiver,
          factorNumber: factor,
          amount: o.amount * 10,
          subject: "اشتراک ماهواره فانوس خیال",
          payerName: c.email.split("@")[0].slice(0, 100),
          description: "Fanous satellite · " + o.days + " days",
        });
        const u = new URL(r.paymentLink);
        check(
          u.protocol === "https:" &&
            (u.hostname === "ezpay.ir" || u.hostname.endsWith(".ezpay.ir")) &&
            typeof r.uniqueId === "string" &&
            /^[a-zA-Z0-9_-]{1,100}$/.test(r.uniqueId),
        );
        session = factor;
        unique = r.uniqueId;
        url = /^[a-z0-9]+$/.test(unique)
          ? "https://ipg.ezpay.ir/pdu/" + unique
          : r.paymentLink;
      }
      db.prepare(
        "UPDATE satellite_orders SET session=?,unique_id=?,url=?,status=CASE WHEN status='created' THEN 'checkout_open' ELSE status END WHERE id=?",
      ).run(session, unique, url, o.id);
      return { id: o.id, status: safeOrder(o.id, c.sub).status, url };
    })();
    pending.set(o.id, task);
    try {
      return await task;
    } finally {
      pending.delete(o.id);
    }
  }
  async function applyStripe(s) {
    if (!isFanous(s.metadata)) return;
    const o = db
      .prepare(
        "SELECT * FROM satellite_orders WHERE id=? AND provider='stripe'",
      )
      .get(s.metadata.order_id);
    if (!o) return;
    check(
      matchesProduct(s.metadata, o) &&
        (!o.session || o.session === s.id) &&
        s.metadata.user_id === o.owner &&
        s.client_reference_id === o.owner &&
        s.currency === "usd" &&
        s.amount_total === o.amount &&
        s.livemode === live() &&
        s.mode === "payment",
    );
    if (!o.session)
      db.prepare(
        "UPDATE satellite_orders SET session=? WHERE id=? AND session IS NULL",
      ).run(s.id, o.id);
    if (s.payment_status === "paid") {
      const lines = s.line_items?.data;
      check(
        lines?.length === 1 &&
          lines[0].quantity === 1 &&
          lines[0].amount_total === o.amount &&
          /^pi_/.test(s.payment_intent),
      );
      grant(o.id, "stripe:" + s.payment_intent);
    } else if (s.status === "expired")
      db.prepare(
        "UPDATE satellite_orders SET status='expired' WHERE id=? AND paid_at IS NULL",
      ).run(o.id);
  }
  async function reconcile(c, id) {
    const o = safeOrder(id, c.sub);
    if (o.refunded || !o.session) return { status: o.status };
    if (o.provider === "stripe")
      await applyStripe(
        await stripe(
          "checkout/sessions/" +
            encodeURIComponent(o.session) +
            "?expand[]=line_items",
        ),
      );
    else {
      const params = new URLSearchParams({
          phoneNumber: o.receiver,
          factorNumber: o.session,
          amount: String(o.amount * 10),
        }),
        p = await relay(
          "payments/" + encodeURIComponent(o.unique_id) + "?" + params,
        );
      check(p.requestid === o.unique_id && Number(p.amount) === o.amount * 10);
      if (p.status === "SUCCESS") {
        check(
          typeof p.transactionid === "string" &&
            p.transactionid.length > 0 &&
            p.transactionid.length <= 120,
        );
        grant(o.id, "ezpay:" + p.transactionid);
      } else if (["REFUNDED", "REVERSED"].includes(p.status) && o.paid_at)
        db.prepare(
          "UPDATE satellite_orders SET status='refunded',refunded=amount WHERE id=?",
        ).run(o.id);
    }
    return {
      status: safeOrder(id, c.sub).status,
      access: access(c.sub, c.email, o.product),
    };
  }
  async function webhook(raw, signature) {
    if (!stripeReady()) throw fail(503, "Stripe webhook is not configured");
    const parts = String(signature || "").split(","),
      t = parts.find((p) => p.startsWith("t="))?.slice(2),
      expected = createHmac("sha256", webhookSecret)
        .update(t + "." + raw)
        .digest();
    if (
      !t ||
      !Number.isFinite(Number(t)) ||
      Math.abs(now() / 1000 - Number(t)) > 300 ||
      !parts
        .filter((p) => p.startsWith("v1="))
        .some((p) => {
          const b = Buffer.from(p.slice(3), "hex");
          return b.length === expected.length && timingSafeEqual(b, expected);
        })
    )
      throw fail(400, "Invalid webhook signature");
    const event = JSON.parse(raw);
    check(typeof event.id === "string" && event.livemode === live());
    if (
      db
        .prepare("SELECT id FROM satellite_payment_events WHERE id=?")
        .get(event.id)
    )
      return;
    const object = event.data?.object;
    if (
      event.type.startsWith("checkout.session.") &&
      isFanous(object?.metadata)
    )
      await applyStripe(
        await stripe(
          "checkout/sessions/" +
            encodeURIComponent(object.id) +
            "?expand[]=line_items",
        ),
      );
    if (event.type === "charge.refunded") {
      const charge = await stripe("charges/" + encodeURIComponent(object.id));
      const intent = charge.payment_intent;
      if (typeof intent === "string") {
        const payment = await stripe(
          "payment_intents/" + encodeURIComponent(intent),
        );
        if (isFanous(payment.metadata)) {
          const o = db
            .prepare(
              "SELECT * FROM satellite_orders WHERE id=? AND provider='stripe'",
            )
            .get(payment.metadata.order_id);
          if (o) {
            check(
              matchesProduct(payment.metadata, o) &&
                payment.metadata.user_id === o.owner &&
                charge.amount === o.amount &&
                charge.currency === "usd" &&
                charge.livemode === live() &&
                charge.amount_refunded >= 0 &&
                charge.amount_refunded <= o.amount,
            );
            db.prepare(
              "UPDATE satellite_orders SET refunded=max(refunded,?),status=CASE WHEN ?>=amount THEN 'refunded' ELSE status END WHERE id=?",
            ).run(charge.amount_refunded, charge.amount_refunded, o.id);
          }
        }
      }
    }
    db.prepare(
      "INSERT OR IGNORE INTO satellite_payment_events VALUES(?,?)",
    ).run(event.id, now());
  }
  function updatePlan(c, p) {
    if (!admin(c.email)) throw fail(403, "Administrator required");
    if (
      !/^[a-z0-9-]{1,40}$/.test(p.id || "") ||
      typeof p.name_fa !== "string" ||
      !p.name_fa.trim() ||
      p.name_fa.length > 100 ||
      typeof p.name_en !== "string" ||
      !p.name_en.trim() ||
      p.name_en.length > 100 ||
      !Number.isInteger(p.days) ||
      p.days < 1 ||
      p.days > 3660 ||
      !Number.isInteger(p.toman) ||
      p.toman < 1000 ||
      p.toman > 400000000 ||
      !Number.isInteger(p.usd_cents) ||
      p.usd_cents < 50 ||
      p.usd_cents > 99999999 ||
      typeof p.active !== "boolean" ||
      !/^[a-z0-9-]{1,40}$/.test(p.product || "satellite") ||
      !/^\/(?!\/)[a-zA-Z0-9/_-]*$/.test(p.return_path || "/satellite")
    )
      throw fail(
        400,
        "Invalid plan. Use positive days, toman ≥ 1,000 and USD cents ≥ 50.",
      );
    db.prepare(
      "INSERT INTO satellite_plans(id,name_fa,name_en,days,toman,usd_cents,active,product,return_path) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name_fa=excluded.name_fa,name_en=excluded.name_en,days=excluded.days,toman=excluded.toman,usd_cents=excluded.usd_cents,active=excluded.active,product=excluded.product,return_path=excluded.return_path",
    ).run(
      p.id,
      p.name_fa.trim(),
      p.name_en.trim(),
      p.days,
      p.toman,
      p.usd_cents,
      p.active ? 1 : 0,
      p.product || "satellite",
      p.return_path || "/satellite",
    );
    db.prepare(
      "INSERT INTO satellite_billing_audit(actor,at,action,detail) VALUES(?,?,?,?)",
    ).run(c.email, now(), "plan_updated", JSON.stringify(p));
    return catalog(c);
  }
  let reconciling = false;
  const timer = setInterval(async () => {
    if (reconciling) return;
    reconciling = true;
    try {
      const rows = db
        .prepare(
          "SELECT * FROM satellite_orders WHERE session IS NOT NULL AND (status IN ('created','checkout_open') OR (provider='ezpay' AND status='paid' AND ends>?)) ORDER BY checked_at,created LIMIT 30",
        )
        .all(now());
      for (const o of rows)
        try {
          await reconcile({ sub: o.owner, email: o.email }, o.id);
        } catch {
        } finally {
          db.prepare("UPDATE satellite_orders SET checked_at=? WHERE id=?").run(
            now(),
            o.id,
          );
        }
    } finally {
      reconciling = false;
    }
  }, 60000);
  timer.unref();
  return {
    access,
    start,
    assertAccess,
    catalog,
    checkout,
    reconcile,
    webhook,
    updatePlan,
    admin,
    grant,
    stop: () => clearInterval(timer),
  };
}
