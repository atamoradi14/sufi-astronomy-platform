"use client";
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
  const { t } = useLanguage();
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
                "تنظیم ویژه یا تغییر پرچم‌های مرورگر لازم نیست. قطب‌نمای گوشی به‌طور خودکار از مسیر ترکیبی مرورگر استفاده می‌شود. خروجی خام µT و قطب‌نمای ترکیبی دو API جدا هستند. اگر سازندهٔ Magnetometer در مرورگر وجود نداشته باشد، کد سایت نمی‌تواند آن را فعال کند یا میدان خام را از زاویه‌ها بازسازی کند. بعضی مرورگرها میدان خام را ارائه نمی‌کنند.",
                "No special setup or browser flags are required. The phone compass automatically uses the browser’s fused sensor path. Raw µT and the fused compass are separate APIs. If the browser does not expose the Magnetometer constructor, site code cannot enable it or recover raw field readings from orientation angles. Some browsers do not expose raw field measurements.",
              )}
            </p>
            <p className="sensor-note">
              {t(
                "اگر مجوز رد شده است، در تنظیمات سایتِ مرورگر، دسترسی Motion sensors را بررسی کنید و دوباره شروع کنید. بدون میدان خام، کالیبراسیون میدان و حالت TRIAD فعال نمی‌شوند؛ قطب‌نمای ترکیبی همچنان قابل استفاده است.",
                "If permission was denied, check Motion sensors in browser site settings and restart. Raw field calibration and TRIAD require actual field samples; the fused compass remains usable without them.",
              )}
            </p>
          </details>
        )}
      </section>
    </LocalizedDigits>
  );
}
