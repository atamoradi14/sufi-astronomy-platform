"use client";
import { useLanguage } from "@/components/language/Language";
import {
  useDigitScript,
  LocalizedDigits,
} from "@/components/digits/DigitScript";
import { Suspense, useMemo, useEffect, useRef } from "react";
import {
  Canvas,
  useThree,
  useFrame,
  type ThreeEvent,
} from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { formatDigits } from "@/lib/digits";
import {
  equatorCircle,
  greatArc,
  lonLatToCart,
  meridianCircle,
  parallelCircle,
  smallCircle,
  normalize,
  cartToLonLat,
  type Vec3,
} from "@/lib/astronomy/sphereGeom";
export type SphereViewState = {
  showEquator: boolean;
  showMeridians: boolean;
  showParallels: boolean;
  showHorizon: boolean;
  showEcliptic: boolean;
  showTriangle: boolean;
  showSmallDemo: boolean;
  smallRadius: number;
  observerLat: number;
  pointA: {
    lon: number;
    lat: number;
  };
  pointB: {
    lon: number;
    lat: number;
  };
  pointC: {
    lon: number;
    lat: number;
  };
  vertexLabels?: [string, string, string];
  highlight: "none" | "great" | "small" | "triangle";
};
type Props = {
  state: SphereViewState;
  className?: string;
  onPlace?: (point: { lon: number; lat: number }) => void;
  resetKey?: number;
};
const COLORS = { a: "#79d5ca", b: "#91b9ff", c: "#f1cf7b" };
export function CelestialSphere({
  state,
  className,
  onPlace,
  resetKey = 0,
}: Props) {
  const { t } = useLanguage();
  return (
    <LocalizedDigits>
      {
        <div
          className={`relative ${className ?? ""}`}
          role="img"
          aria-label="Interactive unit sphere: drag to orbit, scroll or pinch to zoom. Select a vertex, then click the surface to place it."
        >
          <Canvas
            key={resetKey}
            camera={{ position: [2.1, 1.45, 2.5], fov: 40 }}
            dpr={[1, 2]}
            frameloop="demand"
            gl={{ antialias: true, alpha: false }}
            onCreated={({ gl }) => gl.setClearColor("#081322", 1)}
          >
            <ambientLight intensity={1.4} />
            <directionalLight position={[3, 5, 4]} intensity={1.8} />
            <Suspense fallback={null}>
              <SphereMesh state={state} onPlace={onPlace} />
            </Suspense>
            <FitCamera />
            <OrbitControls
              makeDefault
              enablePan={false}
              minDistance={2}
              maxDistance={6}
              rotateSpeed={0.65}
              zoomSpeed={0.65}
              enableDamping
              dampingFactor={0.12}
            />
          </Canvas>
          <div className="pointer-events-none absolute start-4 top-4 rounded-lg bg-[#07121fe6] px-3 py-2 text-xs text-[#a9bdd1]">
            R = 1 ·{" "}
            {onPlace
              ? t(
                  "برای جای‌گذاری روی سطح کلیک کنید",
                  "Click the surface to place the vertex",
                )
              : t("نمای بیرونی", "External view")}
          </div>
        </div>
      }
    </LocalizedDigits>
  );
}
function SphereMesh({
  state,
  onPlace,
}: {
  state: SphereViewState;
  onPlace?: Props["onPlace"];
}) {
  const { t } = useLanguage();
  const A = useMemo(
    () => lonLatToCart(state.pointA.lon, state.pointA.lat),
    [state.pointA],
  );
  const B = useMemo(
    () => lonLatToCart(state.pointB.lon, state.pointB.lat),
    [state.pointB],
  );
  const C = useMemo(
    () => lonLatToCart(state.pointC.lon, state.pointC.lat),
    [state.pointC],
  );
  const arcs = useMemo(
    () => [greatArc(B, C), greatArc(C, A), greatArc(A, B)],
    [A, B, C],
  );
  const Z = useMemo(
    () => lonLatToCart(0, state.observerLat),
    [state.observerLat],
  );
  const ecliptic = useMemo(
    () => smallCircle(lonLatToCart(90, 66.56), 90, 192),
    [],
  );
  const surface = useMemo(() => {
    const positions: number[] = [];
    const n = 24;
    const point = (i: number, j: number) =>
      normalize(
        A.map(
          (v, k) => (1 - (i + j) / n) * v + (i / n) * B[k] + (j / n) * C[k],
        ) as Vec3,
      ).map((v) => v * 1.006);
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n - i; j++) {
        positions.push(...point(i, j), ...point(i + 1, j), ...point(i, j + 1));
        if (i + j < n - 1)
          positions.push(
            ...point(i + 1, j),
            ...point(i + 1, j + 1),
            ...point(i, j + 1),
          );
      }
    return new Float32Array(positions);
  }, [A, B, C]);
  const place = (e: ThreeEvent<MouseEvent>) => {
    if (!onPlace || e.delta > 4) return;
    e.stopPropagation();
    onPlace(cartToLonLat([e.point.x, e.point.y, e.point.z]));
  };
  return (
    <group>
      <mesh onClick={place}>
        <sphereGeometry args={[0.998, 80, 64]} />
        <meshStandardMaterial color="#152940" roughness={0.95} />
      </mesh>
      <Line
        points={[
          [0, -1.2, 0],
          [0, 1.2, 0],
        ]}
        color="#6b819c"
        lineWidth={1}
        dashed
        dashSize={0.04}
        gapSize={0.03}
      />
      {state.vertexLabels?.[0] !== "P" && (
        <SphereMarker pos={[0, 1.08, 0]} label="P · N" color="#c8d9ea" />
      )}
      <SphereMarker pos={[0, -1.08, 0]} label="P′ · S" color="#c8d9ea" />
      {state.showEquator && (
        <Curve points={equatorCircle(192)} color="#f1cf7b" width={2} />
      )}
      {state.showMeridians &&
        [0, 30, 60, 90, 120, 150].map((l) => (
          <Curve
            key={l}
            points={meridianCircle(l)}
            color="#52708c"
            width={0.7}
          />
        ))}
      {state.showParallels &&
        [-60, -30, 30, 60].map((l) => (
          <Curve
            key={l}
            points={parallelCircle(l)}
            color="#528a91"
            width={0.8}
            dashed
          />
        ))}
      {state.showEcliptic && (
        <Curve points={ecliptic} color="#ad9bff" width={2.5} />
      )}
      {state.showHorizon && (
        <>
          <Curve points={smallCircle(Z, 90, 192)} color="#ed94aa" width={2.7} />
          <SphereMarker
            pos={Z.map((v) => v * 1.04) as Vec3}
            label="Z"
            color="#ed94aa"
          />
          <Line
            points={[[0, 0, 0], Z]}
            color="#ed94aa"
            dashed
            dashSize={0.04}
            gapSize={0.03}
          />
        </>
      )}
      {state.showSmallDemo && (
        <>
          <Curve
            points={smallCircle(A, state.smallRadius, 192)}
            color="#b2a5ff"
            width={2.5}
          />
          {!state.showTriangle && (
            <SphereMarker
              pos={A}
              label={t("A · قطب", "A · pole")}
              color="#b2a5ff"
            />
          )}
        </>
      )}
      {state.showTriangle && (
        <>
          <mesh>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[surface, 3]}
              />
            </bufferGeometry>
            <meshBasicMaterial
              color="#6dd0c4"
              transparent
              opacity={0.12}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          {arcs.map((p, i) => (
            <Curve
              key={i}
              points={p}
              color={Object.values(COLORS)[i]}
              width={3}
            />
          ))}
          {[A, B, C].map((p, i) => (
            <SphereMarker
              key={i}
              pos={p}
              label={(state.vertexLabels ?? ["A", "B", "C"])[i]}
              color={Object.values(COLORS)[i]}
            />
          ))}
          {arcs.map((p, i) => (
            <SphereMarker
              key={i}
              pos={p[Math.floor(p.length / 2)]}
              label={["a", "b", "c"][i]}
              color={Object.values(COLORS)[i]}
              small
            />
          ))}
        </>
      )}
    </group>
  );
}
function Curve({
  points,
  color,
  width = 1.5,
  dashed = false,
}: {
  points: Vec3[];
  color: string;
  width?: number;
  dashed?: boolean;
}) {
  return (
    <Line
      points={points.map((p) => p.map((v) => v * 1.009) as Vec3)}
      color={color}
      lineWidth={width}
      dashed={dashed}
      dashSize={0.035}
      gapSize={0.025}
    />
  );
}
export function SphereMarker({
  pos,
  label,
  color,
  small = false,
}: {
  pos: Vec3;
  label: string;
  color: string;
  small?: boolean;
}) {
  const script = useDigitScript();
  const displayLabel = formatDigits(label, script);
  const sprite = useRef<THREE.Sprite>(null);
  useFrame(({ camera, size }) => {
    if (sprite.current && camera instanceof THREE.PerspectiveCamera) {
      const height =
        (24 * 2 * Math.tan((camera.fov * Math.PI) / 360)) /
        Math.max(1, size.height);
      sprite.current.scale.set(height * texture.ratio, height, 1);
    }
  });
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = "600 24px Vazirmatn Variable, sans-serif";
    const width = Math.ceil(ctx.measureText(displayLabel).width) + 24;
    canvas.width = width * 2;
    canvas.height = 72;
    ctx.scale(2, 2);
    ctx.font = "600 24px Vazirmatn Variable, sans-serif";
    ctx.fillStyle = "#07121f";
    ctx.beginPath();
    ctx.roundRect(0, 0, width, 36, 7);
    ctx.fill();
    ctx.strokeStyle = "#8298b055";
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayLabel, width / 2, 19);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return { map, ratio: width / 36 };
  }, [displayLabel, color]);
  useEffect(() => () => texture.map.dispose(), [texture]);
  return (
    <group position={pos.map((v) => v * 1.025) as Vec3}>
      {!small && (
        <mesh>
          <sphereGeometry args={[0.017, 16, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
      <sprite
        ref={sprite}
        position={pos.map((v) => v * 0.055) as Vec3}
        scale={[0.09 * texture.ratio, 0.09, 1]}
      >
        <spriteMaterial
          map={texture.map}
          sizeAttenuation={false}
          transparent
          depthWrite={false}
          depthTest
          alphaTest={0.01}
        />
      </sprite>
    </group>
  );
}
function FitCamera() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const ratio = Math.min(1, size.width / Math.max(1, size.height));
      camera.fov =
        (2 * Math.atan(Math.tan((20 * Math.PI) / 180) / ratio) * 180) / Math.PI;
      camera.updateProjectionMatrix();
      invalidate();
    }
  }, [camera, size.width, size.height, invalidate]);
  return null;
}
