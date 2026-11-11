import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPersianDigits(value: string | number): string {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/\d/g, (d) => map[Number(d)]);
}

export function formatDeg(deg: number, decimals = 1): string {
  const sign = deg < 0 ? "−" : "";
  return `${sign}${toPersianDigits(Math.abs(deg).toFixed(decimals))}°`;
}

export function formatHours(hours: number, decimals = 2): string {
  const h = ((hours % 24) + 24) % 24;
  return `${toPersianDigits(h.toFixed(decimals))}ʰ`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
