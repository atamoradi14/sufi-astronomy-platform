"use client";
import { signIn } from "next-auth/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Mail, Smartphone } from "lucide-react";
import { useLanguage } from "@/components/language/Language";

type Channel = "phone" | "email";
const toLatin = (value: string) =>
  value.replace(/[۰-۹٠-٩]/g, (d) => {
    const p = "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
    return String(p >= 0 ? p : "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  });

export function OtpSignIn({
  channels,
  callbackUrl,
}: {
  channels: { email: boolean; phone: boolean };
  callbackUrl: string;
}) {
  const { t } = useLanguage();
  const [channel, setChannel] = useState<Channel>(channels.phone ? "phone" : "email");
  const [target, setTarget] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"target" | "code">("target");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [wait, setWait] = useState(0);
  const codeInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (wait <= 0) return;
    const timer = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);
  useEffect(() => {
    if (step === "code") codeInput.current?.focus();
  }, [step]);
  if (!channels.email && !channels.phone) return null;

  const errorText = (error?: string, retryAfter?: number) => {
    if (error === "invalid_target")
      return channel === "phone"
        ? t("شمارهٔ موبایل معتبر نیست (مثلاً ۰۹۱۲۱۲۳۴۵۶۷).", "Enter a valid mobile number (e.g. +989121234567).")
        : t("نشانی ایمیل معتبر نیست.", "Enter a valid email address.");
    if (error === "rate_limited")
      return t(
        `درخواست زیاد بود؛ ${retryAfter ?? 60} ثانیه دیگر دوباره تلاش کنید.`,
        `Too many requests. Try again in ${retryAfter ?? 60} seconds.`,
      );
    return t("ارسال کد ممکن نشد؛ کمی بعد دوباره تلاش کنید.", "The code could not be sent. Please try again shortly.");
  };

  const send = async (event?: FormEvent) => {
    event?.preventDefault();
    if (busy || wait > 0) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, target: toLatin(target) }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        retryAfter?: number;
      };
      if (data.ok) {
        setStep("code");
        setWait(data.retryAfter ?? 60);
        setMessage(
          channel === "phone"
            ? t("کد ۶ رقمی پیامک شد.", "A 6-digit code was sent by SMS.")
            : t("کد ۶ رقمی به ایمیل شما فرستاده شد (پوشهٔ اسپم را هم ببینید).", "A 6-digit code was emailed to you (check spam too)."),
        );
      } else {
        if (data.retryAfter && data.error === "rate_limited") setWait(Math.min(data.retryAfter, 3600));
        setMessage(errorText(data.error, data.retryAfter));
      }
    } catch {
      setMessage(errorText());
    } finally {
      setBusy(false);
    }
  };

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    const result = await signIn("otp", {
      channel,
      target: toLatin(target),
      code: toLatin(code).replace(/\s/g, ""),
      redirect: false,
      callbackUrl,
    });
    setBusy(false);
    if (result?.ok && !result.error) {
      window.location.assign(result.url || callbackUrl);
      return;
    }
    setMessage(t("کد نادرست یا منقضی است.", "The code is wrong or has expired."));
  };

  const tab = (value: Channel, label: string, Icon: typeof Mail) => (
    <button
      type="button"
      role="tab"
      aria-selected={channel === value}
      onClick={() => {
        setChannel(value);
        setStep("target");
        setTarget("");
        setCode("");
        setMessage("");
      }}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm ${
        channel === value ? "bg-white/10 text-[var(--parchment)]" : "text-[var(--muted)]"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="space-y-3" data-otp-signin>
      {channels.email && channels.phone && (
        <div role="tablist" className="flex gap-1 rounded-xl border border-[var(--border)] p-1">
          {tab("phone", t("موبایل", "Mobile"), Smartphone)}
          {tab("email", t("ایمیل", "Email"), Mail)}
        </div>
      )}
      {step === "target" ? (
        <form onSubmit={send} className="space-y-3">
          <input
            dir="ltr"
            required
            name={channel === "phone" ? "tel" : "email"}
            type={channel === "phone" ? "tel" : "email"}
            inputMode={channel === "phone" ? "tel" : "email"}
            autoComplete={channel === "phone" ? "tel" : "email"}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={channel === "phone" ? "09121234567" : "you@example.com"}
            aria-label={channel === "phone" ? t("شمارهٔ موبایل", "Mobile number") : t("ایمیل", "Email")}
            className="w-full rounded-xl border border-[var(--border)] bg-black/20 px-4 py-3 text-center text-[var(--parchment)] placeholder:text-[var(--muted)]/60"
          />
          <button
            type="submit"
            disabled={busy || wait > 0 || !target.trim()}
            className="w-full rounded-xl bg-[var(--gold)] px-5 py-3 font-semibold text-[var(--ink)] disabled:opacity-40"
          >
            {wait > 0 ? t(`ارسال دوباره (${wait})`, `Resend (${wait})`) : t("دریافت کد ورود", "Send sign-in code")}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          <p className="text-center text-xs text-[var(--muted)]" dir="ltr">
            {target}
          </p>
          <input
            ref={codeInput}
            dir="ltr"
            required
            name="one-time-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9۰-۹٠-٩ ]{6,8}"
            maxLength={8}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="••••••"
            aria-label={t("کد ۶ رقمی", "6-digit code")}
            className="w-full rounded-xl border border-[var(--border)] bg-black/20 px-4 py-3 text-center text-2xl tracking-[0.5em] text-[var(--parchment)]"
          />
          <button
            type="submit"
            disabled={busy || toLatin(code).replace(/\D/g, "").length !== 6}
            className="w-full rounded-xl bg-[var(--gold)] px-5 py-3 font-semibold text-[var(--ink)] disabled:opacity-40"
          >
            {t("ورود", "Sign in")}
          </button>
          <div className="flex justify-between text-xs text-[var(--muted)]">
            <button type="button" onClick={() => { setStep("target"); setCode(""); setMessage(""); }}>
              {t("تغییر", "Change")}
            </button>
            <button type="button" disabled={wait > 0 || busy} onClick={() => void send()} className="disabled:opacity-40">
              {wait > 0 ? t(`ارسال دوباره (${wait})`, `Resend (${wait})`) : t("ارسال دوباره", "Resend code")}
            </button>
          </div>
        </form>
      )}
      {message && (
        <p role="status" className="text-center text-xs leading-6 text-[var(--muted)]">
          {message}
        </p>
      )}
    </div>
  );
}
