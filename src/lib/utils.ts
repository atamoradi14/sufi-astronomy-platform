import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DigitScript = "en" | "fa";

let digitScript: DigitScript = "en";
const digitListeners = new Set<() => void>();

export function getDigitScript(): DigitScript {
  return digitScript;
}

export function subscribeDigitScript(listener: () => void): () => void {
  digitListeners.add(listener);
  return () => digitListeners.delete(listener);
}

export function setDigitScript(next: DigitScript) {
  if (next === digitScript) return;
  digitScript = next;
  if (typeof window !== "undefined") window.localStorage.setItem("sufi-digits", next);
  digitListeners.forEach((listener) => listener());
}

/** Read a saved preference after mount. Server and first paint stay English. */
export function initDigitScriptFromStorage() {
  if (typeof window === "undefined") return;
  const saved = window.localStorage.getItem("sufi-digits");
  if (saved === "en" || saved === "fa") setDigitScript(saved);
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Digits follow the site toggle. Default is English (0-9). */
export function localizeDigits(value: string | number): string {
  const text = String(value);
  if (digitScript !== "fa") return text;
  return text.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
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
