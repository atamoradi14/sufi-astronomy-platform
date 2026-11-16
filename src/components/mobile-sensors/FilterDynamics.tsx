"use client";
import { memo } from "react";
import { Snapshot, Sample } from "@/lib/mobile-sensors/capture";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { MathBlock } from "@/components/ui/MathBlock";
import { SensorPlot } from "./SensorPlot";
import { QuaternionPlots } from "./QuaternionPlots";
export default function FilterDynamics({
  snapshot,
}: {
  snapshot: Snapshot | null;
}) {
  const { t } = useLanguage(),
    history = snapshot?.diagnostics ?? [];
  const series = (
    key: "innovation" | "correction" | "sigma" | "gain",
  ): Sample[] =>
    history.map((s) => ({ at: s.at, raw: s[key], filtered: s[key] }));
  return (
    <LocalizedDigits>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="sensor-panel lg:col-span-2">
          <h2>
            {t(
              "داخل فیلتر؛ دادهٔ واقعی همین جلسه",
              "Inside the filter: actual session diagnostics",
            )}
          </h2>
          <p className="sensor-note">
            {t(
              "این نمودارها از همان به‌روزرسانی‌هایی ثبت می‌شوند که وضعیت گوشی را می‌سازند؛ شبیه‌سازی جداگانه نیستند. عدم‌قطعیت داخلیِ مدل، خطای مطلق جهت‌گیری را تضمین نمی‌کند؛ خروجی ترکیبی مرورگر هم‌بستگی زمانی دارد.",
              "These traces come from the updates that produce the phone pose, not a separate simulation. Internal covariance is not an absolute attitude-accuracy guarantee; browser-fused measurements are temporally correlated.",
            )}
          </p>
        </section>
        {(
          [
            [
              "innovation",
              t(
                "نوآوری؛ خطای مرجع نسبت به پیش‌بینی",
                "Innovation: reference vs prediction",
              ),
              "°",
            ],
            [
              "correction",
              t(
                "تصحیح کالمن در فضای خطای کوچک",
                "Kalman correction in local error space",
              ),
              "°",
            ],
            [
              "sigma",
              t(
                "ریشهٔ قطر کوواریانس؛ σ داخلی",
                "Square root of covariance diagonal: internal σ",
              ),
              "°",
            ],
            ["gain", t("قطر بهرهٔ کالمن", "Kalman gain diagonal"), "1"],
          ] as const
        ).map(([key, title, unit]) => (
          <section className="sensor-panel" key={key}>
            <h2>{title}</h2>
            <SensorPlot
              samples={series(key)}
              unit={unit}
              rawOnly
              rawLabel={t("ثبت‌شده از فیلتر", "Recorded from filter")}
            />
          </section>
        ))}
        <QuaternionPlots samples={snapshot?.quaternions ?? []} />
        <section className="sensor-panel">
          <h2>
            {t(
              "کوواریانس کامل؛ رادیان به توان دو",
              "Full covariance; radians squared",
            )}
          </h2>
          <div className="overflow-auto" dir="ltr">
            <table className="w-full text-sm tabular-nums">
              <tbody>
                {snapshot?.covariance.map((row, i) => (
                  <tr key={i}>
                    {row.map((v, j) => (
                      <td className="p-3 border border-[var(--border)]" key={j}>
                        {v.toExponential(3)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="sensor-note" dir="ltr">
            NIS = {history.at(-1)?.nis.toFixed(3) ?? "—"}
          </p>
          <p className="sensor-note">
            {t(
              "NIS = rᵀS⁻¹r؛ این شاخص سازگاری داخلی است، نه کالیبراسیون دقت مطلق. مؤلفه‌های خطا در دستگاهِ بدنی گوشی بیان می‌شوند.",
              "NIS = rᵀS⁻¹r; this is an internal consistency diagnostic, not absolute accuracy calibration. Error components are expressed in the phone’s body frame.",
            )}
          </p>
        </section>
        <section className="sensor-panel">
          <h2>{t("اعداد مدل اجراشده", "Running model constants")}</h2>
          <p className="sensor-note">
            {t(
              "نویز فرایند ژیروسکوپ: ۱٫۵ درجه بر ریشهٔ ثانیه. نویز مرجع: ۵ درجه در حالت مرورگر و ۷ درجه در TRIAD. بدون ژیروسکوپ تازه، حرکتِ تصادفی مدل با ۱۲ درجه بر ریشهٔ ثانیه افزوده می‌شود. این اعداد محافظه‌کارانه‌اند و از کالیبراسیون کارخانهٔ گوشی به دست نیامده‌اند.",
              "Gyro process noise: 1.5 degrees/√s. Reference noise: 5 degrees in browser mode, 7 in TRIAD. Without fresh gyro, a 12 degrees/√s model random walk is added. These conservative settings are not phone factory calibration values.",
            )}
          </p>
          <p className="sensor-note">
            {t(
              "پیش‌بینی با Δt بیش از ۰٫۱۵ ثانیه رد می‌شود. مرجع حدود ۱۰ هرتز اعمال می‌شود. قطر P پیش از تصحیح، حداقل ۰٫۰۸ برابر واریانس مرجع نگه داشته می‌شود تا اطمینان کاذب انباشته نشود. بایاس ژیروسکوپ جداگانه در سکون اندازه‌گیری می‌شود؛ این فیلتر سه‌حالته است و بایاس را به‌صورت حالت ششم تخمین نمی‌زند.",
              "Prediction rejects Δt above 0.15 s. References update at about 10 Hz. Before correction, diagonal P retains a floor of 0.08 times reference variance to avoid accumulating false confidence. Gyro bias is measured separately at rest; this is a three-state error filter, not a six-state bias estimator.",
            )}
          </p>
        </section>
        <Equations />
      </div>
    </LocalizedDigits>
  );
}
// Static mathematics is memoized: sensor snapshots must not re-render KaTeX at 10 Hz.
const Equations = memo(function Equations() {
  const { t } = useLanguage();
  return (
    <section className="sensor-panel lg:col-span-2 space-y-5">
      <h2>
        {t(
          "معادلات دینامیک و فیلتر اجراشده",
          "Dynamics & implemented filter equations",
        )}
      </h2>
      <p className="sensor-note">
        {t(
          "q = [x,y,z,w] چرخش دستگاه به شرق–شمال–بالا است؛ ⊗ ضرب همیلتونی و ω نرخ بدنی بر حسب rad/s است. Exp از بردار چرخش به کواترنیون یکه و Log تبدیل معکوس کوتاه‌ترین چرخش است.",
          "q = [x,y,z,w] rotates device to east–north–up; ⊗ is the Hamilton product and ω is body rate in rad/s. Exp maps a rotation vector to a unit quaternion; Log returns the shortest rotation vector.",
        )}
      </p>
      <MathBlock>{String.raw`\dot q=\tfrac12 q\otimes[\boldsymbol\omega-\mathbf b,0],\qquad q_k^-=\operatorname{normalize}\!\left(q_{k-1}^+\otimes\operatorname{Exp}((\boldsymbol\omega_k-\mathbf b)\Delta t)\right)`}</MathBlock>
      <MathBlock>{String.raw`\operatorname{Exp}(\boldsymbol\theta)=\left[\frac{\boldsymbol\theta}{\|\boldsymbol\theta\|}\sin\frac{\|\boldsymbol\theta\|}{2},\ \cos\frac{\|\boldsymbol\theta\|}{2}\right],\quad \operatorname{Log}([\mathbf v,w])=2\operatorname{atan2}(\|\mathbf v\|,w)\frac{\mathbf v}{\|\mathbf v\|},\ w\ge0`}</MathBlock>
      <p className="sensor-note">
        {t(
          "حد در صفر پیوسته در نظر گرفته می‌شود. q مرجع با علامت هم‌نیمکرهٔ پیش‌بینی نمایش داده می‌شود.",
          "Zero-angle limits are continuous. The displayed reference quaternion uses the prediction’s sign hemisphere.",
        )}
      </p>
      <MathBlock>{String.raw`F_k=I-[\boldsymbol\omega_k-\mathbf b]_\times\Delta t,\quad P_k^-=F_kP_{k-1}^+F_k^\mathsf T+\sigma_g^2\Delta t\,I`}</MathBlock>
      <MathBlock>{String.raw`r_k=\operatorname{Log}((q_k^-)^{-1}\otimes q_k^{\rm ref}),\quad R_k=\sigma_m^2 I,\quad S_k=P_k^-+R_k,\quad K_k=P_k^-S_k^{-1}`}</MathBlock>
      <MathBlock>{String.raw`\delta\boldsymbol\theta_k=K_kr_k,\qquad q_k^+=\operatorname{normalize}\!\left(q_k^-\otimes\operatorname{Exp}(\delta\boldsymbol\theta_k)\right)`}</MathBlock>
      <MathBlock>{String.raw`\widetilde P_k=(I-K_k)P_k^-(I-K_k)^\mathsf T+K_kR_kK_k^\mathsf T,\quad G_k=I-\tfrac12[\delta\boldsymbol\theta_k]_\times,\quad P_k^+=G_k\widetilde P_kG_k^\mathsf T`}</MathBlock>
      <p className="sensor-note">
        {t(
          "بدون ژیروسکوپ تازه، قبل از تصحیح P ← P + σwalk² min(Δt,0.2)I است. سپس حد محافظه‌کارانهٔ قطر P اعمال می‌شود؛ بنابراین کوواریانس یک مدل عملیِ هموارسازی است.",
          "Without fresh gyro, before correction P ← P + σwalk² min(Δt,0.2)I. The conservative diagonal floor is then applied; covariance therefore describes a practical smoothing model.",
        )}
      </p>
      <MathBlock>{String.raw`\mathbf m_c=\operatorname{diag}(\mathbf s)(\mathbf m-\mathbf o),\quad \hat{\mathbf u}=\frac{\mathbf f}{\|\mathbf f\|},\quad \hat{\mathbf e}=\frac{\mathbf m_c\times\hat{\mathbf u}}{\|\mathbf m_c\times\hat{\mathbf u}\|},\quad \hat{\mathbf n}=\hat{\mathbf u}\times\hat{\mathbf e},\quad R_{b\to ENU}=\begin{bmatrix}\hat{\mathbf e}^{\mathsf T}\\\hat{\mathbf n}^{\mathsf T}\\\hat{\mathbf u}^{\mathsf T}\end{bmatrix}`}</MathBlock>
      <p className="sensor-note">
        {t(
          "رابطهٔ TRIAD تنها در حالت خام و با شتاب نزدیک سکون به کار می‌رود؛ مرورگر و TRIAD هم‌زمان به‌عنوان دو مرجع مستقل وارد فیلتر نمی‌شوند.",
          "TRIAD is used only in raw mode near static acceleration; browser orientation and TRIAD are never double-counted as independent references.",
        )}
      </p>
      <MathBlock>{String.raw`\dot{\mathbf r}=\mathbf v,\qquad\dot{\mathbf v}=R(q)\mathbf f-g\hat{\mathbf U},\qquad\mathbf b=\frac1N\sum_{i=1}^N\boldsymbol\omega_i\quad(\text{stationary})`}</MathBlock>
      <p className="sensor-note">
        {t(
          "معادلات انتقالی فقط برای توضیح دینامیک‌اند؛ این صفحه از انتگرال شتاب، مکان سه‌بعدی تولید نمی‌کند. مکان از GPS می‌آید و بایاس فقط با نمونه‌های سکونِ پذیرفته‌شده تعیین می‌شود.",
          "Translational equations explain the dynamics; this page does not integrate acceleration into a 3D position. Position comes from GPS and bias from accepted stationary samples.",
        )}
      </p>
      <MathBlock>{String.raw`\mathbf c=R_z(-D)R(q)(0,0,-1)^\mathsf T,\quad x_{\rm image}=\frac{\mathbf s\cdot\hat{\mathbf R}}{(\mathbf s\cdot\hat{\mathbf c})\tan(\phi_v/2)\,a},\quad y_{\rm image}=\frac{\mathbf s\cdot\hat{\mathbf U}}{(\mathbf s\cdot\hat{\mathbf c})\tan(\phi_v/2)}`}</MathBlock>
      <p className="sensor-note">
        {t(
          "D میل مغناطیسی شرق‌مثبت، a نسبت عرض به ارتفاع و φv میدان دید عمودی است. فقط بردارهای رو به دوربین رسم می‌شوند؛ سمت راست و بالای تصویر با چرخش واقعی نمایشگر می‌چرخند.",
          "D is east-positive magnetic declination, a is width/height and φv is vertical FOV. Only forward-facing vectors are drawn; image right/up rotate with the actual display orientation.",
        )}
      </p>
    </section>
  );
});
