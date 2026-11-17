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
  liveActive?: boolean;
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
  metrics?: { totalLiveMs: number; sessions: number; users: number; activeSessions: number };
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
            (access.mode === "trial" && access.liveActive
              ? Math.max(0, (tick || Date.now()) - received)
              : 0),
        )
      : 600000;
  useEffect(() => {
    if (access?.mode === "trial" && remaining === 0 && !access.paidUntil) onAccess(false);
  }, [remaining, access?.mode,access?.paidUntil, onAccess]);
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
    <details className="sensor-panel space-y-4" id="satellite-plans">
      <summary className="cursor-pointer flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-[var(--gold-soft)]">{t("وضعیت دسترسی ماهواره", "Satellite access")}</span>
        <span className="text-xs text-[var(--muted)]">{access?.mode === "admin" ? t("مدیر · نامحدود", "Admin · unlimited") : access?.mode === "paid" ? t("طرح فعال", "Plan active") : t("۱۰ دقیقه اتصال زندهٔ رایگان", "10 free live minutes")} · {t("نمایش طرح‌ها و خریدها", "View plans & purchases")}</span>
      </summary>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2>
            {t("آزمایش رایگان و طرح‌های ماهواره", "Satellite trial & plans")}
          </h2>
          <p className="sensor-note">
            {t(
              "همهٔ بخش‌های فانوس پس از ورود آزادند. فقط ماهواره ۱۰ دقیقه زمان اتصال زندهٔ گوشی را آزمایشی می‌شمارد؛ زمان فقط هنگام اتصال واقعی گوشی کم می‌شود.",
              "All Fanous features remain available after sign-in. Only Satellite has a 10-minute trial, met solely while a native phone is live.",
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
                  ? t("۱۰ دقیقه اتصال زنده آمادهٔ شروع", "10 live minutes ready to start")
              : access.paidUntil
                ? t('طرح خریداری‌شده · آمادهٔ ادامه','Purchased plan · ready to continue')
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
        <p className="sensor-note">
          <a className="underline text-[var(--gold-soft)]" href="/admin#billing-management">
            {t("مدیریت طرح‌ها، قیمت‌ها و متریک اتصال در بخش مدیریت", "Manage plans, pricing and live-session metrics in Admin")}
          </a>
        </p>
      )}
    </details>
  );
}
export function PlanEditor({
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

export function BillingManagement() {
  const { t, fa } = useLanguage();
  const { data: session } = useSession();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const next = await call("billing");
      if (!next.admin) throw Error("Administrator required");
      setCatalog(next);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Billing unavailable");
    }
  }, [session?.user?.id]);
  useEffect(() => { void refresh(); }, [refresh]);
  const save = async (plan: Plan) => {
    setBusy(true);
    setError("");
    try {
      await call("billing/plans", plan);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save plan");
    } finally { setBusy(false); }
  };
  const duration = (ms: number) =>
    ms < 60000 ? t("کمتر از یک دقیقه", "under one minute") :
      Math.floor(ms / 60000).toLocaleString(fa ? "fa-IR" : "en-NZ") + t(" دقیقه", " min");
  return (
    <section className="mx-auto max-w-6xl space-y-5 px-4 pb-10" id="billing-management">
      <header className="space-y-2">
        <p className="study-kicker">FANOUS · BILLING ADMIN</p>
        <h2 className="text-2xl text-[var(--gold-soft)]">{t("مدیریت طرح‌ها و زمان اتصال ماهواره", "Plans & satellite live-time")}</h2>
        <p className="text-sm text-[var(--muted)]">{t("همهٔ بخش‌های سایت برای کاربران واردشده آزاد است. فقط اتصال زندهٔ ماهواره، ۱۰ دقیقه آزمایشی و سپس اشتراکی است.", "All signed-in users retain the rest of Fanous. Only live Satellite time is trialled for 10 minutes and then subscription-gated.")}</p>
      </header>
      {error && <p role="alert" className="text-sm text-[var(--rose-ink)]">{error} <button className="underline" onClick={() => void refresh()}>{t("تلاش دوباره", "Retry")}</button></p>}
      {catalog?.metrics && <div className="grid gap-3 sm:grid-cols-4">
        {[
          [t("کل زمان زنده", "Total live time"), duration(catalog.metrics.totalLiveMs)],
          [t("نشست‌ها", "Sessions"), String(catalog.metrics.sessions)],
          [t("کاربران ماهواره", "Satellite users"), String(catalog.metrics.users)],
          [t("اتصال زنده اکنون", "Live now"), String(catalog.metrics.activeSessions)],
        ].map(([label, value]) => <div key={label} className="sensor-panel p-4"><p className="sensor-note">{label}</p><strong className="text-xl text-[var(--gold-soft)]">{value}</strong></div>)}
      </div>}
      <div className="sensor-panel space-y-4">
        <p className="sensor-note">{t("شناسهٔ طرح می‌تواند خوانا نوشته شود؛ هنگام ذخیره خودکار به شناسهٔ کوچک و امن تبدیل می‌شود. قیمت دلار را به سنت وارد کن.", "Plan IDs may be human-readable; they are converted to safe lowercase IDs on save. Enter USD prices in cents.")}</p>
        {(catalog?.allPlans ?? []).map((plan) => <PlanEditor key={plan.id} plan={plan} disabled={busy} save={(next) => void save(next)} />)}
        <PlanEditor plan={{ id: "", name_fa: "طرح تازه", name_en: "New plan", days: 30, toman: 199000, usd_cents: 500, active: false }} disabled={busy} save={(next) => void save(next)} />
      </div>
    </section>
  );
}
