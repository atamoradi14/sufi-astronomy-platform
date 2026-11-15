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
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/auth/config")
      .then((r) => r.json())
      .then((d) => setAvailable(d.available === true))
      .catch(() => setAvailable(false));
  }, []);
  useEffect(() => {
    if (status === "authenticated") {
      dialog.current?.close();
      return;
    }
    if (status !== "unauthenticated" || pathname !== "/") return;
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem("manderia-login-dismissed") === "1";
    } catch {}
    if (!dismissed && !dialog.current?.open) {
      setNext("/");
      dialog.current?.showModal();
    }
  }, [status, pathname]);
  const close = () => {
    dialog.current?.close();
    try {
      sessionStorage.setItem("manderia-login-dismissed", "1");
    } catch {}
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
              "برای کار با کرهٔ سه‌بعدی، حسگر ستاره و اطلس صوفی، با حساب گوگل خود وارد شوید. درس‌نامهٔ کروی بدون ورود هم در دسترس است.",
              "Sign in with Google to use the 3D sphere, star sensor, and Sufi atlas. The spherical course stays open to everyone.",
            )}
          </p>
          <button
            type="button"
            disabled={available !== true}
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
              "فقط مشخصات پایهٔ حساب و ایمیل تأییدشده ذخیره می‌شود؛ به صندوق Gmail شما دسترسی نداریم.",
              "We save your basic profile and verified email. We do not access your Gmail inbox.",
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
          title={data.user.email || ""}
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
          "برای دسترسی به این ابزار فانوس خیال، با حساب گوگل خود وارد شوید.",
          "Use your Google account to access this Fanous-e Khial tool.",
        )}{" "}
        <span className="sr-only">{feature}</span>
      </p>
      <button
        type="button"
        onClick={() => open()}
        className="rounded-xl bg-[var(--gold)] px-5 py-3 font-semibold text-[var(--ink)]"
      >
        {t("ادامه با گوگل", "Continue with Google")}
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
