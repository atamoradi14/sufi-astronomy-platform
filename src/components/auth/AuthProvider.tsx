"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, LogIn, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/language/Language";
import { OtpSignIn } from "./OtpSignIn";
type AuthConfig = { available: boolean; google: boolean; email: boolean; phone: boolean };
const AuthDialog = createContext<(next?: string) => void>(() => {});
export const useSignInDialog = () => useContext(AuthDialog);
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus>
      <AuthShell>{children}</AuthShell>
    </SessionProvider>
  );
}
function AuthShell({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const { t } = useLanguage();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [next, setNext] = useState("/");
  const [config, setConfig] = useState<AuthConfig | null>(null);
  const available = config === null ? null : config.available;
  // A small, non-modal sign-in nudge on the homepage. It never covers the
  // main content, so it doesn't count as an intrusive interstitial for search.
  const [nudge, setNudge] = useState(false);
  useEffect(() => {
    fetch("/api/auth/config")
      .then((r) => r.json())
      .then((d) =>
        setConfig({
          available: d.available === true,
          google: d.google === true || (d.google === undefined && d.available === true),
          email: d.email === true,
          phone: d.phone === true,
        }),
      )
      .catch(() => setConfig({ available: false, google: false, email: false, phone: false }));
  }, []);
  useEffect(() => {
    if (status === "authenticated") {
      dialog.current?.close();
      setNudge(false);
      return;
    }
    if (status !== "unauthenticated" || pathname !== "/") {
      setNudge(false);
      return;
    }
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem("manderia-login-dismissed") === "1";
    } catch {}
    if (dismissed) return;
    const timer = window.setTimeout(() => setNudge(true), 4000);
    return () => window.clearTimeout(timer);
  }, [status, pathname]);
  const dismiss = () => {
    setNudge(false);
    try {
      sessionStorage.setItem("manderia-login-dismissed", "1");
    } catch {}
  };
  const close = () => {
    dialog.current?.close();
    dismiss();
  };
  const open = useCallback(
    (target?: string) => {
      setNext(target || pathname);
      if (!dialog.current?.open) dialog.current?.showModal();
    },
    [pathname],
  );
  return (
    <AuthDialog.Provider value={open}>
      {children}
      {nudge && (
        <aside
          aria-label={t("ورود به فانوس خیال", "Sign in to Fanous-e Khial")}
          data-signin-nudge
          className="fixed bottom-4 end-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--parchment)] shadow-xl sm:max-w-sm"
        >
          <ShieldCheck size={20} className="shrink-0 text-[var(--teal)]" />
          <p className="text-xs leading-6 text-[var(--muted)]">
            {t(
              "برای کره، حسگر ستاره و اطلس صوفی وارد شوید.",
              "Sign in for the sphere, star sensor and Sufi atlas.",
            )}
          </p>
          <button
            type="button"
            onClick={() => {
              setNudge(false);
              open("/");
            }}
            className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#142238]"
          >
            {t("ورود", "Sign in")}
          </button>
          <button
            type="button"
            aria-label={t("بستن", "Dismiss")}
            onClick={dismiss}
            className="shrink-0 rounded-full p-1 text-[var(--muted)] hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </aside>
      )}
      <dialog
        ref={dialog}
        aria-labelledby="signin-title"
        onCancel={close}
        className="auth-dialog rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-0 text-[var(--parchment)] shadow-2xl"
      >
        <div className="relative space-y-5 p-7 sm:p-9">
          <button
            type="button"
            aria-label={t("بستن", "Close sign-in")}
            onClick={close}
            className="absolute end-4 top-4 rounded-full p-2 text-[var(--muted)] hover:bg-white/5"
          >
            <X size={18} />
          </button>
          <ShieldCheck size={30} className="text-[var(--teal)]" />
          <p className="study-kicker">FANOUS-E KHIAL</p>
          <h2
            id="signin-title"
            className="text-2xl font-[family-name:var(--font-display)] text-[var(--gold-soft)]"
          >
            {t(
              "آسمان را با فانوس خیال کشف کنید",
              "Discover the sky with Fanous-e Khial",
            )}
          </h2>
          <p className="text-sm leading-7 text-[var(--muted)]">
            {t(
              "برای کار با کرهٔ سه‌بعدی، حسگر ستاره و اطلس صوفی، با شمارهٔ موبایل، ایمیل یا حساب گوگل وارد شوید. درس‌نامهٔ کروی بدون ورود هم در دسترس است.",
              "Sign in with your mobile number, email or Google to use the 3D sphere, star sensor, and Sufi atlas. The spherical course stays open to everyone.",
            )}
          </p>
          {config && (
            <OtpSignIn
              key={next}
              channels={{ email: config.email, phone: config.phone }}
              callbackUrl={next}
            />
          )}
          {config && (config.email || config.phone) && config.google && (
            <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
              <span className="h-px flex-1 bg-[var(--border)]" />
              {t("یا", "or")}
              <span className="h-px flex-1 bg-[var(--border)]" />
            </div>
          )}
          {config?.google !== false && (
          <button
            type="button"
            disabled={config?.google !== true}
            onClick={() => void signIn("google", { callbackUrl: next })}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 font-semibold text-[#142238] disabled:opacity-40"
          >
            <span
              aria-hidden="true"
              className="text-xl font-bold text-[#4285f4]"
            >
              G
            </span>
            {t("ادامه با گوگل", "Continue with Google")}
          </button>
          )}
          {available === false && (
            <p role="status" className="text-xs text-[var(--muted)]">
              {t(
                "ورود موقتاً در دسترس نیست؛ کمی بعد دوباره تلاش کنید.",
                "Sign-in is temporarily unavailable. Please try again shortly.",
              )}
            </p>
          )}
          <p className="text-xs leading-6 text-[var(--muted)]">
            {t(
              "فقط مشخصات پایهٔ حساب و ایمیل یا شمارهٔ تأییدشده ذخیره می‌شود؛ به صندوق Gmail شما دسترسی نداریم.",
              "We save your basic profile and verified email or phone number. We do not access your Gmail inbox.",
            )}{" "}
            <Link
              className="text-[var(--teal)] underline"
              href="/privacy"
              onClick={close}
            >
              {t("حریم خصوصی", "Privacy")}
            </Link>
          </p>
          <button
            type="button"
            onClick={close}
            className="w-full text-sm text-[var(--muted)]"
          >
            {t("فعلاً مطالعهٔ درس‌نامه", "Keep reading for now")}
          </button>
        </div>
      </dialog>
    </AuthDialog.Provider>
  );
}
export function AccountButton() {
  const { data, status } = useSession();
  const open = useSignInDialog();
  const { t } = useLanguage();
  if (status === "loading")
    return <span aria-busy="true" className="h-8 w-12" />;
  if (data?.user?.id)
    return (
      <div className="flex items-center gap-2 text-xs">
        {data.user.isAdmin && (
          <Link href="/admin" className="text-[var(--teal)]">
            {t("مدیریت", "Admin")}
          </Link>
        )}
        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "/" })}
          className="rounded-md border border-[var(--border)] px-2 py-1.5"
          title={data.user.email || data.user.phone || ""}
        >
          {t("خروج", "Sign out")}
        </button>
      </div>
    );
  return (
    <button
      type="button"
      onClick={() => open()}
      className="flex items-center gap-1 rounded-md border border-[var(--gold)]/40 px-2 py-1.5 text-xs text-[var(--gold-soft)]"
    >
      <LogIn size={14} />
      {t("ورود", "Sign in")}
    </button>
  );
}
export function AccessRequired({ feature }: { feature: string }) {
  const open = useSignInDialog();
  const { t } = useLanguage();
  return (
    <section
      className="mx-auto my-12 max-w-xl space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-8 text-center"
      data-auth-required
    >
      <ShieldCheck className="mx-auto text-[var(--teal)]" size={32} />
      <h1 className="text-2xl text-[var(--gold-soft)]">
        {t("ورود برای استفاده از این بخش", "Sign in to explore")}
      </h1>
      <p className="text-sm leading-7 text-[var(--muted)]">
        {t(
          "برای دسترسی به این ابزار فانوس خیال، با شمارهٔ موبایل، ایمیل یا حساب گوگل وارد شوید.",
          "Sign in with your mobile number, email or Google account to use this Fanous-e Khial tool.",
        )}{" "}
        <span className="sr-only">{feature}</span>
      </p>
      <button
        type="button"
        onClick={() => open()}
        className="rounded-xl bg-[var(--gold)] px-5 py-3 font-semibold text-[var(--ink)]"
      >
        {t("ورود یا ثبت‌نام", "Sign in or sign up")}
      </button>
      <p>
        <Link className="text-sm text-[var(--teal)]" href="/course">
          {t("مطالعهٔ درس‌نامهٔ کروی", "Read the spherical course")}
        </Link>
      </p>
    </section>
  );
}
export function AuthGate({
  children,
  feature,
}: {
  children: ReactNode;
  feature: string;
}) {
  const { data, status } = useSession();
  if (status === "loading")
    return (
      <div className="p-8" aria-busy="true">
        …
      </div>
    );
  return data?.user?.id ? children : <AccessRequired feature={feature} />;
}
