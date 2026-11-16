import {
  conjugate,
  dot,
  exp,
  mul,
  normalized,
  Quat,
  RAD,
  rotate,
  Vec,
} from "./math";

/** Physical rear camera: forward -Z, right +X, up +Y, never mirrored.
 * Display rotation changes right/up, not the physical rear pointing vector.
 */
export function rearCameraFrame(q: Quat, screenAngle = 0) {
  const a = screenAngle * RAD;
  return {
    forward: rotate(q, [0, 0, -1]),
    right: rotate(q, [Math.cos(a), Math.sin(a), 0]),
    up: rotate(q, [-Math.sin(a), Math.cos(a), 0]),
  };
}
export function cameraProject(
  v: Vec,
  frame: ReturnType<typeof rearCameraFrame>,
  verticalFov: number,
  aspect: number,
) {
  const depth = dot(v, frame.forward),
    scale = Math.tan((verticalFov * RAD) / 2);
  return {
    x: dot(v, frame.right) / (depth * scale * aspect),
    y: dot(v, frame.up) / (depth * scale),
    depth,
    visible: depth > 1e-7,
  };
}
/** Lens scale is tied to the short side, so portrait/landscape keep the same optics. */
export function verticalFovFromShortSide(
  shortFov: number,
  aspect: number,
): number {
  return (
    (2 * Math.atan(Math.tan((shortFov * RAD) / 2) * Math.max(1, 1 / aspect))) /
    RAD
  );
}
/** Gyro extrapolation is bounded to 100ms, never used to hide a stale reference. */
export function extrapolate(q: Quat, rate: Vec | null, seconds: number): Quat {
  return rate
    ? normalized(
        mul(
          q,
          exp(rate.map((x) => x * Math.max(0, Math.min(0.1, seconds))) as Vec),
        ),
      )
    : q;
}
export const worldToDevice = (q: Quat, v: Vec) => rotate(conjugate(q), v);
