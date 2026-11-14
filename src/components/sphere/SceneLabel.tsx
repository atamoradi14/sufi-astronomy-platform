"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDigitScript } from "@/components/digits/DigitScript";
import { formatDigits } from "@/lib/digits";
import type { Vec3 } from "@/lib/astronomy/sphereGeom";

/** Scene-native text. Keeps chart labels out of DOM portals during view changes. */
export function SceneLabel({
  text,
  position = [0, 0, 0],
  color = "#f1cf7b",
  lineHeight = 20,
}: {
  text: string;
  position?: Vec3;
  color?: string;
  lineHeight?: number;
}) {
  const script = useDigitScript();
  const sprite = useRef<THREE.Sprite>(null);
  const display = formatDigits(text, script);
  const texture = useMemo(() => {
    const lines = display.split("\n");
    const canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d")!;
    ctx.font = "500 24px sans-serif";
    const width =
        Math.ceil(
          Math.max(...lines.map((line) => ctx.measureText(line).width)),
        ) + 24,
      height = 32 * lines.length + 8;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);
    ctx.font = "500 24px sans-serif";
    ctx.fillStyle = "#07121ff2";
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 8);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    lines.forEach((line, i) => {
      ctx.fillStyle = i === 0 ? color : "#d5deea";
      ctx.fillText(line, 12, 20 + i * 32);
    });
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return { map, ratio: width / height, rows: lines.length };
  }, [display, color]);
  useEffect(() => () => texture.map.dispose(), [texture]);
  useFrame(({ camera, size }) => {
    if (sprite.current && camera instanceof THREE.PerspectiveCamera) {
      const height =
        (lineHeight *
          texture.rows *
          2 *
          Math.tan((camera.fov * Math.PI) / 360)) /
        Math.max(1, size.height);
      sprite.current.scale.set(height * texture.ratio, height, 1);
    }
  });
  return (
    <sprite ref={sprite} position={position}>
      <spriteMaterial
        map={texture.map}
        sizeAttenuation={false}
        transparent
        depthTest
        depthWrite={false}
        alphaTest={0.01}
      />
    </sprite>
  );
}
