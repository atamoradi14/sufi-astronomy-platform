"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/language/Language";
import { AccessRequired } from "@/components/auth/AuthProvider";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { automaticNorth } from "@/lib/mobile-sensors/north";
import { mul, exp, RAD, poseAngles } from "@/lib/mobile-sensors/math";
import {
  remoteSnapshot,
  type Telemetry,
  type Device,
  type CameraFrame,
} from "@/lib/satellite/remote";
import {
  DEFAULT_ORBIT,
  validateElements,
  orbitState,
  commandedAttitude,
  type Elements,
} from "@/lib/satellite/orbit";
import { SensorPlot } from "@/components/mobile-sensors/SensorPlot";
import { QuaternionPlots } from "@/components/mobile-sensors/QuaternionPlots";
import { GpsPlots } from "@/components/mobile-sensors/GpsPlots";
import "@/components/mobile-sensors/sensors.css";
const PhoneScene = dynamic(
  () => import("@/components/mobile-sensors/PhoneScene"),
  { ssr: false },
);
const CameraSky = dynamic(
  () => import("@/components/mobile-sensors/CameraSky"),
  { ssr: false },
);
const FilterDynamics = dynamic(
  () => import("@/components/mobile-sensors/FilterDynamics"),
  { ssr: false },
);
const OrbitScene = dynamic(() => import("./OrbitScene"), { ssr: false });
type PairRequest = {
  id: string;
  name: string;
  model: string;
  code: string;
  expires: number;
};
type Apk = { version: string; sha256: string; bytes: number; minSdk: number };
const format = (n: number | null | undefined, p = 1) =>
  n == null || !Number.isFinite(n) ? "—" : n.toFixed(p);
