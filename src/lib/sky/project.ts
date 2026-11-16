/** Spherical sky views: conformal stereographic exploration and an equidistant all-sky dome. */

import { equatorialToHorizontal } from "@/lib/astronomy/sphere";
import { lstHours } from "@/lib/astronomy/time";

export type SkyStar = {
  id: number;
  ra: number;
  dec: number;
  mag: number;
  bv: number | null;
  n: string | null;
};

export type Look = {
  /** View-centre azimuth, degrees from north toward east (0–360). */
  az: number;
  /** View-centre altitude, degrees (−89…89). */
  alt: number;
  /** Camera roll, degrees; retained during spherical dragging across the zenith. */
  roll?: number;
  projection?: "stereographic" | "dome";
  /** Vertical field of view in degrees. */
  fov: number;
};

type Vec3 = [number, number, number];

const DEG = Math.PI / 180;

/** Local horizontal unit vector: +X east, +Y north, +Z up. */
export function azAltToVec(azDeg: number, altDeg: number): Vec3 {
  const az = azDeg * DEG;
  const alt = altDeg * DEG;
  const c = Math.cos(alt);
  return [c * Math.sin(az), c * Math.cos(az), Math.sin(alt)];
}

function norm(v: Vec3): Vec3 {
  const n = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / n, v[1] / n, v[2] / n];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot(a: Vec3, b: Vec3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/** Orthonormal camera frame. Roll avoids a forced orientation flip at the zenith. */
export function lookBasis(look: Look): {
  forward: Vec3;
  right: Vec3;
  up: Vec3;
} {
  const forward = azAltToVec(look.az, look.alt);
  const a = look.az * DEG;
  const east: Vec3 = [Math.cos(a), -Math.sin(a), 0];
  const north = norm(cross(east, forward));
  const roll = (look.roll ?? 0) * DEG;
  const right = east.map(
    (v, i) => v * Math.cos(roll) + north[i] * Math.sin(roll),
  ) as Vec3;
  return { forward, right, up: norm(cross(right, forward)) };
}

/** Precompute camera trigonometry once per frame, rather than once per star. */
export function createSkyProjector(look: Look) {
  const { forward, right, up } = lookBasis(look);
  const dome = look.projection === "dome";
  const k = Math.tan((look.fov * DEG) / 4);
  const project = (az: number, alt: number) => {
    const s = azAltToVec(az, alt);
    const depth = Math.max(-1, Math.min(1, dot(s, forward)));
    const dx = dot(s, right),
      dy = dot(s, up);
    if (dome) {
      const theta = Math.acos(depth),
        sin = Math.hypot(dx, dy);
      if (depth < -1e-10) return { x: 0, y: 0, visible: false, depth };
      const scale = sin < 1e-12 ? 2 / Math.PI : theta / ((sin * Math.PI) / 2);
      return { x: dx * scale, y: dy * scale, visible: true, depth };
    }
    if (1 + depth < 1e-9) return { x: 0, y: 0, visible: false, depth };
    return {
      x: dx / ((1 + depth) * k),
      y: dy / ((1 + depth) * k),
      visible: true,
      depth,
    };
  };
  const unproject = (x: number, y: number): Vec3 | null => {
    const radius = Math.hypot(x, y);
    if (!Number.isFinite(radius) || (dome && radius > 1 + 1e-10)) return null;
    const theta = dome ? (radius * Math.PI) / 2 : 2 * Math.atan(radius * k);
    const scale = radius < 1e-12 ? 0 : Math.sin(theta) / radius;
    return norm(
      forward.map(
        (v, i) => v * Math.cos(theta) + (right[i] * x + up[i] * y) * scale,
      ) as Vec3,
    );
  };
  /** Scanline intervals BELOW the geometric horizon, in projection coordinates.
   * The inverse stereographic ray's vertical numerator is a quadratic in x.
   * This gives an exact hemisphere mask without a per-pixel spherical transform.
   */
  const groundSpans = (
    y: number,
    left: number,
    rightEdge: number,
  ): [number, number][] => {
    const A = -forward[2] * k * k;
    const B = 2 * k * right[2];
    const C = forward[2] * (1 - k * k * y * y) + 2 * k * up[2] * y;
    const cuts = [left, rightEdge];
    if (Math.abs(A) < 1e-12) {
      if (Math.abs(B) > 1e-12) cuts.push(-C / B);
    } else {
      const discriminant = B * B - 4 * A * C;
      if (discriminant >= 0) {
        const root = Math.sqrt(discriminant);
        // Stable quadratic roots even when one lies far outside the viewport.
        const q = -0.5 * (B + (B >= 0 ? root : -root));
        if (Math.abs(q) > 1e-15) cuts.push(q / A, C / q);
        else cuts.push(-B / (2 * A));
      }
    }
    const sorted = cuts
      .filter((x) => x >= left && x <= rightEdge)
      .sort((a, b) => a - b);
    const spans: [number, number][] = [];
    for (let i = 1; i < sorted.length; i++) {
      const x = (sorted[i - 1] + sorted[i]) / 2;
      if (A * x * x + B * x + C < 0) spans.push([sorted[i - 1], sorted[i]]);
    }
    return spans;
  };
  return { project, unproject, groundSpans };
}

/** x,y use a vertical half-height of one; rectangular clipping belongs to the view. */
export function projectAzAlt(az: number, alt: number, look: Look) {
  return createSkyProjector(look).project(az, alt);
}

function rotated(v: Vec3, axis: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle),
    s = Math.sin(angle),
    cv = cross(axis, v),
    d = dot(axis, v);
  return v.map((n, i) => n * c + cv[i] * s + axis[i] * d * (1 - c)) as Vec3;
}

