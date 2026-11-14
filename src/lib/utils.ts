import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type { DigitScript } from "./digits";
import { formatDigits, type DigitScript } from "./digits";

let digitScript: DigitScript = "en";
const digitListeners = new Set<() => void>();

export function getDigitScript(): DigitScript {
  return digitScript;
}

export function subscribeDigitScript(listener: () => void): () => void {
  digitListeners.add(listener);
  return () => digitListeners.delete(listener);
}

export function setDigitScript(next: DigitScript, persist = true) {
  if (next === digitScript) return;
  digitScript = next;
  if (persist && typeof window !== "undefined") {
    try {
      window.localStorage.setItem("sufi-digits", next);
    } catch {
      /* In-session preference still works. */
    }
  }
  digitListeners.forEach((listener) => listener());
}

/** Read a saved preference after mount. Server and first paint stay English. */
export function initDigitScriptFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const saved = window.localStorage.getItem("sufi-digits");
    if (saved === "en" || saved === "fa") setDigitScript(saved, false);
  } catch {
    /* Storage may be disabled by the browser. */
  }
}

/** Presentation follows the site toggle and normalises both digit scripts. */
export function localizeDigits(value: string | number): string {
  return formatDigits(value, digitScript);
}

export function toPersianDigits(value: string | number): string {
  return localizeDigits(value);
}

export function formatDeg(deg: number, decimals = 1): string {
  const sign = deg < 0 ? "-" : "";
  return `${sign}${localizeDigits(Math.abs(deg).toFixed(decimals))}°`;
}

export function formatLat(deg: number, decimals = 4): string {
  const hemi = deg >= 0 ? "N" : "S";
  return `${localizeDigits(Math.abs(deg).toFixed(decimals))}° ${hemi}`;
}

export function formatLon(deg: number, decimals = 4): string {
  const wrapped = ((((deg + 180) % 360) + 360) % 360) - 180;
  const hemi = wrapped >= 0 ? "E" : "W";
  return `${localizeDigits(Math.abs(wrapped).toFixed(decimals))}° ${hemi}`;
}

export function formatHours(hours: number, decimals = 2): string {
  const h = ((hours % 24) + 24) % 24;
  return `${localizeDigits(h.toFixed(decimals))}h`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
