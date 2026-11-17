"use client";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/language/Language";
import { useSignInDialog } from "@/components/auth/AuthProvider";
type Plan = {
  id: string;
  name_fa: string;
  name_en: string;
  days: number;
  toman: number;
  usd_cents: number;
  active: number | boolean;
};
type Access = {
  allowed: boolean;
  mode: string;
  trialEnds: number | null;
  trialRemainingMs: number;
  paidUntil: number | null;
  serverNow: number;
};
type Order = {
  id: string;
  name_fa: string;
  name_en: string;
  status: string;
  currency: string;
  amount: number;
  url: string | null;
  ends: number | null;
};
type Catalog = {
  access: Access;
  plans: Plan[];
  allPlans?: Plan[];
  orders: Order[];
  stripeAvailable: boolean;
  tomanAvailable: boolean;
  stripeTestMode: boolean;
  admin: boolean;
};
async function call(path: string, data?: object) {
  const r = await fetch("/api/satellite/" + path, {
    method: data ? "POST" : "GET",
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
    cache: "no-store",
  });
  const v = await r.json();
  if (!r.ok) throw Error(v.error || "Payment unavailable");
  return v;
}
export function BillingPanel({
  onAccess,
}: {
  onAccess: (allowed: boolean) => void;
}) {
  const { t, fa } = useLanguage(),
    { data: session } = useSession(),
    signIn = useSignInDialog();
  const userId = session?.user?.id;
  const [catalog, setCatalog] = useState<Catalog | null>(null),
    [publicPlans, setPublicPlans] = useState<Plan[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(""),
    [tick, setTick] = useState(0),
    [received, setReceived] = useState(Date.now());
  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      const c = await call("billing");
      setCatalog(c);
      setReceived(Date.now());
      onAccess(c.access.allowed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Billing unavailable");
    }
  }, [userId, onAccess]);
  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), 10000);
    return () => clearInterval(id);
  }, [refresh]);
  useEffect(() => {
    fetch("/satellite-api/billing/plans")
      .then((r) => (r.ok ? r.json() : []))
      .then(setPublicPlans)
      .catch(() => {});
  }, []);
  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!userId) return;
    const query = new URLSearchParams(location.search),
      id = query.get("order");
    if (!id || query.get("payment") !== "success") return;
    call("billing/reconcile", { id })
      .then(() => {
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const k = sessionStorage.key(i);
          if (k?.startsWith("fanous-checkout-" + userId + "-"))
            sessionStorage.removeItem(k);
        }
        return refresh();
      })
      .catch((e) => setError(e.message));
  }, [userId, refresh]);
  const access = catalog?.access,
    remaining = access
      ? Math.max(
          0,
          access.trialRemainingMs -
            (access.mode === "trial"
              ? Math.max(0, (tick || Date.now()) - received)
              : 0),
        )
      : 900000;
  useEffect(() => {
    if (access?.mode === "trial" && remaining === 0) onAccess(false);
  }, [remaining, access?.mode, onAccess]);
  const action = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment unavailable");
    } finally {
      setBusy("");
    }
  };
  const purchase = (plan: Plan, currency: string) => {
    if (!userId) {
      signIn();
      return;
    }
    void action(plan.id + currency, async () => {
      const storage =
        "fanous-checkout-" + userId + "-" + plan.id + "-" + currency;
      let key = sessionStorage.getItem(storage);
      if (!key) {
        key = crypto.randomUUID();
        sessionStorage.setItem(storage, key);
      }
      let order = await call("billing/checkout", {
        plan: plan.id,
        currency,
        requestKey: key,
      });
      if (order.status === "paid") {
        key = crypto.randomUUID();
        sessionStorage.setItem(storage, key);
        order = await call("billing/checkout", {
          plan: plan.id,
          currency,
          requestKey: key,
        });
      }
      if (order.url) location.assign(order.url);
    });
  };
  const status = (s: string) =>
    ({
      paid: t("پرداخت‌شده", "Paid"),
      checkout_open: t("منتظر پرداخت", "Awaiting payment"),
      created: t("در حال آماده‌سازی", "Preparing"),
      expired: t("منقضی", "Expired"),
      refunded: t("بازپرداخت‌شده", "Refunded"),
    })[s] || s;
  return (
    <section className="sensor-panel space-y-4" id="satellite-plans">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2>
            {t("آزمایش رایگان و طرح‌های ماهواره", "Satellite trial & plans")}
          </h2>
          <p className="sensor-note">
            {t(
              "۱۵ دقیقه از نخستین اتصال گوشی؛ این زمان پیوسته است و با قطع و وصل از نو شروع نمی‌شود. پس از آن برای استفاده، طرح فعال لازم است.",
              "15 elapsed minutes from your first phone connection. Reconnecting does not reset it. An active plan is required afterwards.",
            )}
          </p>
        </div>
        {access && (
          <strong
            className="rounded-xl border border-[var(--border)] p-3 text-[var(--gold-soft)]"
            role="status"
          >
            {access.mode === "admin"
              ? t("دسترسی مدیر · نامحدود", "Administrator · unrestricted")
              : access.mode === "paid"
                ? t("طرح فعال", "Plan active")
                : access.mode === "not_started"
                  ? t("۱۵ دقیقه آمادهٔ شروع", "15 minutes ready to start")
                  : remaining > 0
                    ? t("زمان باقی‌مانده: ", "Remaining: ") +
                      Math.floor(remaining / 60000) +
                      ":" +
                      String(Math.floor(remaining / 1000) % 60).padStart(2, "0")
                    : t(
                        "زمان آزمایش تمام شد؛ طرح تهیه کن",
                        "Trial ended · choose a plan",
                      )}
          </strong>
        )}
      </div>
      {access?.paidUntil && (
        <p className="text-sm">
          {t("اعتبار خریدها تا: ", "Purchased access through: ")}
          {new Date(access.paidUntil).toLocaleString(fa ? "fa-IR" : "en-NZ")}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-[var(--rose-ink)]">
          {error}{" "}
          <button className="underline" onClick={() => void refresh()}>
            {t("تلاش دوباره", "Retry")}
          </button>
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {(catalog?.plans ?? publicPlans).map((plan) => (
          <article
            key={plan.id}
            className="rounded-xl border border-[var(--border)] p-4 space-y-3"
          >
            <h3 className="font-semibold text-lg">
              {fa ? plan.name_fa : plan.name_en}
            </h3>
            <p className="text-sm">
              {plan.days}{" "}
              {t(
                "روز دسترسی به حسگر، دوربین، نمودار و شبیه‌سازی",
                "days of sensors, camera, charts and simulation",
              )}
            </p>
            <div className="text-xl text-[var(--gold-soft)]">
              {plan.toman.toLocaleString(fa ? "fa-IR" : "en-NZ")}{" "}
              {t("تومان", "toman")}{" "}
              <span className="text-sm">
                / US${(plan.usd_cents / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="sensor-primary"
                disabled={!!busy || (!!userId && !catalog?.tomanAvailable)}
                onClick={() => purchase(plan, "IRT")}
              >
                {t("پرداخت تومانی · ایزی‌پی", "Pay in toman · Ezpay")}
              </button>
              <button
                className="sensor-button"
                disabled={!!busy || (!!userId && !catalog?.stripeAvailable)}
                onClick={() => purchase(plan, "USD")}
              >
                {t("پرداخت بین‌المللی · Stripe", "International · Stripe")}
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="sensor-note">
        {t(
          "خرید دوره‌ای با تمدید دستی؛ برداشت خودکار ندارد. قیمت و مدت در لحظهٔ سفارش ثبت می‌شود. پرداخت تومانی به اتصال داخل ایران نیاز دارد؛ پس از پرداخت ایزی‌پی به همین صفحه برگرد و «بررسی پرداخت» را بزن. فعال‌سازی فقط پس از تأیید سرور انجام می‌شود.",
          "One-time purchase with manual renewal; no automatic charges. Price and duration are fixed when the order is created. Ezpay requires an Iranian connection; return here and choose “Check payment” afterwards. Access activates only after server verification.",
        )}
      </p>
      {catalog?.stripeTestMode && catalog.stripeAvailable && (
        <p className="sensor-note">
          {t("Stripe در حالت آزمایشی است.", "Stripe is in test mode.")}
        </p>
      )}
      {catalog && !catalog.stripeAvailable && (
        <p className="sensor-note">
          {t(
            "پرداخت بین‌المللی پس از تکمیل تنظیمات Stripe فعال می‌شود.",
            "International payment will become available after Stripe setup is completed.",
          )}
        </p>
      )}
      {!!catalog?.orders.length && (
        <details>
          <summary>
            {t("خریدها و بررسی پرداخت", "Purchases & payment status")}
          </summary>
          <div className="mt-3 space-y-3">
            {catalog.orders.map((o) => (
              <div
                key={o.id}
                className="rounded border border-[var(--border)] p-3 flex flex-wrap gap-3 items-center"
              >
                <span className="grow">
                  {fa ? o.name_fa : o.name_en} · {status(o.status)} ·{" "}
                  {o.currency === "IRT"
                    ? o.amount.toLocaleString()
                    : (o.amount / 100).toFixed(2)}{" "}
                  {o.currency}
                </span>
                {o.url && o.status === "checkout_open" && (
                  <a className="sensor-button" href={o.url}>
                    {t("ادامهٔ پرداخت", "Continue payment")}
                  </a>
                )}
                <button
                  className="sensor-button"
                  disabled={!!busy}
                  onClick={() =>
                    void action(o.id, async () => {
                      await call("billing/reconcile", { id: o.id });
                      await refresh();
                    })
                  }
                >
                  {t("بررسی پرداخت", "Check payment")}
                </button>
              </div>
            ))}
          </div>
        </details>
      )}
      {catalog?.admin && (
        <details>
          <summary>
            {t("مدیریت طرح‌ها و قیمت‌ها", "Manage plans & pricing")}
          </summary>
          <p className="sensor-note">
            {t(
              "قیمت دلاری را به سنت وارد کن (۵ دلار = ۵۰۰). تغییر طرح روی سفارش‌ها و خریدهای قبلی اثر ندارد.",
              "Enter USD prices in cents ($5 = 500). Edits apply to new orders; existing purchases keep their recorded terms.",
            )}
          </p>
          {[
            ...(catalog.allPlans ?? []),
            {
              id: "new-plan",
              name_fa: "طرح تازه",
              name_en: "New plan",
              days: 30,
              toman: 199000,
              usd_cents: 500,
              active: false,
            },
          ].map((p) => (
            <PlanEditor
              key={p.id + JSON.stringify(p)}
              plan={p}
              disabled={!!busy}
              save={(next) =>
                void action("plan", async () => {
                  await call("billing/plans", next);
                  await refresh();
                })
              }
            />
          ))}
        </details>
      )}
    </section>
  );
}
function PlanEditor({
  plan,
  disabled,
  save,
}: {
  plan: Plan;
  disabled: boolean;
  save: (p: Plan) => void;
}) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState(plan);
  return (
    <form
      className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-xl border border-[var(--border)] p-4 mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        save({ ...draft, active: !!draft.active });
      }}
    >
      {(
        [
          ["id", t("شناسهٔ طرح", "Plan ID")],
          ["name_fa", "نام فارسی"],
          ["name_en", "English name"],
          ["days", t("روز", "Days")],
          ["toman", t("تومان", "Toman")],
          ["usd_cents", t("سنت آمریکا", "USD cents")],
        ] as const
      ).map(([key, label]) => (
        <label className="sensor-label" key={key}>
          {label}
          <input
            required
            dir={key === "name_fa" ? "rtl" : "ltr"}
            type={
              ["days", "toman", "usd_cents"].includes(key) ? "number" : "text"
            }
            value={draft[key]}
            onChange={(e) =>
              setDraft({
                ...draft,
                [key]: ["days", "toman", "usd_cents"].includes(key)
                  ? Number(e.target.value)
                  : e.target.value,
              })
            }
          />
        </label>
      ))}
      <label className="flex gap-2 items-center text-sm">
        <input
          type="checkbox"
          checked={!!draft.active}
          onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
        />
        {t("قابل خرید", "Available for purchase")}
      </label>
      <button className="sensor-primary" disabled={disabled}>
        {t("ذخیرهٔ طرح", "Save plan")}
      </button>
    </form>
  );
}
