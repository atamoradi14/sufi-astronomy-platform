"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { TubeArc } from "@/components/sphere/GlobePrimitives";
import { useDigitScript } from "@/components/digits/DigitScript";
import {
  equatorCircle,
  lonLatToCart,
  meridianCircle,
  parallelCircle,
  type Vec3,
} from "@/lib/astronomy/sphereGeom";
import { issOrbitPoints, issRadiusEarth } from "@/lib/astronomy/issOrbit";
import { formatLat, formatLon, localizeDigits } from "@/lib/utils";

type IssMark = {
  lat: number;
  lon: number;
  altKm: number | null;
  velocityKms?: number | null;
};

function Chip({
  title,
  lines,
  color,
}: {
  title: string;
  lines: string[];
  color: string;
}) {
  return (
    <Html occlude position={[0.12, 0.12, 0]} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
      <div
        lang="en"
        dir="ltr"
        style={{
          background: "rgba(6, 12, 22, 0.92)",
          border: `1px solid ${color}`,
          borderRadius: 8,
          padding: "4px 8px",
          color: "#f4efe2",
          fontSize: 12,
          lineHeight: 1.35,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          fontFeatureSettings: '"locl" 0',
          whiteSpace: "nowrap",
          boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
        }}
      >
        <strong style={{ color }}>{title}</strong>
        {lines.map((line) => (
          <span key={line} style={{ display: "block", color: "#d5deea", fontSize: 11 }}>
            {line}
          </span>
        ))}
      </div>
    </Html>
  );
}

function Starfield() {
  const geom = useMemo(() => {
    const count = 420;
    const positions = new Float32Array(count * 3);
    let seed = 17;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      const u = rnd();
      const v = rnd();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 6.2 + rnd() * 1.4;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  return (
    <points geometry={geom}>
      <pointsMaterial color="#d7e2f0" size={0.025} sizeAttenuation />
    </points>
  );
}

function FrameCamera({
  lat,
  lon,
  focus,
}: {
  lat: number;
  lon: number;
  focus: "observer" | "iss";
}) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const framed = useRef("");
  useEffect(() => {
    const key = `${focus}:${lat.toFixed(2)}:${lon.toFixed(2)}`;
    if (framed.current === key) return;
    framed.current = key;
    const p = lonLatToCart(lon, lat, focus === "iss" ? 3.15 : 2.65);
    camera.position.set(p[0], p[1] * 0.92 + 0.15, p[2]);
    camera.lookAt(0, 0, 0);
    controls?.update();
  }, [camera, controls, focus, lat, lon]);
  return null;
}

function RadialLink({
  lat,
  lon,
  r0,
  r1,
  color,
}: {
  lat: number;
  lon: number;
  r0: number;
  r1: number;
  color: string;
}) {
  const dir = useMemo(() => new THREE.Vector3(...lonLatToCart(lon, lat, 1)).normalize(), [lat, lon]);
  const quat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir),
    [dir],
  );
  const mid = useMemo(() => {
    const p = dir.clone().multiplyScalar((r0 + r1) / 2);
    return [p.x, p.y, p.z] as Vec3;
  }, [dir, r0, r1]);
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.0035, 0.0035, Math.abs(r1 - r0), 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Beacon({
  lat,
  lon,
  color,
  radius,
  stem,
}: {
  lat: number;
  lon: number;
  color: string;
  radius: number;
  stem: number;
}) {
  const dir = useMemo(() => new THREE.Vector3(...lonLatToCart(lon, lat, 1)).normalize(), [lat, lon]);
  const quat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir),
    [dir],
  );
  const foot = useMemo(() => lonLatToCart(lon, lat, radius), [lat, lon, radius]);
  const mid = useMemo(() => {
    const p = dir.clone().multiplyScalar(radius + stem / 2);
    return [p.x, p.y, p.z] as Vec3;
  }, [dir, radius, stem]);
  return (
    <group>
      <mesh position={mid} quaternion={quat}>
        <cylinderGeometry args={[0.006, 0.006, stem, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={foot}>
        <sphereGeometry args={[0.034, 24, 24]} />
        <meshBasicMaterial color="#fff6d0" />
      </mesh>
      <mesh position={foot}>
        <sphereGeometry args={[0.07, 18, 18]} />
        <meshBasicMaterial color={color} transparent opacity={0.38} />
      </mesh>
      <mesh position={foot}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.14} />
      </mesh>
      <pointLight position={foot} color="#ffe08a" intensity={1.4} distance={1.4} decay={2} />
    </group>
  );
}

