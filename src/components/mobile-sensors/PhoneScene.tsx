"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Quaternion, Vector3, CanvasTexture } from "three";
import { Quat, Vec } from "@/lib/mobile-sensors/math";
import { useMemo, useEffect } from "react";
import { useLanguage } from "@/components/language/Language";
export default function PhoneScene({
  q,
  axis,
  northKnown,
}: {
  q: Quat;
  axis: Vec;
  northKnown: boolean;
}) {
  const { t } = useLanguage();
  const transform = new Quaternion(-Math.SQRT1_2, 0, 0, Math.SQRT1_2).multiply(
    new Quaternion(...q),
  );
  return (
    <div
      className="relative h-80 w-full rounded-xl overflow-hidden border border-[var(--border)]"
      aria-label={t(
        "جهت گوشی در چارچوب شرق، شمال، بالا",
        "Phone attitude in east, north, up frame",
      )}
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [4, 3.2, 5], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 4, 5]} intensity={3} />
        <gridHelper args={[6, 12, "#64748b", "#475569"]} />
        <mesh>
          <sphereGeometry
            args={[2.8, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshBasicMaterial
            color="#6598a4"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
        <arrowHelper
          args={[
            new Vector3(1, 0, 0),
            new Vector3(),
            2.7,
            0xf08080,
            0.12,
            0.07,
          ]}
        />
        <arrowHelper
          args={[
            new Vector3(0, 1, 0),
            new Vector3(),
            2.7,
            0x5cbaa0,
            0.12,
            0.07,
          ]}
        />
        <arrowHelper
          args={[
            new Vector3(0, 0, -1),
            new Vector3(),
            2.7,
            0x74b7ed,
            0.12,
            0.07,
          ]}
        />
        <AxisLabel position={[2.9, 0, 0]} text={northKnown ? "E" : "Xref"} />
        <AxisLabel position={[0, 2.9, 0]} text="Up" />
        <AxisLabel position={[0, 0, -2.9]} text={northKnown ? "N" : "Yref"} />
        <group quaternion={transform}>
          <mesh>
            <boxGeometry args={[0.85, 1.75, 0.12]} />
            <meshStandardMaterial
              color="#697b92"
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0, 0.067]}>
            <planeGeometry args={[0.74, 1.55]} />
            <meshStandardMaterial color="#45b8c4" emissive="#12333b" />
          </mesh>
          <mesh position={[0, 0.66, 0.08]}>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="#172035" />
          </mesh>
          <arrowHelper
            args={[
              new Vector3(...axis),
              new Vector3(),
              2.6,
              0xe8bc70,
              0.25,
              0.12,
            ]}
          />
        </group>
        <OrbitControls enablePan={false} minDistance={4} maxDistance={10} />
      </Canvas>
      <span className="pointer-events-none absolute bottom-2 inset-x-2 text-center text-xs text-[var(--muted)]">
        {t(
          "برای چرخاندن دید بکشید؛ پیکان طلایی = جهت انتخابی گوشی",
          "Drag to orbit; gold arrow = selected phone direction",
        )}
      </span>
    </div>
  );
}

function AxisLabel({ position, text }: { position: Vec; text: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#182534";
    ctx.fillRect(0, 0, 128, 64);
    ctx.fillStyle = "#f2dfbd";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 64, 32);
    return new CanvasTexture(canvas);
  }, [text]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite position={position} scale={[0.55, 0.275, 1]}>
      <spriteMaterial map={texture} depthTest={false} />
    </sprite>
  );
}
