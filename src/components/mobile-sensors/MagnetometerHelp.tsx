"use client";
import { useState } from "react";
import { skyPoint } from "@/lib/mobile-sensors/math";
import { Snapshot } from "@/lib/mobile-sensors/capture";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
export function MagnetometerHelp({
  state,
  retry,
}: {
  state: Snapshot | null;
  retry: () => void;
}) {
  const { t } = useLanguage(),
    [copied, setCopied] = useState(false);
  const fused = state?.running && state.absolute && state.q !== null;
  return (
    <LocalizedDigits>
      <section
        className="sensor-panel mb-5"
        aria-label={t("دسترسی مغناطیسی", "Magnetic access")}
      >
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h2 className="!mb-0">
            {t("قطب‌نمای مغناطیسی و میدان خام", "Magnetic compass & raw field")}
          </h2>
          <button
            className="sensor-button"
            disabled={!state?.running}
            onClick={retry}
          >
            {t("شروع دوباره و بررسی مجوزها", "Restart & recheck permissions")}
          </button>
        </div>
        <p className="sensor-note">
          {fused
            ? t(
                "مرجع جهت‌گیری مغناطیسی فعال است. این داده برای جهت‌گیری و نمای آسمان استفاده می‌شود.",
                "The magnetic orientation reference is active and supplies attitude and the sky view.",
              )
            : t(
                "برای بررسی قطب‌نمای مغناطیسی، دریافت را شروع کنید؛ مرجع نسبی به‌تنهایی شمال را مشخص نمی‌کند.",
                "Start capture to check the magnetic compass; a relative reference alone cannot identify north.",
              )}
        </p>
        {fused && (
          <p className="text-sm text-[var(--teal)]">
            {t("سمت مغناطیسی پشت گوشی: ", "Rear magnetic azimuth: ")}
            {skyPoint(state!.q!, [0, 0, -1], 0, new Date()).az?.toFixed(1) ??
              "—"}
            °
          </p>
        )}
        {state?.status.mag !== "live" && (
          <details className="mt-3 text-sm leading-7">
            <summary className="cursor-pointer text-[var(--gold-soft)]">
              {t(
                "چرا X/Y/Z مغناطیسی نمایش داده نمی‌شود؟",
                "Why are magnetic X/Y/Z missing?",
              )}
            </summary>
            <p className="sensor-note">
              {t(
                "خروجی خام µT و قطب‌نمای ترکیبی دو API جدا هستند. اگر سازندهٔ Magnetometer در مرورگر وجود نداشته باشد، کد سایت نمی‌تواند آن را فعال کند یا میدان خام را از زاویه‌ها بازسازی کند. در بعضی نسخه‌های Chrome این API آزمایشی است.",
                "Raw µT and the fused compass are separate APIs. If the browser does not expose the Magnetometer constructor, site code cannot enable it or recover raw field readings from orientation angles. Some Chrome versions expose it only as an experimental API.",
              )}
            </p>
            <p className="sensor-note">
              {t(
                "برای آزمایش اختیاری در Chrome: آدرس زیر را کپی کنید، در نوار آدرس باز کنید، گزینهٔ Experimental Web Platform features را فعال و مرورگر را دوباره راه‌اندازی کنید. سپس به همین صفحه برگردید و شروع را بزنید. این گزینه آزمایشی است و وجود سخت‌افزار یا دسترسی به آن را تضمین نمی‌کند.",
                "Optional Chrome experiment: copy this address into the address bar, enable Experimental Web Platform features, and relaunch Chrome. Return here and Start again. This experimental setting cannot guarantee hardware access.",
              )}
            </p>
            <div className="flex flex-wrap gap-2 items-center mt-2">
              <code className="break-all text-xs" dir="ltr" data-digit-literal>
                chrome://flags/#enable-experimental-web-platform-features
              </code>
              <button
                className="sensor-button"
                onClick={() => {
                  navigator.clipboard
                    ?.writeText(
                      "chrome://flags/#enable-experimental-web-platform-features",
                    )
                    .then(() => setCopied(true))
                    .catch(() => setCopied(false));
                }}
              >
                {copied ? t("کپی شد", "Copied") : t("کپی آدرس", "Copy address")}
              </button>
            </div>
            <p className="sensor-note">
              {t(
                "اگر مجوز رد شده است، در تنظیمات سایتِ مرورگر، دسترسی Motion sensors را بررسی کنید و دوباره شروع کنید. بدون میدان خام، کالیبراسیون میدان و حالت TRIAD فعال نمی‌شوند؛ قطب‌نمای ترکیبی همچنان قابل استفاده است.",
                "If permission was denied, check Motion sensors in browser site settings and restart. Raw field calibration and TRIAD require actual field samples; the fused compass remains usable without them.",
              )}
            </p>
            <a
              className="text-xs underline"
              href="https://developer.chrome.com/docs/web-platform/chrome-flags/"
              target="_blank"
              rel="noreferrer"
            >
              {t("راهنمای رسمی Chrome", "Chrome’s official guide")}
            </a>
          </details>
        )}
      </section>
    </LocalizedDigits>
  );
}