export function ObserverGlobe({
  lat,
  lon,
  altM = null,
  iss = null,
  subsolar = null,
  ascending = true,
  focus = "observer",
}: {
  lat: number;
  lon: number;
  altM?: number | null;
  iss?: IssMark | null;
  subsolar?: { lat: number; lon: number } | null;
  ascending?: boolean;
  focus?: "observer" | "iss";
}) {
  useDigitScript();
  const [map, setMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let alive = true;
    loader.load("/earth-day.png", (texture) => {
      if (!alive) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1;
      texture.offset.x = 1;
      setMap(texture);
    });
    return () => {
      alive = false;
    };
  }, []);

  const sunPos = useMemo(() => {
    if (!subsolar) return [5, 1.2, 2] as Vec3;
    return lonLatToCart(subsolar.lon, subsolar.lat, 8);
  }, [subsolar]);

  const grid = useMemo(() => {
    const lines: { pts: Vec3[]; color: string; radius: number }[] = [];
    for (let mer = -150; mer <= 180; mer += 30) {
      const prime = mer === 0 || mer === 180 || mer === -180;
      lines.push({
        pts: meridianCircle(mer, 80),
        color: prime ? "#f0d78a" : "#8eacbf",
        radius: prime ? 0.0045 : 0.0024,
      });
    }
    for (let par = -60; par <= 60; par += 30) {
      lines.push({
        pts: parallelCircle(par, 96),
        color: par === 0 ? "#f0d78a" : "#8eacbf",
        radius: par === 0 ? 0.005 : 0.0024,
      });
    }
    lines.push({ pts: equatorCircle(120), color: "#f0d78a", radius: 0.006 });
    lines.push({ pts: meridianCircle(lon, 90), color: "#7ef0c2", radius: 0.006 });
    lines.push({ pts: parallelCircle(lat, 90), color: "#7ef0c2", radius: 0.005 });
    return lines;
  }, [lat, lon]);

  const issR = issRadiusEarth(iss?.altKm);
  const orbit = useMemo(
    () => (iss ? issOrbitPoints(iss.lat, iss.lon, ascending, issR, 220) : null),
    [iss, ascending, issR],
  );
  const plane = useMemo(
    () => (iss ? issOrbitPoints(iss.lat, iss.lon, ascending, 1.004, 220) : null),
    [iss, ascending],
  );

  const you = lonLatToCart(lon, lat, 1.012);
  const issPos = iss ? lonLatToCart(iss.lon, iss.lat, issR) : null;
  const frameLat = focus === "iss" && iss ? iss.lat : lat;
  const frameLon = focus === "iss" && iss ? iss.lon : lon;

  const youLines = [
    `${formatLat(lat)}   ${formatLon(lon)}`,
    altM == null ? "h = —" : `h = ${localizeDigits(altM.toFixed(0))} m`,
  ];
  const issLines = iss
    ? [
        `${formatLat(iss.lat, 3)}   ${formatLon(iss.lon, 3)}`,
        `h = ${localizeDigits((iss.altKm ?? 420).toFixed(1))} km`,
        iss.velocityKms == null ? "i = 51.64°" : `v = ${localizeDigits(iss.velocityKms.toFixed(3))} km/s`,
      ]
    : [];

  return (
    <div className="relative h-[460px] w-full md:h-[520px]">
      <Canvas
        flat
        dpr={[1, 2]}
        camera={{ position: [2.4, 1.2, 2.4], fov: 38 }}
        gl={{ antialias: true, alpha: false, powerPreference: "default" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor("#050910", 1);
        }}
      >
        <color attach="background" args={["#050910"]} />
        <Starfield />
        <ambientLight intensity={0.22} />
        <directionalLight position={sunPos} intensity={3.4} color="#fff4dd" />
        <hemisphereLight args={["#243656", "#070b12", 0.35]} />
        <FrameCamera lat={frameLat} lon={frameLon} focus={focus} />

        <mesh>
          <sphereGeometry args={[1, 96, 64]} />
          <meshStandardMaterial
            map={map ?? undefined}
            color={map ? "#ffffff" : "#1d4e89"}
            roughness={0.94}
            metalness={0.02}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.045, 48, 32]} />
          <meshBasicMaterial color="#8ec5ef" transparent opacity={0.1} side={THREE.BackSide} />
        </mesh>

        {grid.map((line, i) => (
          <TubeArc key={i} pts={line.pts} color={line.color} radius={line.radius} />
        ))}

        {plane ? <TubeArc pts={plane} color="#f0d78a" radius={0.0035} /> : null}
        {orbit ? <TubeArc pts={orbit} color="#9aefff" radius={0.006} /> : null}

        <Beacon lat={lat} lon={lon} color="#ffe08a" radius={1.012} stem={0.2} />
        <group position={you}>
          <Chip title="You · ناظر" lines={youLines} color="#ffe08a" />
        </group>

        {iss && issPos ? (
          <>
            <RadialLink lat={iss.lat} lon={iss.lon} r0={1.004} r1={issR} color="#9aefff" />
            <group position={issPos}>
              <mesh>
                <boxGeometry args={[0.028, 0.02, 0.05]} />
                <meshStandardMaterial color="#f4f7fb" metalness={0.35} roughness={0.28} />
              </mesh>
              <mesh>
                <boxGeometry args={[0.16, 0.004, 0.04]} />
                <meshStandardMaterial color="#1c4f8a" emissive="#163e6b" emissiveIntensity={0.55} />
              </mesh>
              <Chip title="ISS" lines={issLines} color="#9aefff" />
            </group>
          </>
        ) : null}

        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={1.4}
          maxDistance={6}
          enableDamping
          rotateSpeed={0.7}
        />
      </Canvas>
      <div
        className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 text-[11px] text-[#d5deea]"
        dir="ltr"
        lang="en"
      >
        <span className="rounded-md bg-black/55 px-2 py-1">حلقهٔ طلایی = صفحهٔ مدار روی زمین</span>
        <span className="rounded-md bg-black/55 px-2 py-1">حلقهٔ فیروزه‌ای = مدار ISS، ارتفاع حقیقی</span>
        <span className="rounded-md bg-black/55 px-2 py-1">
          مرز روز و شب از خورشید · i = {localizeDigits("51.64")}°
        </span>
      </div>
    </div>
  );
}