async function api(path: string, data?: object) {
  const r = await fetch("/api/satellite/" + path, {
    method: data ? "POST" : "GET",
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
    cache: "no-store",
  });
  const value = await r.json();
  if (!r.ok) throw Error(value.error || "Request failed");
  return value;
}
export function SatelliteDashboard() {
  const { t, fa } = useLanguage(),
    { data: session, status: sessionStatus } = useSession();
  const [devices, setDevices] = useState<Device[]>([]),
    [requests, setRequests] = useState<PairRequest[]>([]),
    [selected, setSelected] = useState(""),
    [history, setHistory] = useState<Telemetry[]>([]),
    [frame, setFrame] = useState<CameraFrame | null>(null),
    [connected, setConnected] = useState(false),
    [socketState, setSocketState] = useState("idle"),
    [error, setError] = useState(""),
    [apk, setApk] = useState<Apk | null>(null),
    [tab, setTab] = useState("overview"),
    [now, setNow] = useState(Date.now());
  const frameUrl = useRef("");
  const [draft, setDraft] = useState<Elements>(() => ({
      ...DEFAULT_ORBIT,
      epoch: new Date().toISOString(),
    })),
    [orbit, setOrbit] = useState<Elements | null>(null),
    [orbitError, setOrbitError] = useState(""),
    [orbitStart, setOrbitStart] = useState(Date.now()),
    [speed, setSpeed] = useState(1),
    [elapsed, setElapsed] = useState(0),
    [playing, setPlaying] = useState(true);
  const refresh = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const [d, r] = await Promise.all([api("devices"), api("requests")]);
      setDevices(d.devices);
      setRequests(r.requests);
      setSelected((current) =>
        d.devices.some((x: Device) => x.id === current)
          ? current
          : (d.devices.find((x: Device) => x.connected)?.id ??
            d.devices[0]?.id ??
            ""),
      );
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connection failed");
    }
  }, [session?.user?.id]);
  useEffect(() => {
    fetch("/satellite-api/download/manifest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then(setApk)
      .catch(() => setApk(null));
  }, []);
  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), 4000);
    return () => clearInterval(timer);
  }, [refresh]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!selected || !session?.user?.id) return;
    let active = true,
      ws: WebSocket | null = null,
      timer: ReturnType<typeof setTimeout> | undefined;
    setHistory([]);
    setFrame(null);
    setConnected(false);
    if (frameUrl.current) {
      URL.revokeObjectURL(frameUrl.current);
      frameUrl.current = "";
    }
    const connect = async () => {
      setSocketState("connecting");
      try {
        const ticket = await api("ticket", { id: selected });
        if (!active) return;
        ws = new WebSocket(
          (location.protocol === "https:" ? "wss://" : "ws://") +
            location.host +
            ticket.path,
        );
        ws.binaryType = "arraybuffer";
        ws.onopen = () => {
          if (active) setSocketState("watching");
        };
        ws.onmessage = (event) => {
          if (!active) return;
          if (typeof event.data === "string") {
            try {
              const p = JSON.parse(event.data);
              if (p.type === "hello") {
                setHistory(p.history.slice(-300));
                setConnected(p.device.connected);
              } else if (p.type === "telemetry") {
                setHistory((old) => [...old, p].slice(-300));
                setConnected(true);
              } else if (p.type === "connection") {
                setConnected(p.connected);
                if (!p.connected) setFrame(null);
              }
            } catch {}
            return;
          }
          try {
            const bytes = event.data as ArrayBuffer,
              length = new DataView(bytes).getUint32(0);
            if (length > 2048 || length + 4 >= bytes.byteLength) return;
            const meta = JSON.parse(
              new TextDecoder().decode(bytes.slice(4, 4 + length)),
            );
            const url = URL.createObjectURL(
              new Blob([bytes.slice(4 + length)], { type: "image/jpeg" }),
            );
            if (frameUrl.current) URL.revokeObjectURL(frameUrl.current);
            frameUrl.current = url;
            setFrame({ ...meta, url, receivedAt: Date.now() });
          } catch {}
        };
        ws.onclose = () => {
          if (active) {
            setSocketState("reconnecting");
            setConnected(false);
            timer = setTimeout(() => void connect(), 2500);
          }
        };
        ws.onerror = () => ws?.close();
      } catch (e) {
        if (active) {
          setSocketState("unavailable");
          setError(e instanceof Error ? e.message : "Connection failed");
          timer = setTimeout(() => void connect(), 5000);
        }
      }
    };
    void connect();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      ws?.close();
      if (frameUrl.current) {
        URL.revokeObjectURL(frameUrl.current);
        frameUrl.current = "";
      }
    };
  }, [selected, session?.user?.id]);
  const snapshot = useMemo(
      () => remoteSnapshot(history, connected, now),
      [history, connected, now],
    ),
    latest = history.at(-1);
  const latitude = snapshot.gps?.lat,
    longitude = snapshot.gps?.lon,
    altitude = snapshot.gps?.altitude,
    day = new Date(now).toISOString().slice(0, 10);
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
  const q = snapshot.q,
    corrected = q ? mul(exp([0, 0, -(north.declination ?? 0) * RAD]), q) : null,
    angles = corrected ? poseAngles(corrected) : null;
  const simDate = new Date(
    orbit
      ? Date.parse(orbit.epoch) +
          elapsed * 1000 +
          (playing ? (now - orbitStart) * speed : 0)
      : now,
  );
  const state = orbit ? orbitState(orbit, simDate) : null;
  const space = state
    ? {
        positionKm: state.r,
        q: commandedAttitude(state.r, state.v, q ?? [0, 0, 0, 1]),
      }
    : undefined;
  const remote = { screenAngle: latest?.screenAngle ?? 0, image: frame };
  const act = async (path: string, data: object) => {
    try {
      await api(path, data);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    }
  };
  return (
    <LocalizedDigits>
      <div
        className="sensor-lab mx-auto max-w-7xl px-4 py-8 md:py-12 space-y-6"
        dir={fa ? "rtl" : "ltr"}
      >
        <header className="max-w-3xl space-y-3">
          <p className="text-xs text-[var(--teal)]">FANOUS · SATELLITE</p>
          <h1 className="text-3xl md:text-4xl text-[var(--gold-soft)]">
            {t("ماهوارهٔ خودت را بساز", "Build your own satellite")}
          </h1>
          <p className="text-sm leading-8 text-[var(--muted)]">
            {t(
              "گوشی اندرویدی را به یک ماهوارهٔ آزمایشی تبدیل کن؛ حسگرها و دوربین روی گوشی، داده‌ها و آسمان روی گوشی و لپ‌تاپ. یک برنامهٔ بومی، اتصال تأییدشده و شبیه‌سازی مدار.",
              "Turn an Android phone into an experimental satellite: sensors and camera on the phone, live data and sky on phone and laptop. Native acquisition, approved pairing, and an orbital simulator.",
            )}
          </p>
        </header>
        <section className="sensor-panel grid gap-5 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2>
              {t("۱. برنامهٔ اندروید را نصب کن", "1. Install the Android app")}
            </h2>
            <p className="sensor-note">
              {t(
                "ایمیل حساب گوگل را در برنامه وارد کن، کد اتصال را اینجا تأیید کن و ارسال را روی گوشی شروع کن. لپ‌تاپ فقط نمایشگر است؛ هیچ حسگر یا دوربینی روی این مرورگر آغاز نمی‌شود.",
                "Enter your Google email in the app, approve its pairing code here, then start publishing on the phone. The laptop is a viewer; this browser never starts its own sensors or camera.",
              )}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <a
                className="sensor-primary inline-block"
                href="/satellite-api/download/fanous-satellite.apk"
                download
              >
                {t("دانلود برنامهٔ اندروید (APK)", "Download Android app (APK)")}
              </a>
              <a className="sensor-button inline-block" href="#devices">
                {t("۲. تأیید و اتصال گوشی", "2. Approve & connect phone")}
              </a>
            </div>
          </div>
          <div className="text-sm space-y-3">
            <p>
              {t(
                "اندروید ۸ به بالا · بدون پرچم آزمایشی مرورگر",
                "Android 8+ · no experimental browser flags",
              )}
            </p>
            <p className="sensor-note">
              {t(
                "برای نصب مستقیم APK، اندروید ممکن است مجوز نصب از این منبع را بخواهد. در برنامه، حسگر و موقعیت و در صورت تمایل دوربین را مجاز کن. حالت رله نمایشگر را کم‌مصرف می‌کند و دوربین را خاموش نگه می‌دارد.",
                "Android may ask permission to install an APK from this source. In the app, allow location and optionally camera. Relay mode saves display power and keeps the camera off.",
              )}
            </p>
            {apk && (
              <details>
                <summary>
                  {t("نسخه و اثر انگشت فایل", "Version & file fingerprint")}
                </summary>
                <p>
                  v{apk.version} · {(apk.bytes / 1024 / 1024).toFixed(2)} MB
                </p>
                <code
                  className="break-all text-[10px]"
                  dir="ltr"
                  data-digit-literal
                >
                  SHA-256 {apk.sha256}
                </code>
              </details>
            )}
          </div>
        </section>
        {sessionStatus === "loading" ? (
          <p>{t("بررسی حساب…", "Checking account…")}</p>
        ) : !session?.user?.id ? (
          <AccessRequired feature="satellite" />
        ) : (
          <>
            <section id="devices" className="sensor-panel">
              <h2>{t("اتاق کنترل شخصی", "Your control room")}</h2>
              <p className="sensor-note break-all" data-digit-literal>
                {session.user.email}
              </p>
              {error && (
                <p role="alert" className="text-sm text-[var(--rose-ink)] my-3">
                  {error}{" "}
                  <button onClick={() => void refresh()} className="underline">
                    {t("تلاش دوباره", "Retry")}
                  </button>
                </p>
              )}
              {requests.length > 0 && (
                <div className="space-y-3 my-5">
                  <h3>
                    {t(
                      "درخواست‌های اتصال در انتظار تأیید",
                      "Pending phone requests",
                    )}
                  </h3>
                  {requests.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-xl border border-[var(--border)] p-4 flex flex-wrap gap-4 items-center"
                    >
                      <div className="grow min-w-0">
                        <strong>{r.name}</strong>
                        <p className="text-xs text-[var(--muted)]">{r.model}</p>
                        <p className="text-sm mt-2">
                          {t(
                            "کد روی گوشی را تطبیق بده: ",
                            "Match the code shown on the phone: ",
                          )}
                          <strong dir="ltr" className="tracking-widest">
                            {r.code}
                          </strong>
                        </p>
                      </div>
                      <button
                        className="sensor-primary"
                        onClick={() =>
                          void act("approve", {
                            id: r.id,
                            code: r.code,
                            approve: true,
                          })
                        }
                      >
                        {t("تأیید این گوشی", "Approve this phone")}
                      </button>
                      <button
                        className="sensor-button"
                        onClick={() =>
                          void act("approve", {
                            id: r.id,
                            code: r.code,
                            approve: false,
                          })
                        }
                      >
                        {t("رد", "Reject")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {!devices.length ? (
                <p className="sensor-note py-4">
                  {t(
                    "هنوز گوشی متصل نکرده‌ای. برنامه را نصب کن و با ایمیل بالا درخواست بفرست؛ سپس درخواست آن اینجا نمایش داده می‌شود. می‌توانی پیش‌نمایش مدار را هم امتحان کنی.",
                    "No paired phones yet. Install the app and request pairing with the email above; its request will appear here. You can also try the orbit preview.",
                  )}
                </p>
              ) : (
                <div className="flex flex-wrap gap-3 my-4">
                  {devices.map((d) => (
                    <button
                      key={d.id}
                      aria-pressed={selected === d.id}
                      className={
                        selected === d.id ? "sensor-primary" : "sensor-button"
                      }
                      onClick={() => setSelected(d.id)}
                    >
                      {d.name} ·{" "}
                      {d.connected
                        ? t("متصل", "Connected")
                        : t("آفلاین", "Offline")}
                    </button>
                  ))}
                </div>
              )}
              {selected && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-[var(--muted)]">
                    {snapshot.running
                      ? t("دادهٔ زندهٔ گوشی", "Live phone data")
                      : connected
                        ? t(
                            "منتظر بستهٔ تازهٔ گوشی",
                            "Waiting for a fresh phone packet",
                          )
                        : t(
                            "گوشی در حال ارسال نیست؛ شروع را در برنامه بزن",
                            "Phone is not publishing; press Start in the Android app",
                          )}{" "}
                    · {socketState}
                  </span>
                  <button
                    className="sensor-button !text-xs"
                    onClick={() => {
                      if (
                        confirm(
                          t(
                            "دسترسی این گوشی و اتصال‌هایش باطل شود؟",
                            "Revoke this phone and its connections?",
                          ),
                        )
                      )
                        void act("revoke", { id: selected });
                    }}
                  >
                    {t("ابطال دسترسی گوشی", "Revoke phone")}
                  </button>
                </div>
              )}
            </section>
            <div
              role="tablist"
              aria-label={t("نمای کنترل ماهواره", "Satellite control view")}
              className="sensor-tabs"
            >
              {[
                ["overview", t("وضعیت و سه‌بعدی", "Attitude & 3D")],
                ["plots", t("نمودارهای زنده", "Live charts")],
                ["sky", t("آسمان و دوربین گوشی", "Phone sky & camera")],
                ["orbit", t("شبیه‌سازی مدار", "Orbit simulation")],
                ["filter", t("فیلتر و معادلات", "Filter & equations")],
              ].map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  aria-controls={"satellite-" + id}
                  id={"satellite-tab-" + id}
                  onClick={() => setTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <section
              role="tabpanel"
              id={"satellite-" + tab}
              aria-labelledby={"satellite-tab-" + tab}
            >
              {tab === "overview" && (
                <div className="grid lg:grid-cols-2 gap-5">
                  <section className="sensor-panel">
                    <h2>
                      {t(
                        "گوشیِ متصل در فضای سه‌بعدی",
                        "Connected phone attitude in 3D",
                      )}
                    </h2>
                    {corrected ? (
                      <PhoneScene
                        q={corrected}
                        axis={[0, 0, -1]}
                        northKnown={snapshot.absolute}
                      />
                    ) : (
                      <div className="h-72 grid place-items-center text-center text-[var(--muted)]">
                        {t(
                          "ارسال را روی گوشی شروع کن؛ این مرورگر فقط دادهٔ دریافتی را نمایش می‌دهد.",
                          "Start publishing on the phone; this browser only displays received data.",
                        )}
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <Metric
                        label="Yaw"
                        value={format(angles?.yaw)}
                        unit="°"
                      />
                      <Metric
                        label="Pitch"
                        value={format(angles?.pitch)}
                        unit="°"
                      />
                      <Metric
                        label="Roll"
                        value={format(angles?.roll)}
                        unit="°"
                      />
                    </div>
                    <p className="sensor-note">
                      {t(
                        "جهت‌گیری واقعی از گوشی می‌آید؛ مکان سه‌بعدی از انتگرال شتاب ساخته نمی‌شود.",
                        "Actual attitude comes from the phone; no 3D displacement is invented from accelerometer integration.",
                      )}
                    </p>
                  </section>
                  <section className="sensor-panel">
                    <h2>
                      {t(
                        "تله‌متری و کیفیت اتصال",
                        "Telemetry & connection quality",
                      )}
                    </h2>
                    <p className="sensor-note mb-4">{t("پیش از رصد، گوشی را دور از فلز و آهنربا به شکل ۸ حرکت بده تا کالیبراسیون قطب‌نمای اندروید بهتر شود. برای اندازه‌گیری آرام، چند ثانیه ثابت نگه دار. حسگرهای غایب جایگزین ساختگی ندارند.", "Before observing, move the phone in a figure-eight away from metal and magnets to help Android compass calibration. Hold it still for a few seconds for stable readings. Missing sensors are never replaced with invented values.")}</p>
                    <div className="flex flex-wrap gap-2 mb-4 text-xs" dir="ltr">
                      {Object.entries(snapshot.status).map(([name,status])=><span key={name} className="rounded border border-[var(--border)] px-2 py-1">{name}: {status}</span>)}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Metric
                        label={t("باتری گوشی", "Phone battery")}
                        value={
                          latest?.battery == null
                            ? "—"
                            : format(latest.battery * 100, 0)
                        }
                        unit="%"
                      />
                      <Metric
                        label={t("سن بستهٔ سرور", "Server packet age")}
                        value={
                          latest
                            ? format(Math.max(0, now - latest.receivedAt), 0)
                            : "—"
                        }
                        unit="ms"
                      />
                      <Metric
                        label={t("عرض گوشی", "Phone latitude")}
                        value={format(snapshot.gps?.lat, 6)}
                        unit="°"
                      />
                      <Metric
                        label={t("طول گوشی", "Phone longitude")}
                        value={format(snapshot.gps?.lon, 6)}
                        unit="°"
                      />
                      <Metric
                        label={t("ارتفاع GPS", "GPS altitude")}
                        value={format(snapshot.gps?.altitude)}
                        unit="m"
                      />
                      <Metric
                        label={t("دقت GPS", "GPS accuracy")}
                        value={format(snapshot.gps?.accuracy)}
                        unit="m"
                      />
                      <Metric
                        label={t("اندازهٔ میدان خام", "Raw magnetic magnitude")}
                        value={format(snapshot.magneticNorm)}
                        unit="µT"
                      />
                      <Metric
                        label={t("نرخ زاویه‌ای بدنی", "Body angular speed")}
                        value={
                          latest?.gyro
                            ? format(Math.hypot(...latest.gyro), 3)
                            : "—"
                        }
                        unit="rad/s"
                      />
                    </div>
                    <p className="sensor-note">
                      {latest?.relay
                        ? t(
                            "گوشی در حالت رله و ذخیرهٔ نمایشگر است.",
                            "Phone is in relay/display-saving mode.",
                          )
                        : t(
                            "برای ذخیرهٔ باتری می‌توانی در برنامهٔ گوشی حالت رله را انتخاب کنی.",
                            "Choose relay mode in the Android app to save display power.",
                          )}{" "}
                      {north.declination !== null
                        ? t(
                            `تصحیح خودکار شمال: ${north.declination.toFixed(2)}°.`,
                            `Automatic north correction: ${north.declination.toFixed(2)}°.`,
                          )
                        : ""}
                    </p>
                  </section>
                </div>
              )}
              {tab === "plots" && (
                <div className="grid lg:grid-cols-2 gap-5">
                  {(["accel", "gyro", "mag", "attitude"] as const).map(
                    (key) => (
                      <section key={key} className="sensor-panel">
                        <h2>
                          {key === "accel"
                            ? t("شتاب‌سنج بومی", "Native accelerometer")
                            : key === "gyro"
                              ? t("ژیروسکوپ بومی", "Native gyroscope")
                              : key === "mag"
                                ? t("مغناطیس‌سنج بومی", "Native magnetometer")
                                : t(
                                    "جهت‌گیری پیش و پس از فیلتر",
                                    "Reference & filtered attitude",
                                  )}
                        </h2>
                        <SensorPlot
                          samples={snapshot.samples[key]}
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
                            key === "attitude"
                              ? ["Yaw", "Pitch", "Roll"]
                              : undefined
                          }
                        />
                      </section>
                    ),
                  )}
                  <QuaternionPlots samples={snapshot.quaternions} />
                  <section className="sensor-panel lg:col-span-2">
                    <h2>GPS</h2>
                    <GpsPlots fixes={snapshot.gpsHistory} />
                  </section>
                </div>
              )}
              {tab === "sky" && (
                <CameraSky
                  snapshot={snapshot}
                  declination={north.declination ?? 0}
                  northConfirmed={north.declination !== null}
                  onReference={() => setTab("overview")}
                  onStart={() => {}}
                  remote={remote}
                />
              )}
              {tab === "filter" && <FilterDynamics snapshot={snapshot} />}
              {tab === "orbit" && (
                <div className="space-y-5">
                  <section className="sensor-panel">
                    <h2>
                      {t(
                        "مدار را با شش عنصر کپلری بساز",
                        "Set six Keplerian orbital elements",
                      )}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(
                        [
                          ["a", t("نیم‌قطر بزرگ (km)", "Semi-major axis (km)")],
                          ["e", t("خروج از مرکز", "Eccentricity")],
                          ["i", t("میل مدار (°)", "Inclination (°)")],
                          [
                            "raan",
                            t("بعد گره صعودی Ω (°)", "Ascending node Ω (°)"),
                          ],
                          [
                            "argp",
                            t(
                              "آرگومان حضیض ω (°)",
                              "Argument of periapsis ω (°)",
                            ),
                          ],
                          [
                            "meanAnomaly",
                            t("آنومالی میانگین M₀ (°)", "Mean anomaly M₀ (°)"),
                          ],
                        ] as const
                      ).map(([key, label]) => (
                        <label className="sensor-label" key={key}>
                          {label}
                          <input
                            type="number"
                            step="any"
                            value={draft[key]}
                            onChange={(e) =>
                              setDraft((o) => ({
                                ...o,
                                [key]: Number(e.target.value),
                              }))
                            }
                          />
                        </label>
                      ))}
                    </div>
                    <label className="sensor-label mt-4">
                      {t("زمان مبدأ مدار (UTC ISO)", "Orbit epoch (UTC ISO)")}
                      <input
                        dir="ltr"
                        value={draft.epoch}
                        onChange={(e) =>
                          setDraft((o) => ({ ...o, epoch: e.target.value }))
                        }
                      />
                    </label>
                    <button
                      className="sensor-primary mt-4"
                      onClick={() => {
                        const error = validateElements(draft);
                        setOrbitError(error ?? "");
                        if (!error) {
                          setOrbit({ ...draft });
                          setOrbitStart(Date.now());
                          setElapsed(0);
                          setPlaying(true);
                        }
                      }}
                    >
                      {t(
                        "شبیه‌سازی ماهواره در مدار",
                        "Simulate satellite in orbit",
                      )}
                    </button>
                    {orbitError && (
                      <p role="alert" className="sensor-note">
                        {orbitError}
                      </p>
                    )}
                    <p className="sensor-note">
                      {t(
                        "مدل آموزشی دوجسمی است؛ کشش جو و J₂ و مانور ندارد. حرکت مداری از عناصر می‌آید و وضعیت بدنی با گوشی کنترل می‌شود. بدون گوشی، جهت بدنی ثابتِ پیش‌نمایش استفاده می‌شود.",
                        "Educational two-body model: no drag, J₂ or maneuvers. Elements drive translation; the phone commands body attitude. Without a phone, preview attitude is fixed.",
                      )}
                    </p>
                  </section>
                  {orbit && state && (
                    <>
                      <section className="sensor-panel">
                        <div className="flex flex-wrap gap-3 items-center mb-4">
                          <button
                            className="sensor-button"
                            onClick={() => {
                              if (playing) {
                                setElapsed(
                                  (v) =>
                                    v + ((now - orbitStart) * speed) / 1000,
                                );
                                setPlaying(false);
                              } else {
                                setOrbitStart(Date.now());
                                setPlaying(true);
                              }
                            }}
                          >
                            {playing
                              ? t("توقف زمان مدار", "Pause orbital time")
                              : t("ادامهٔ مدار", "Resume orbit")}
                          </button>
                          <label className="sensor-label">
                            {t("سرعت زمان", "Time scale")}
                            <select
                              value={speed}
                              onChange={(e) => {
                                if (playing)
                                  setElapsed(
                                    (v) =>
                                      v + ((now - orbitStart) * speed) / 1000,
                                  );
                                setOrbitStart(Date.now());
                                setSpeed(Number(e.target.value));
                              }}
                            >
                              {[1, 10, 30, 100].map((v) => (
                                <option key={v} value={v}>
                                  {v}×
                                </option>
                              ))}
                            </select>
                          </label>
                          <p className="text-xs" data-digit-literal>
                            {simDate.toISOString()}
                          </p>
                        </div>
                        <OrbitScene
                          elements={orbit}
                          date={simDate}
                          phone={q ?? [0, 0, 0, 1]}
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          <Metric
                            label={t("ارتفاع شبیه‌سازی", "Simulated altitude")}
                            value={format(state.altitude)}
                            unit="km"
                          />
                          <Metric
                            label={t("دوره", "Period")}
                            value={format(state.period / 60)}
                            unit="min"
                          />
                          <Metric
                            label={t("سرعت مداری", "Orbital speed")}
                            value={format(Math.hypot(...state.v), 3)}
                            unit="km/s"
                          />
                          <Metric
                            label={t("حضیض / اوج", "Perigee / apogee")}
                            value={
                              format(state.perigee) +
                              " / " +
                              format(state.apogee)
                            }
                            unit="km"
                          />
                        </div>
                        <p className="sensor-note">
                          {q
                            ? t(
                                "جهت و سرعت زاویه‌ای از گوشی زنده است. قاب LVLH: X در راستای حرکت، Y خلاف عمود مدار، Z رو به زمین.",
                                "Live phone attitude/rates command the body. LVLH: X along-track, Y opposite orbit normal, Z nadir.",
                              )
                            : t(
                                "گوشی زنده‌ای متصل نیست؛ مدار با جهت بدنی ثابت پیش‌نمایش می‌شود.",
                                "No live phone is connected; orbit uses a fixed preview attitude.",
                              )}
                        </p>
                      </section>
                      <CameraSky
                        snapshot={snapshot}
                        declination={0}
                        northConfirmed
                        onReference={() => {}}
                        onStart={() => {}}
                        remote={remote}
                        spaceView={space}
                      />
                    </>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </LocalizedDigits>
  );
}
function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <LocalizedDigits>
      <div className="min-w-0 rounded-xl border border-[var(--border)] p-3">
        <div className="text-xs text-[var(--muted)] leading-6">{label}</div>
        <div
          className="text-lg tabular-nums text-[var(--gold-soft)] break-words"
          dir="ltr"
        >
          {value} <span className="text-xs text-[var(--muted)]">{unit}</span>
        </div>
      </div>
    </LocalizedDigits>
  );
}
