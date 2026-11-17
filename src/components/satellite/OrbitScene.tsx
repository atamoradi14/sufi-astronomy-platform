"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Quaternion, Vector3, SRGBColorSpace, BackSide } from "three";
import { Body, GeoVector, SiderealTime } from "astronomy-engine";
import { useLanguage } from "@/components/language/Language";
import {
  orbitState,
  commandedAttitude,
  EARTH_RADIUS_KM,
  type Elements,
} from "@/lib/satellite/orbit";
import { rotate, type Quat, type Vec } from "@/lib/mobile-sensors/math";
import { rearCameraFrame } from "@/lib/mobile-sensors/camera";
const point = (v: Vec): [number, number, number] => [v[0], v[2], -v[1]];
type View = "earth" | "follow" | "camera";
function Earth({ date }: { date: Date }) {
  const [day, clouds] = useTexture([
    "/textures/earth-day.jpg",
    "/textures/earth-clouds.jpg",
  ]);
  day.colorSpace = SRGBColorSpace;
  const spin = (SiderealTime(date) * Math.PI) / 12;
  return (
    <group rotation={[0, spin, 0]}>
      <mesh>
        <sphereGeometry args={[1, 80, 48]} />
        <meshStandardMaterial map={day} roughness={0.82} metalness={0.05} />
      </mesh>
      <mesh rotation={[0, 0.008, 0]}>
        <sphereGeometry args={[1.006, 64, 40]} />
        <meshStandardMaterial
          alphaMap={clouds}
          transparent
          opacity={0.72}
          depthWrite={false}
          roughness={1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.025, 48, 32]} />
        <shaderMaterial
          side={BackSide}
          transparent
          depthWrite={false}
          uniforms={{}}
          vertexShader={`varying vec3 n;varying vec3 p;void main(){vec4 v=modelViewMatrix*vec4(position,1.);p=v.xyz;n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*v;}`}
          fragmentShader={`varying vec3 n;varying vec3 p;void main(){float f=pow(1.-abs(dot(normalize(n),normalize(-p))),3.);gl_FragColor=vec4(.18,.49,.95,f*.5);}`}
        />
      </mesh>
    </group>
  );
}
function ViewController({
  view,
  r,
  q,
  extent,
  size,
  screenAngle,
}: {
  view: View;
  r: Vec;
  q: Quat;
  extent: number;
  size: number;
  screenAngle: number;
}) {
  const { camera } = useThree();
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const target = new Vector3(...point(r));
  useEffect(() => {
    camera.up.set(0,1,0);
    camera.position.set(extent * 1.5, extent, extent * 1.5);
    if (view === "follow")
      camera.position
        .copy(target)
        .add(new Vector3(size * 8, size * 5, size * 8));
    controls.current?.target.copy(view === "follow" ? target : new Vector3());
    controls.current?.update();
    // Only a deliberate mode change resets the user's chosen orbit-camera offset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);
  useFrame(() => {
    if (view === "camera") {
      const f = rearCameraFrame(q, screenAngle);
      camera.position.copy(target);
      camera.up.set(...point(f.up));
      camera.lookAt(target.clone().add(new Vector3(...point(f.forward))));
    } else if (view === "follow" && controls.current) {
      camera.position.add(target.clone().sub(controls.current.target));
      controls.current.target.copy(target);
      controls.current.update();
    }
  });
  return (
    <OrbitControls
      ref={controls}
      enabled={view !== "camera"}
      enablePan={false}
      minDistance={view === "follow" ? size * 3 : 1.05}
      maxDistance={extent * 8}
      makeDefault
    />
  );
}
function Satellite({
  size,
  rayLength,
  fov,
  screenAngle,
}: {
  size: number;
  rayLength: number;
  fov: number;
  screenAngle: number;
}) {
  const depth = Math.min(rayLength, 1),
    half = Math.tan((fov * Math.PI) / 360) * depth;
  return (
    <>
      <mesh>
        <boxGeometry args={[size, size * 1.8, size * 1.2]} />
        <meshStandardMaterial
          color="#d9ba78"
          metalness={0.7}
          roughness={0.38}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * size * 1.65, 0, 0]}>
          <mesh>
            <boxGeometry args={[size * 2.2, size * 1.65, size * 0.08]} />
            <meshStandardMaterial
              color="#164e85"
              metalness={0.65}
              roughness={0.3}
            />
          </mesh>
          {[-0.6, 0, 0.6].map((y) => (
            <Line
              key={y}
              points={[
                [-size, y * size, -size * 0.05],
                [size, y * size, -size * 0.05],
              ]}
              color="#79aed4"
              lineWidth={0.6}
            />
          ))}
        </group>
      ))}
      <mesh position={[0, 0, -size * 0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.27, size * 0.32, size * 0.4, 20]} />
        <meshStandardMaterial
          color="#202b39"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0, -size * 0.96]}>
        <circleGeometry args={[size * 0.22, 24]} />
        <meshStandardMaterial
          color="#51cce5"
          emissive="#17738a"
          side={2}
          metalness={0.8}
          roughness={0.12}
        />
      </mesh>
      <Line
        points={[
          [0, 0, -size],
          [0, 0, -rayLength],
        ]}
        color="#70e2d3"
        lineWidth={2}
      />
      <group rotation={[0, 0, (screenAngle * Math.PI) / 180]}>
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((y) => (
            <Line
              key={x + ":" + y}
              points={[
                [0, 0, -size],
                [x * half * 0.7, y * half, -depth],
              ]}
              color="#70e2d3"
              transparent
              opacity={0.45}
              lineWidth={0.7}
            />
          )),
        )}
        <Line
          points={[
            [-half * 0.7, -half, -depth],
            [half * 0.7, -half, -depth],
            [half * 0.7, half, -depth],
            [-half * 0.7, half, -depth],
            [-half * 0.7, -half, -depth],
          ]}
          color="#70e2d3"
          transparent
          opacity={0.6}
        />
      </group>
    </>
  );
}
export default function OrbitScene({
  elements,
  date,
  phone,
  screenAngle = 0,
  shortFov = 50,
}: {
  elements: Elements;
  date: Date;
  phone: Quat;
  screenAngle?: number;
  shortFov?: number;
}) {
  const { t } = useLanguage();
  const [view, setView] = useState<View>("earth"),
    [beam, setBeam] = useState(true);
  const state = orbitState(elements, date),
    r = state.r.map((x) => x / EARTH_RADIUS_KM) as Vec,
    qECI = commandedAttitude(state.r, state.v, phone);
  const q = new Quaternion(-Math.SQRT1_2, 0, 0, Math.SQRT1_2).multiply(
    new Quaternion(...qECI),
  );
  const extent = Math.max(2, (elements.a * (1 + elements.e)) / EARTH_RADIUS_KM),
    size = Math.max(0.012, Math.min(0.12, extent * 0.014));
  const forward = rotate(qECI, [0, 0, -1]),
    dot = r.reduce((s, x, i) => s + x * forward[i], 0),
    disc = dot * dot - (Math.hypot(...r) ** 2 - 1);
  const hits = dot < 0 && disc >= 0,
    rayLength = hits ? -dot - Math.sqrt(disc) : extent;
  const sun = useMemo(() => {
    const v = GeoVector(Body.Sun, date, true);
    return point([v.x, v.y, v.z]).map(
      (x) => (x / Math.hypot(v.x, v.y, v.z)) * 100,
    ) as [number, number, number];
  }, [date]);
  const orbit = useMemo(() => {
    const period = orbitState(elements, new Date(elements.epoch)).period;
    return Array.from({ length: 361 }, (_, i) =>
      point(
        orbitState(
          elements,
          new Date(Date.parse(elements.epoch) + (period * 1000 * i) / 360),
        ).r.map((v) => v / EARTH_RADIUS_KM) as Vec,
      ),
    );
  }, [elements]);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["earth", t("نمای زمین", "Earth overview")],
            ["follow", t("دنبال‌کردن ماهواره", "Follow satellite")],
            ["camera", t("دید دوربین عقب گوشی", "Phone rear-camera view")],
          ] as [View, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            className={view === id ? "sensor-primary" : "sensor-button"}
            aria-pressed={view === id}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={beam}
            onChange={(e) => setBeam(e.target.checked)}
          />
          {t("راستای دوربین و مخروط دید", "Camera direction & FOV guide")}
        </label>
      </div>
      <div
        className="h-[min(68vh,620px)] min-h-96 rounded-xl overflow-hidden border border-[var(--border)] bg-[#030812]"
        aria-label={t(
          "زمین و ماهواره با دوربین هم‌راستا با پشت گوشی",
          "Earth and spacecraft with phone-aligned rear camera",
        )}
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{
            position: [extent * 1.5, extent, extent * 1.5],
            near: 0.001,
            far: 2000,
            fov: shortFov,
          }}
        >
          <color attach="background" args={["#030812"]} />
          <ambientLight intensity={0.3} />
          <directionalLight position={sun} intensity={3} />
          <Stars
            radius={200}
            depth={50}
            count={1200}
            factor={2}
            fade
            speed={0}
          />
          <Suspense fallback={null}>
            <Earth date={date} />
          </Suspense>
          <Line points={orbit} color="#dfba77" lineWidth={1.5} />
          {view !== "camera" && (
            <group position={point(r)} quaternion={q}>
              <Satellite
                size={size}
                rayLength={beam ? rayLength : size}
                fov={shortFov}
                screenAngle={screenAngle}
              />
            </group>
          )}
          <ViewController
            view={view}
            r={r}
            q={qECI}
            extent={extent}
            size={size}
            screenAngle={screenAngle}
          />
        </Canvas>
      </div>
      <p className="sensor-note">
        {t(
          "بکش: چرخش دید · دو انگشت یا اسکرول: بزرگ‌نمایی. محور فیروزه‌ای دقیقاً −Z گوشی، یعنی راستای دوربین عقب است. اندازهٔ ماهواره برای خوانایی بزرگ‌تر نمایش داده شده؛ تصاویر زمین و ابرها زنده نیستند.",
          "Drag to orbit · pinch or scroll to zoom. The teal axis is exactly phone −Z, the rear-camera direction. Spacecraft size is exaggerated for visibility; Earth/cloud imagery is not live.",
        )}{" "}
        {beam &&
          (hits
            ? t("دوربین به زمین می‌رسد.", "Camera ray intersects Earth.")
            : t(
                "دوربین به فضا اشاره می‌کند.",
                "Camera ray points into space.",
              ))}
      </p>
      <p className="text-[10px] text-[var(--muted)]">
        {t("بافت زمین و ابرها:", "Earth and cloud textures:")}{" "}
        <a
          href="https://www.solarsystemscope.com/textures/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Solar System Scope / CC BY 4.0
        </a>
      </p>
    </div>
  );
}
