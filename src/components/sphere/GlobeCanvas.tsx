"use client";

import { Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/** Shared WebGL shell: no ACES tone-map (that washed the globe to black) and no CDN fonts. */
export function GlobeCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? "h-full w-full"} style={{ minHeight: 240 }}>
      <CanvasErrorBoundary>
        <Canvas
          flat
          dpr={[1, 2]}
          camera={{ position: [2.35, 1.3, 2.35], fov: 42 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.NoToneMapping;
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.setClearColor("#081426", 1);
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e) => e.preventDefault(),
              false,
            );
          }}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            background: "#081426",
          }}
        >
          <color attach="background" args={["#081426"]} />
          <ambientLight intensity={1.4} />
          <directionalLight position={[3.5, 4.5, 2.5]} intensity={2.2} />
          <hemisphereLight args={["#9eb6d4", "#1a1020", 0.6]} />
          {children}
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={1.5}
            maxDistance={5}
            rotateSpeed={0.7}
            zoomSpeed={0.65}
          />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full min-h-[240px] items-center justify-center px-4 text-center text-sm text-[var(--muted)]">
          نمایش سه‌بعدی در این مرورگر در دسترس نیست. کروم یا فایرفاکس به‌روز را امتحان کنید.
        </div>
      );
    }
    return this.props.children;
  }
}
