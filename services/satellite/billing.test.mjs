import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { createHmac } from "node:crypto";
import { createBilling } from "./billing.mjs";
const owner = { sub: "owner", email: "owner@example.com" },
  admin = { sub: "admin", email: "atamoradi8@gmail.com" };
test("Trial lasts exactly 15 elapsed minutes; reconnect, other devices and restarts cannot reset it; admin is exempt", () => {
  const db = new DatabaseSync(":memory:");
  let clock = 1000000;
  let b = createBilling(db, {
    origin: "https://fanous.online",
    now: () => clock,
    env: {},
  });
  assert.equal(b.access(owner.sub, owner.email).mode, "not_started");
  b.start(owner.sub, owner.email);
  clock += 899999;
  b.start(owner.sub, owner.email);
  assert.equal(b.access(owner.sub, owner.email).allowed, true);
  b.stop();
  b = createBilling(db, {
    origin: "https://fanous.online",
    now: () => clock,
    env: {},
  });
  clock++;
  assert.equal(b.access(owner.sub, owner.email).allowed, false);
  assert.throws(
    () => b.assertAccess(owner.sub, owner.email),
    (e) => e.status === 402,
  );
  b.start(admin.sub, admin.email);
  clock += 999999999;
  assert.equal(b.access(admin.sub, admin.email).allowed, true);
  b.stop();
  db.close();
});
test("Stripe snapshots prices, rejects amount mismatches, verifies signatures, fulfils once, and enforces admin/owner boundaries", async () => {
  const db = new DatabaseSync(":memory:");
  let clock = 2000000,
    amount = 500,
    session;
  const env = {
    SATELLITE_STRIPE_KEY: "rk_test_fixture",
    SATELLITE_STRIPE_WEBHOOK_SECRET: "whsec_fixture",
  };
  const fetcher = async (url, options) => {
    if (url.endsWith("checkout/sessions")) {
      const f = new URLSearchParams(options.body);
      session = {
        id: "cs_test_fixture",
        url: "https://checkout.stripe.com/test",
        livemode: false,
        mode: "payment",
        currency: "usd",
        amount_total: 500,
        client_reference_id: owner.sub,
        metadata: {
          app: "fanous-satellite",
          order_id: f.get("metadata[order_id]"),
          user_id: owner.sub,
        },
        payment_intent: "pi_fixture",
        payment_status: "paid",
        line_items: { data: [{ quantity: 1, amount_total: 500 }] },
      };
    }
    return {
      ok: true,
      json: async () => ({ ...session, amount_total: amount }),
    };
  };
  const b = createBilling(db, {
    origin: "https://fanous.online",
    env,
    now: () => clock,
    fetcher,
  });
  try {
    b.start(owner.sub, owner.email);
    clock += 900000;
    const plan = {
      id: "monthly",
      name_fa: "ماه",
      name_en: "Month",
      days: 30,
      toman: 199000,
      usd_cents: 500,
      active: true,
    };
    assert.throws(
      () => b.updatePlan(owner, plan),
      (e) => e.status === 403,
    );
    const order = await b.checkout(owner, {
      plan: "monthly",
      currency: "USD",
      requestKey: "unique-request-key-12345",
    });
    b.updatePlan(admin, { ...plan, usd_cents: 999, days: 15 });
    amount = 499;
    await assert.rejects(() => b.reconcile(owner, order.id), /verification/);
    assert.equal(b.access(owner.sub, owner.email).allowed, false);
    amount = 500;
    await assert.rejects(
      () => b.reconcile({ sub: "other", email: "other@example.com" }, order.id),
      (e) => e.status === 404,
    );
    const event = JSON.stringify({
        id: "evt_fixture",
        livemode: false,
        type: "checkout.session.completed",
        data: { object: session },
      }),
      t = Math.floor(clock / 1000),
      signature =
        "t=" +
        t +
        ",v1=" +
        createHmac("sha256", env.SATELLITE_STRIPE_WEBHOOK_SECRET)
          .update(t + "." + event)
          .digest("hex");
    await assert.rejects(
      () => b.webhook(event, signature + "bad"),
      (e) => e.status === 400,
    );
    await b.webhook(event, signature);
    const end = b.access(owner.sub, owner.email).paidUntil;
    assert.equal(end, clock + 30 * 86400000);
    await b.webhook(event, signature);
    await b.reconcile(owner, order.id);
    assert.equal(b.access(owner.sub, owner.email).paidUntil, end);
    assert.equal(
      db.prepare("SELECT count(*) n FROM satellite_payment_events").get().n,
      1,
    );
  } finally {
    b.stop();
    db.close();
  }
});
test("Ezpay uses rial conversion and exact factor/request/amount, and rejects foreign-region checkout", async () => {
  const db = new DatabaseSync(":memory:");
  let clock = 5000000,
    amount = 1990000,
    created;
  const env = {
    SATELLITE_RELAY_URL: "https://relay.example",
    SATELLITE_RELAY_KEY: "private",
    SATELLITE_WALLET_PHONE: "09120000000",
  };
  const fetcher = async (url, options) => {
    let data;
    if (url.endsWith("/status"))
      data = { resultCode: 0, access: "ACTIVE", identityVerified: true };
    else if (options.method === "POST") {
      created = JSON.parse(options.body);
      data = {
        resultCode: 0,
        uniqueId: "fixture1",
        paymentLink: "https://ezpay.ir/fixture1",
      };
    } else
      data = {
        resultCode: 0,
        requestid: "fixture1",
        amount,
        status: "SUCCESS",
        transactionid: "settlement1",
      };
    return { ok: true, json: async () => data };
  };
  const b = createBilling(db, {
    origin: "https://fanous.online",
    env,
    now: () => clock,
    fetcher,
  });
  try {
    b.start(owner.sub, owner.email);
    clock += 900001;
    await assert.rejects(
      () =>
        b.checkout(
          owner,
          {
            plan: "monthly",
            currency: "IRT",
            requestKey: "foreign-request-key-1234",
          },
          "NZ",
        ),
      (e) => e.status === 403,
    );
    const order = await b.checkout(
      owner,
      {
        plan: "monthly",
        currency: "IRT",
        requestKey: "iranian-request-key-1234",
      },
      "IR",
    );
    assert.equal(created.amount, 1990000);
    assert.ok(created.factorNumber.startsWith("fanous-satellite-"));
    amount = 199000;
    await assert.rejects(() => b.reconcile(owner, order.id), /verification/);
    assert.equal(b.access(owner.sub, owner.email).allowed, false);
    amount = 1990000;
    await b.reconcile(owner, order.id);
    const end = b.access(owner.sub, owner.email).paidUntil;
    await b.reconcile(owner, order.id);
    assert.equal(b.access(owner.sub, owner.email).paidUntil, end);
  } finally {
    b.stop();
    db.close();
  }
});
