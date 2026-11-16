"use client";
import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { Quaternion } from "three";
import {
  orbitState,
  commandedAttitude,
  EARTH_RADIUS_KM,
  type Elements,
} from "@/lib/satellite/orbit";
import type { Quat, Vec } from "@/lib/mobile-sensors/math";
export default function OrbitScene({
  elements,
  date,
  phone,
}: {
  elements: Elements;
  date: Date;
  phone: Quat;
}) {
  const state = orbitState(elements, date),
    r = state.r.map((x) => x / EARTH_RADIUS_KM) as Vec;
  const point = (v: Vec): [number, number, number] => [v[0], v[2], -v[1]];
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
  const q = new Quaternion(-Math.SQRT1_2, 0, 0, Math.SQRT1_2).multiply(
    new Quaternion(...commandedAttitude(state.r, state.v, phone)),
  );
  const extent = Math.max(2, (elements.a * (1 + elements.e)) / EARTH_RADIUS_KM),
    size = Math.max(0.06, Math.min(0.4, extent * 0.025));
  return (
    <div
      className="h-[430px] rounded-xl overflow-hidden border border-[var(--border)]"
      aria-label="Simulated Kepler orbit and phone-commanded satellite attitude"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [extent * 1.5, extent, extent * 1.5],
          near: 0.01,
          far: 2000,
        }}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[5, 5, 4]} intensity={2.3} />
        <mesh>
          <sphereGeometry args={[1, 48, 32]} />
          <meshStandardMaterial color="#164d70" roughness={0.8} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.003, 24, 12]} />
          <meshBasicMaterial
            color="#76a8b8"
            wireframe
            transparent
            opacity={0.24}
          />
        </mesh>
        <Line points={orbit} color="#dfba77" lineWidth={1.4} />
        <axesHelper args={[1.4]} />
        <group position={point(r)} quaternion={q}>
          <mesh>
            <boxGeometry args={[size, size * 1.8, size * 0.25]} />
            <meshStandardMaterial color="#e5c181" />
          </mesh>
          <mesh position={[0, 0, size * 0.14]}>
            <planeGeometry args={[size * 0.85, size * 1.5]} />
            <meshStandardMaterial color="#5ab7cd" />
          </mesh>
        </group>
        <OrbitControls
          enablePan={false}
          minDistance={1.2}
          maxDistance={extent * 6}
        />
      </Canvas>
    </div>
  );
}
