"use client";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  Component,
  ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { automaticNorth } from "@/lib/mobile-sensors/north";
import { canUseMobileSensors } from "@/lib/mobile-sensors/access";
import { SensorCapture, Snapshot, Status } from "@/lib/mobile-sensors/capture";
import {
  exp,
  mul,
  RAD,
  poseAngles,
  skyPoint,
  topHeading,
  Vec,
} from "@/lib/mobile-sensors/math";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { SensorPlot } from "./SensorPlot";
import { GpsPlots } from "./GpsPlots";
import { QuaternionPlots } from "./QuaternionPlots";
import { MagnetometerHelp } from "./MagnetometerHelp";
import "./sensors.css";
const PhoneScene = dynamic(() => import("./PhoneScene"), {
  ssr: false,
  loading: () => <div className="h-80 grid place-items-center">3D…</div>,
});
const CameraSky = dynamic(() => import("./CameraSky"), {
  ssr: false,
  loading: () => <p>…</p>,
});
const FilterDynamics = dynamic(() => import("./FilterDynamics"), {
  ssr: false,
  loading: () => <p>…</p>,
});
const fmt = (v: number | null | undefined, places = 1) =>
  v == null || !Number.isFinite(v) ? "—" : v.toFixed(places);
const statusText: Record<Status, [string, string]> = {
  idle: ["خاموش", "Off"],
  waiting: ["در انتظار مجوز یا داده", "Waiting for permission/data"],
  live: ["دریافت فعال", "Receiving"],
  unsupported: [
    "دادهٔ خام اختیاری در دسترس نیست",
    "Optional raw data unavailable",
  ],
  denied: ["مجوز رد شد", "Permission denied"],
  unavailable: ["داده‌ای دریافت نشد", "No data received"],
  stale: ["داده قدیمی است", "Stale data"],
};
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export function MobileSensors() {
  const { t, fa } = useLanguage(),
    { data: session, status: sessionStatus } = useSession();
  const engine = useRef<SensorCapture | null>(null);
  const [state, setState] = useState<Snapshot | null>(null),
    [starting, setStarting] = useState(false),
    [tab, setTab] = useState("pose"),
    [axis, setAxis] = useState("camera");
  const [manualDeclination, setManualDeclination] = useState(0),
    [manualNorth, setManualNorth] = useState(false),
    [now, setNow] = useState(() => Date.now());
  const day = new Date(now).toISOString().slice(0, 10);
  const latitude = state?.gps?.lat,
    longitude = state?.gps?.lon,
    altitude = state?.gps?.altitude;
  const north = useMemo(
    () =>
      automaticNorth(
        new Date(day + "T12:00:00Z"),
        latitude,
        longitude,
        altitude,
      ),
    [day, latitude, longitude, altitude],
  );
  const declination = manualNorth
    ? manualDeclination
    : (north.declination ?? 0);
  const trueNorth = manualNorth || north.declination !== null;
  const authorized = canUseMobileSensors(session?.user?.email);
  useEffect(() => {
    const capture = new SensorCapture();
    engine.current = capture;
    const timer = setInterval(() => {
      setState(capture.snapshot());
      setNow(Date.now());
    }, 100);
    return () => {
      clearInterval(timer);
      capture.stop();
      engine.current = null;
    };
  }, []);
  useEffect(() => {
    if (sessionStatus !== "loading" && !authorized) engine.current?.stop();
  }, [authorized, sessionStatus]);
  const start = async () => {
    if (!authorized || !engine.current) return;
    setStarting(true);
    try {
      await engine.current.start();
    } finally {
      setStarting(false);
    }
  };
  if (sessionStatus === "loading")
    return (
      <div className="mx-auto max-w-xl p-8" role="status">
        {t("بررسی حساب…", "Checking account…")}
      </div>
    );
  if (!authorized)
    return (
      <div className="mx-auto max-w-xl p-8">
        {t(
          "این ابزار فقط برای حساب مجاز در دسترس است.",
          "This tool is available only to the authorized account.",
        )}
      </div>
    );
  const q = state?.q,
    displayQ = q ? mul(exp([0, 0, -declination * RAD]), q) : null,
    angles = displayQ ? poseAngles(displayQ) : null;
  const pointing: Vec =
    axis === "screen" ? [0, 0, 1] : axis === "camera" ? [0, 0, -1] : [0, 1, 0];
  const gps = state?.gps,
    freshGPS = !!gps && now - gps.at < 30000 && state?.status.gps === "live";
  const sky =
    q && state?.absolute
      ? skyPoint(
          q,
          pointing,
          declination,
          new Date(now),
          freshGPS && trueNorth ? gps : undefined,
        )
      : null;
  const heading = displayQ ? topHeading(displayQ) : null;
  const calibrating =
    state?.calibration === "gyro" || state?.calibration === "mag";
  return (
    <LocalizedDigits>
      <div
        className="sensor-lab mx-auto max-w-7xl px-4 py-8 md:py-12"
        dir={fa ? "rtl" : "ltr"}
      >
        <header className="max-w-3xl space-y-3 mb-7">
          <p className="text-xs tracking-wide text-[var(--teal)]">
            {t(
              "ابزار خصوصی مدیر · اندازه‌گیری روی همین دستگاه",
              "Private admin tool · measurements stay on this device",
            )}
          </p>
          <h1 className="text-3xl md:text-4xl text-[var(--gold-soft)]">
            {t("گوشی در نقش ماهواره", "Phone as satellite")}
          </h1>
          <p className="text-sm leading-7 text-[var(--muted)]">
            {t(
              "از حرکت گوشی تا جهت نگاه به آسمان؛ دادهٔ خام، فیلتر کالمن و کالیبراسیون در یک قاب. دریافت حسگرها و GPS فقط پس از زدن دکمهٔ شروع انجام می‌شود.",
              "From phone motion to a direction on the sky: raw data, Kalman filtering and calibration together. Sensors and GPS start only when you press Start.",
            )}
          </p>
        </header>
        <section className="sensor-panel mb-5 flex flex-wrap items-center gap-3">
          <button
            className="sensor-primary"
            onClick={() => void start()}
            disabled={starting || state?.running}
          >
            {starting
              ? t("درخواست مجوز…", "Requesting permission…")
              : t("شروع و درخواست مجوز", "Start & request permission")}
          </button>
          <button
            className="sensor-button"
            disabled={!state?.running && !starting}
            onClick={() => {
              engine.current?.stop();
              setStarting(false);
            }}
          >
            {t("توقف", "Stop")}
          </button>
          <span role="status" className="text-sm text-[var(--muted)]">
            {state?.running
              ? t(
                  "فعال؛ خروج از صفحه یا پنهان‌شدن آن، دریافت را متوقف می‌کند.",
                  "Active; leaving or hiding this page stops capture.",
                )
              : t(
                  "دریافت متوقف است. برای ادامه دوباره شروع کنید.",
                  "Capture is stopped. Press Start to resume.",
                )}
          </span>
        </section>
        <section
          className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6"
          aria-label={t("وضعیت حسگرها", "Sensor status")}
        >
          {(
            [
              ["accel", t("شتاب‌سنج", "Accelerometer")],
              ["gyro", t("ژیروسکوپ", "Gyroscope")],
              ["mag", t("مغناطیس‌سنج خام", "Raw magnetometer")],
              ["orientation", t("جهت‌گیری مرورگر", "Browser orientation")],
              ["gps", "GPS"],
            ] as const
          ).map(([key, label]) => (
            <div className="sensor-panel !p-3 min-w-0" key={key}>
              <div className="text-xs text-[var(--muted)]">{label}</div>
              <div
                className={`text-sm my-1 ${state?.running && state?.status[key] === "live" ? "text-[var(--teal)]" : ""}`}
              >
                {!state?.running
                  ? t("خاموش", "Off")
                  : t(...statusText[state.status[key]])}
              </div>
              <div
                className="text-[10px] break-words text-[var(--muted)]"
                data-digit-literal
              >
                {state?.sources[key] ?? "—"}
                {key === "mag" &&
                  state?.running &&
                  state.absolute &&
                  state.q &&
                  state.status.mag !== "live" && (
                    <p className="text-[var(--teal)] mt-1">
                      {t(
                        "قطب‌نمای مغناطیسی فعال؛ میدان خام در دسترس نیست.",
                        "Magnetic compass active; raw field unavailable.",
                      )}
                    </p>
                  )}
              </div>
            </div>
          ))}
        </section>
        <MagnetometerHelp
          state={state}
          retry={() => {
            engine.current?.stop();
            void start();
          }}
        />
        <div
          role="tablist"
          aria-label={t("نماهای سنسور و دینامیک", "Sensor & dynamics views")}
          className="sensor-tabs mb-6"
        >
          {[
            ["pose", t("جهت و آسمان", "Attitude & sky")],
            ["sky", t("آسمان زندهٔ دوربین عقب", "Live rear-camera sky")],
            ["traces", t("نمودار حسگرها و کواترنیون", "Sensors & quaternions")],
            [
              "dynamics",
              t("فیلتر و دینامیک؛ اختیاری", "Filter & dynamics · optional"),
            ],
            ["calibration", t("کالیبراسیون", "Calibration")],
          ].map(([id, label]) => (
            <button
              key={id}
              id={`tab-${id}`}
              aria-controls={`panel-${id}`}
              role="tab"
              aria-selected={tab === id}
              tabIndex={tab === id ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  const ids = [
                      "pose",
                      "sky",
                      "traces",
                      "dynamics",
                      "calibration",
                    ],
                    i = ids.indexOf(tab),
                    next =
                      ids[
                        (i + (e.key === "ArrowRight" ? 1 : ids.length - 1)) %
                          ids.length
                      ];
                  setTab(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }
              }}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
          {tab === "sky" && (
            <CameraSky
              snapshot={state}
              declination={declination}
              northConfirmed={trueNorth}
              onReference={() => setTab("pose")}
              onStart={() => void start()}
            />
          )}
          {tab === "dynamics" && <FilterDynamics snapshot={state} />}
          {tab === "pose" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <section className="sensor-panel">
                <h2>
                  {t("وضعیت گوشی در فضای سه‌بعدی", "Phone attitude in 3D")}
                </h2>
                <SceneBoundary
                  fallback={
                    <p>
                      {t(
                        "نمای سه‌بعدی در این مرورگر در دسترس نیست؛ مقادیر عددی همچنان قابل استفاده‌اند.",
                        "3D is unavailable in this browser; numeric readings remain available.",
                      )}
                    </p>
                  }
                >
                  {q ? (
                    <PhoneScene
                      q={displayQ!}
                      axis={pointing}
                      northKnown={!!state?.absolute}
                    />
                  ) : (
                    <div className="h-80 grid place-items-center text-center text-[var(--muted)] px-5 border border-dashed border-[var(--border)] rounded-xl">
                      {t(
                        "برای نمایش وضعیت واقعی، دریافت را شروع کنید. در حالت خام، ابتدا مغناطیس‌سنج را کالیبره کنید.",
                        "Start capture to see the actual pose. Raw mode requires magnetometer calibration first.",
                      )}
                    </div>
                  )}
                </SceneBoundary>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Readout
                    label={t("یاو · حول بالا", "Yaw · about up")}
                    value={fmt(angles?.yaw)}
                    unit="°"
                  />
                  <Readout
                    label={t("پیچ · حول Y′", "Pitch · about Y′")}
                    value={fmt(angles?.pitch)}
                    unit="°"
                  />
                  <Readout
                    label={t("رول · حول X″", "Roll · about X″")}
                    value={fmt(angles?.roll)}
                    unit="°"
                  />
                </div>
                <p className="sensor-note">
                  {t(
                    "زاویه‌ها با قرارداد ZYX در چارچوب شرق–شمال–بالا محاسبه می‌شوند؛ یاو پادساعت‌گرد از شرق است و با سمت قطب‌نما تفاوت دارد. نزدیک پیچ ±۹۰°، یاو و رول یکتا نیستند؛ مدل کواترنیونی همچنان معتبر است.",
                    "Angles use intrinsic ZYX in east–north–up. Yaw is counterclockwise from east, unlike compass azimuth. Near pitch ±90°, yaw and roll are ambiguous; the quaternion view remains valid.",
                  )}
                </p>
                <Readout
                  label={t("سمت لبهٔ بالایی گوشی", "Physical top-edge heading")}
                  value={fmt(heading == null ? null : heading)}
                  unit="°"
                />
              </section>
              <section className="sensor-panel space-y-4">
                <h2>
                  {t("جهت نگاه گوشی به آسمان", "Phone pointing on the sky")}
                </h2>
                <label className="sensor-label">
                  {t("جهت انتخابی", "Pointing axis")}
                  <select
                    value={axis}
                    onChange={(e) => setAxis(e.target.value)}
                  >
                    <option value="screen">
                      {t(
                        "عمودِ رو به بیرونِ نمایشگر (+Z)",
                        "Outward screen normal (+Z)",
                      )}
                    </option>
                    <option value="camera">
                      {t(
                        "پشت گوشی / دوربین عقب (−Z)",
                        "Rear of phone / rear camera (−Z)",
                      )}
                    </option>
                    <option value="top">
                      {t("لبهٔ بالایی گوشی (+Y)", "Physical top edge (+Y)")}
                    </option>
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Readout
                    label={t(
                      "سمت · از شمال به شرق",
                      "Azimuth · north through east",
                    )}
                    value={fmt(sky?.az)}
                    unit="°"
                  />
                  <Readout
                    label={t("ارتفاع هندسی از افق", "Geometric altitude")}
                    value={fmt(sky?.alt)}
                    unit="°"
                  />
                  <Readout
                    label={t("بعد تقریبی تاریخ", "Approx. RA of date")}
                    value={fmt(sky?.ra, 3)}
                    unit="h"
                  />
                  <Readout
                    label={t("میل تقریبی تاریخ", "Approx. declination of date")}
                    value={fmt(sky?.dec)}
                    unit="°"
                  />
                </div>
                <p className="sensor-note" role="status">
                  {north.declination !== null
                    ? t(
                        `تصحیح خودکار شمال حقیقی از GPS و مدل ${north.model}: ${north.declination.toFixed(2)}°؛ نیازی به تأیید دستی نیست.`,
                        `Automatic true-north correction from GPS and ${north.model}: ${north.declination.toFixed(2)}°; no manual confirmation needed.`,
                      )
                    : t(
                        "پس از دریافت GPS، تصحیح شمال به‌طور خودکار محاسبه می‌شود.",
                        "True-north correction is calculated automatically after GPS arrives.",
                      )}
                </p>
                <details className="text-sm leading-7">
                  <summary className="cursor-pointer">
                    {t(
                      "تنظیم دستی شمال؛ اختیاری",
                      "Manual north override · optional",
                    )}
                  </summary>
                  <label className="flex gap-2 mt-3">
                    <input
                      type="checkbox"
                      checked={manualNorth}
                      onChange={(e) => setManualNorth(e.target.checked)}
                    />
                    {t(
                      "استفاده از مقدار دستی به جای محاسبهٔ خودکار",
                      "Use a manual value instead of automatic calculation",
                    )}
                  </label>
                  <label className="sensor-label mt-3">
                    {t(
                      "میل مغناطیسی دستی؛ شرق مثبت (درجه)",
                      "Manual magnetic declination; east positive (degrees)",
                    )}
                    <input
                      type="number"
                      min="-180"
                      max="180"
                      step="0.1"
                      disabled={!manualNorth}
                      value={manualDeclination}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (Number.isFinite(v))
                          setManualDeclination(
                            Math.max(-180, Math.min(180, v)),
                          );
                      }}
                    />
                  </label>
                </details>
                <p className="sensor-note">
                  {!state?.absolute
                    ? t(
                        "مرجع شمال نداریم؛ مختصات آسمانی نمایش داده نمی‌شود.",
                        "No north reference; sky coordinates are withheld.",
                      )
                    : !trueNorth
                      ? t(
                          "سمت نسبت به شمال مغناطیسی است (با آفست واردشده). تصحیح خودکار شمال فعلاً در دسترس نیست.",
                          "Azimuth uses magnetic north plus the entered offset. Automatic north correction is currently unavailable.",
                        )
                      : !freshGPS
                        ? t(
                            "برای بعد و میل، یک موقعیت GPS تازه لازم است.",
                            "RA/Dec need a fresh GPS fix.",
                          )
                        : t(
                            "مختصات هندسی و تقریبیِ تاریخ با زمان دستگاه؛ بدون تصحیح شکست جو. برای نشانه‌روی دقیق تلسکوپ مناسب نیست.",
                            "Approximate geometric coordinates of date using device time, without refraction. Not precision telescope pointing.",
                          )}
                </p>
                <p className="sensor-note">
                  {t(
                    "سمت در نزدیکی سرسو/پاسو یکتا نیست و پنهان می‌شود. صفحهٔ رو به بالا به سرسو نگاه می‌کند؛ دوربین عقب جهت مخالف را نشان می‌دهد.",
                    "Azimuth is withheld close to zenith/nadir. A face-up screen points to zenith; the rear camera points the opposite way.",
                  )}
                </p>
              </section>
              <section className="sensor-panel lg:col-span-2">
                <h2>
                  {t(
                    "موقعیت جغرافیایی و کیفیت اندازه‌گیری",
                    "Geographic position & measurement quality",
                  )}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Readout
                    label={t("عرض جغرافیایی", "Latitude")}
                    value={fmt(gps?.lat, 6)}
                    unit="°"
                  />
                  <Readout
                    label={t("طول جغرافیایی", "Longitude")}
                    value={fmt(gps?.lon, 6)}
                    unit="°"
                  />
                  <Readout
                    label={t("دقت افقی GPS", "GPS horizontal accuracy")}
                    value={fmt(gps?.accuracy)}
                    unit="m"
                  />
                  <Readout
                    label={t("ارتفاع GPS از بیضوی", "GPS ellipsoid altitude")}
                    value={fmt(gps?.altitude)}
                    unit="m"
                  />
                  <Readout
                    label={t("دقت ارتفاع", "Altitude accuracy")}
                    value={fmt(gps?.altitudeAccuracy)}
                    unit="m"
                  />
                  <Readout
                    label={t("سرعت GPS", "GPS speed")}
                    value={fmt(gps?.speed)}
                    unit="m/s"
                  />
                  <Readout
                    label={t(
                      "مسیر حرکت؛ جهت گوشی نیست",
                      "Travel course; not phone heading",
                    )}
                    value={fmt(gps?.course)}
                    unit="°"
                  />
                  <Readout
                    label={t("سن دادهٔ GPS", "GPS fix age")}
                    value={gps ? fmt(Math.max(0, (now - gps.at) / 1000)) : "—"}
                    unit="s"
                  />
                </div>
                <p className="sensor-note">
                  {t(
                    "این مدل فقط جهت‌گیری گوشی را نشان می‌دهد، نه جابه‌جایی سه‌بعدی آن. داده‌ها در حافظهٔ همین صفحه می‌مانند و با بارگذاری دوباره پاک می‌شوند.",
                    "This model shows attitude, not 3D displacement. Data stays in this page’s memory and clears on reload.",
                  )}
                </p>
              </section>
            </div>
          )}
          {tab === "traces" && (
            <div className="grid gap-5 lg:grid-cols-2">
              {(
                ["accel", "gyro", "mag", "orientation", "attitude"] as const
              ).map((key) => (
                <section className="sensor-panel" key={key}>
                  <h2>
                    {key === "accel"
                      ? t(
                          "شتاب ویژه؛ شامل اثر گرانش",
                          "Specific acceleration, including gravity",
                        )
                      : key === "gyro"
                        ? t("سرعت زاویه‌ای", "Angular velocity")
                        : key === "mag"
                          ? t("میدان مغناطیسی", "Magnetic field")
                          : key === "attitude"
                            ? t(
                                "یاو، پیچ، رول؛ پیش و پس از کالمن",
                                "Yaw, pitch, roll before/after Kalman",
                              )
                            : t(
                                "جهت‌گیری خام مرورگر",
                                "Raw browser orientation",
                              )}
                  </h2>
                  <SensorPlot
                    samples={state?.samples[key] ?? []}
                    unit={
                      key === "accel"
                        ? "m/s²"
                        : key === "gyro"
                          ? "rad/s"
                          : key === "mag"
                            ? "µT"
                            : "°"
                    }
                    labels={
                      key === "orientation"
                        ? ["α (Z)", "β (X′)", "γ (Y″)"]
                        : key === "attitude"
                          ? ["Yaw", "Pitch", "Roll"]
                          : undefined
                    }
                    rawOnly={key === "orientation"}
                  />
                  <p className="sensor-note">
                    {key === "mag"
                      ? t(
                          "خط پیوسته: فیلتر پایین‌گذر پس از تصحیح کالیبراسیون؛ خط‌چین: خروجی واقعی حسگر.",
                          "Solid: low-pass after calibration correction; dashed: actual sensor output.",
                        )
                      : key === "orientation"
                        ? t(
                            "این زاویه‌ها خروجی ترکیبی مرورگر هستند، نه خروجی خام مغناطیس‌سنج. فیلتر کالمن روی کواترنیون اعمال می‌شود.",
                            "These angles are the browser’s fused output, not raw magnetometer measurements. Kalman filtering operates on the quaternion.",
                          )
                        : t(
                            "محورهای فیزیکی: X به راست، Y به بالای گوشی، Z به بیرون نمایشگر. نمودارها حداکثر ۳۰ ثانیه و ۱۰ نمونه در ثانیه‌اند.",
                            "Physical axes: X right, Y phone top, Z out of screen. Traces retain at most 30 seconds at 10 samples/s.",
                          )}
                  </p>
                </section>
              ))}
              <QuaternionPlots samples={state?.quaternions ?? []} />
              <section className="sensor-panel lg:col-span-2">
                <h2>{t("تاریخچهٔ GPS", "GPS history")}</h2>
                <GpsPlots fixes={state?.gpsHistory ?? []} />
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-xs text-start" dir="ltr">
                    <thead>
                      <tr>
                        {[
                          "UTC",
                          "Lat °",
                          "Lon °",
                          "Altitude m",
                          "Accuracy m",
                        ].map((x) => (
                          <th className="p-2 text-start" key={x}>
                            {x}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {state?.gpsHistory
                        .slice(-30)
                        .reverse()
                        .map((p, i) => (
                          <tr
                            className="border-t border-[var(--border)]"
                            key={`${p.at}-${i}`}
                          >
                            <td className="p-2">
                              {new Date(p.at).toISOString().slice(11, 19)}
                            </td>
                            <td>{fmt(p.lat, 6)}</td>
                            <td>{fmt(p.lon, 6)}</td>
                            <td>{fmt(p.altitude)}</td>
                            <td>{fmt(p.accuracy)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <p className="sensor-note">
                  {t(
                    "مسیر GPS جایگزین قطب‌نما نیست؛ در حالت سکون معمولاً سمت حرکت معتبری ندارد.",
                    "GPS course does not replace a compass and is usually invalid while stationary.",
                  )}
                </p>
              </section>
            </div>
          )}
          {tab === "calibration" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <section className="sensor-panel space-y-4">
                <h2>{t("مسیر پردازش", "Processing mode")}</h2>
                <label className="sensor-label">
                  {t("منبع مرجع فیلتر کالمن", "Kalman reference source")}
                  <select
                    value={state?.mode ?? "browser"}
                    onChange={(e) =>
                      engine.current?.setMode(
                        e.target.value as "browser" | "raw",
                      )
                    }
                  >
                    <option value="browser">
                      {t(
                        "جهت‌گیری ترکیبی مرورگر + پیش‌بینی ژیروسکوپ",
                        "Browser fused orientation + gyro prediction",
                      )}
                    </option>
                    <option value="raw" disabled={!state?.magCalibrated}>
                      {t(
                        "شتاب‌سنج و میدان کالیبره + ژیروسکوپ",
                        "Accelerometer + calibrated field + gyro",
                      )}
                    </option>
                  </select>
                </label>
                <p className="sensor-note">
                  {t(
                    "پیش‌بینی کواترنیون با ژیروسکوپ و تصحیح خطای سه‌محوره با فیلتر کالمن انجام می‌شود. در حالت مرورگر، داده‌های مغناطیسی و شتاب‌سنج دوباره به‌عنوان مرجع مستقل وارد نمی‌شوند. بدون ژیروسکوپ، فقط هموارسازی کالمن مرجع داریم.",
                    "Gyro predicts the quaternion; a three-axis error-state Kalman filter corrects it. Browser mode does not reuse correlated accelerometer/magnetometer data as independent references. Without gyro, the filter only smooths the reference.",
                  )}
                </p>
                <Readout
                  label={t(
                    "انحراف معیار داخلی مدل؛ تضمین دقت نیست",
                    "Internal model σ; not an accuracy guarantee",
                  )}
                  value={q ? fmt(state?.sigma, 2) : "—"}
                  unit="°"
                />
                <p className="sensor-note">
                  {t(
                    "در حالت خام، شتاب غیرعادی و میدان خارج از محدوده رد می‌شوند. آهن‌ربا، خودرو، میز فلزی، ساعت نادرست و کالیبراسیون ناقص می‌توانند خطا ایجاد کنند؛ قاب مغناطیسی را جدا کنید.",
                    "Raw mode rejects abnormal acceleration and implausible field strength. Magnets, cars, metal surfaces, incorrect device time and incomplete calibration cause errors; remove magnetic cases.",
                  )}
                </p>
              </section>
              <section className="sensor-panel space-y-4">
                <h2>{t("کالیبراسیون عملی", "Practical calibration")}</h2>
                <button
                  className="sensor-button"
                  disabled={
                    !state?.running ||
                    calibrating ||
                    state.status.gyro !== "live" ||
                    state.status.accel !== "live"
                  }
                  onClick={() => engine.current?.calibrate("gyro")}
                >
                  {t(
                    "۵ ثانیه سکون؛ اندازه‌گیری بایاس ژیروسکوپ",
                    "5 seconds stationary: measure gyro bias",
                  )}
                </button>
                <p className="sensor-note">
                  {t(
                    "گوشی را روی سطح ثابت بگذارید و لمس نکنید. حرکت، لرزش و نمونهٔ ناکافی باعث رد کالیبراسیون می‌شود.",
                    "Place the phone on a stable surface without touching it. Motion, vibration or insufficient samples reject calibration.",
                  )}
                </p>
                <button
                  className="sensor-button"
                  disabled={
                    !state?.running ||
                    calibrating ||
                    state.status.mag !== "live"
                  }
                  onClick={() => engine.current?.calibrate("mag")}
                >
                  {t(
                    "۳۰ ثانیه چرخش سه‌محوره؛ کالیبراسیون میدان",
                    "30-second three-axis magnetometer calibration",
                  )}
                </button>
                <p className="sensor-note">
                  {t(
                    "گوشی را آرام در تمام جهت‌ها بچرخانید؛ فقط حرکت هشت‌شکل روی یک صفحه کافی نیست. تصحیح آفست و مقیاس قطری تقریبی است، نه برازش کامل بیضوی. کمبود پوشش یا اعوجاج زیاد رد می‌شود. این تصحیح فقط برای حالت خام اعمال می‌شود.",
                    "Slowly rotate through all orientations; a flat figure-eight is insufficient. This estimates offsets and diagonal scales, not a full ellipsoid fit. Poor coverage or large distortion is rejected. Correction applies only to raw mode.",
                  )}
                </p>
                {calibrating && (
                  <div role="status">
                    <progress
                      className="w-full"
                      max={1}
                      value={state?.progress}
                    />
                    <span>{fmt((state?.progress ?? 0) * 100, 0)}%</span>
                  </div>
                )}
                <p role="status" className="text-sm">
                  {state?.calibration === "failed"
                    ? t(
                        "کالیبراسیون رد شد یا قطع شد؛ سکون/پوشش کافی را بررسی و دوباره تلاش کنید.",
                        "Calibration rejected or interrupted. Check stability/coverage and retry.",
                      )
                    : state?.calibration === "done"
                      ? t("کالیبراسیون پذیرفته شد.", "Calibration accepted.")
                      : ""}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Readout
                    label={t("بایاس ژیروسکوپ", "Gyro bias")}
                    value={
                      state?.gyroCalibrated
                        ? state.bias.map((x) => fmt(x, 4)).join(" / ")
                        : "—"
                    }
                    unit="rad/s"
                  />
                  <Readout
                    label={t("اندازهٔ میدان", "Field magnitude")}
                    value={fmt(state?.magneticNorm)}
                    unit="µT"
                  />
                </div>
                <p className="text-sm">
                  {t("کالیبراسیون میدان: ", "Magnetic calibration: ")}
                  {state?.magCalibrated
                    ? t("پذیرفته‌شده", "accepted")
                    : t("انجام نشده", "not calibrated")}
                </p>
                <button
                  className="sensor-button"
                  onClick={() => engine.current?.resetCalibration()}
                >
                  {t("پاک‌کردن کالیبراسیون‌ها", "Reset calibrations")}
                </button>
              </section>
            </div>
          )}
        </div>
        <p className="sensor-note mt-6">
          {t(
            "مرورگر امن و حسگر واقعی لازم است. پشتیبانی اندروید به مدل گوشی و مرورگر بستگی دارد؛ اگر مغناطیس‌سنج خام در دسترس نباشد، حالت مرجع مرورگر همچنان قابل استفاده است. هیچ دادهٔ ساختگی جای دادهٔ گمشده نمایش داده نمی‌شود.",
            "A secure browser and actual sensors are required. Android support varies by phone and browser; browser-reference mode remains usable when raw magnetometer access is unavailable. Missing measurements are never replaced with simulated readings.",
          )}
        </p>
      </div>
    </LocalizedDigits>
  );
}
function Readout({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[var(--border)] p-3">
      <div className="text-xs text-[var(--muted)] mb-2 leading-5">{label}</div>
      <div
        dir="ltr"
        className="text-xl tabular-nums break-words text-[var(--gold-soft)]"
      >
        <LocalizedDigits>{value}</LocalizedDigits>{" "}
        <span className="text-xs text-[var(--muted)]">{unit}</span>
      </div>
    </div>
  );
}
