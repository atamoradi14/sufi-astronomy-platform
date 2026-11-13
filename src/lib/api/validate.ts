export function finiteNumber(n: number): boolean {
  return typeof n === "number" && Number.isFinite(n);
}

export function inRange(n: number, lo: number, hi: number): boolean {
  return finiteNumber(n) && n >= lo && n <= hi;
}

export function parseIso(iso: string | null): Date | null {
  if (!iso) return new Date();
  if (iso.length > 40) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}