/** Rotate the camera so a sky direction stays under a chosen projection point. */
function anchorLook(look: Look, target: Vec3, x: number, y: number): Look {
  const ray = createSkyProjector(look).unproject(x, y);
  if (!ray) return look;
  const axis = cross(ray, target),
    sin = Math.hypot(...axis);
  if (sin < 1e-12) return look;
  const unit = axis.map((v) => v / sin) as Vec3,
    angle = Math.atan2(sin, dot(ray, target));
  const basis = lookBasis(look);
  const forward = norm(rotated(basis.forward, unit, angle));
  const right = norm(rotated(basis.right, unit, angle));
  const alt = Math.atan2(forward[2], Math.hypot(forward[0], forward[1])) / DEG;
  const az =
    Math.hypot(forward[0], forward[1]) < 1e-10
      ? look.az
      : (Math.atan2(forward[0], forward[1]) / DEG + 360) % 360;
  const base = lookBasis({ az, alt, fov: look.fov });
  const roll = Math.atan2(dot(right, base.up), dot(right, base.right)) / DEG;
  return { ...look, az, alt, roll };
}

/** Grab the sphere itself, using old/new canvas coordinates (y positive upward). */
export function dragLook(
  look: Look,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): Look {
  if (look.projection === "dome") {
    // In the all-sky preset keep the zenith centred; rotate the compass instead.
    if (Math.hypot(fromX, fromY) < 0.05 || Math.hypot(toX, toY) < 0.05)
      return look;
    const angle = (Math.atan2(toY, toX) - Math.atan2(fromY, fromX)) / DEG;
    return { ...look, az: (look.az - angle + 720) % 360 };
  }
  const target = createSkyProjector(look).unproject(fromX, fromY);
  return target ? anchorLook(look, target, toX, toY) : look;
}

export function equatorialToAzAlt(
  ra: number,
  dec: number,
  lat: number,
  lon: number,
  date: Date,
): { az: number; alt: number } {
  const lst = lstHours(date, lon);
  return equatorialToHorizontal(ra, dec, lat, lst);
}

export function projectStar(
  star: SkyStar,
  lat: number,
  lon: number,
  date: Date,
  look: Look,
): { x: number; y: number; az: number; alt: number; visible: boolean } {
  const { az, alt } = equatorialToAzAlt(star.ra, star.dec, lat, lon, date);
  const p = projectAzAlt(az, alt, look);
  return {
    x: p.x,
    y: -p.y, // canvas Y down
    az,
    alt,
    visible: p.visible && alt >= 0,
  };
}

/** Keyboard panning uses the same spherical rotation as pointer dragging. */
export function panLook(
  look: Look,
  dxPx: number,
  dyPx: number,
  viewHeight: number,
): Look {
  const scale = Math.max(60, viewHeight / 2);
  return dragLook(look, 0, 0, dxPx / scale, -dyPx / scale);
}

/** Pointer-centred zoom. Zooming into the dome enters stereographic exploration. */
export function zoomLook(
  look: Look,
  factor: number,
  x = 0,
  y = 0,
  nextX = x,
  nextY = y,
): Look {
  if (!(factor > 0) || !Number.isFinite(factor)) return look;
  if (look.projection === "dome" && factor >= 1) return look;
  const target = createSkyProjector(look).unproject(x, y);
  const next = {
    ...look,
    projection: "stereographic" as const,
    fov: Math.max(8, Math.min(175, look.fov * factor)),
  };
  return target ? anchorLook(next, target, nextX, nextY) : next;
}

export function bvToColor(bv: number | null): string {
  if (bv == null) return "#e8e2d4";
  const t = Math.max(-0.4, Math.min(2.0, bv));
  if (t < 0.0) return "#9bbcff";
  if (t < 0.3) return "#cad7ff";
  if (t < 0.6) return "#f8f7ff";
  if (t < 1.0) return "#ffe9c8";
  if (t < 1.5) return "#ffd2a1";
  return "#ffb984";
}

export function magToRadius(mag: number, scale = 1): number {
  const r = scale * Math.max(0.45, 3.4 * Math.pow(2.512, (1.5 - mag) / 4));
  return Math.min(r, 8);
}
