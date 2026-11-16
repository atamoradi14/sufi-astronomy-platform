"use client";
import { useCallback, useEffect, useState } from "react";
import {
  fromOrientation,
  HeadingFilter,
  SourceLock,
  topHeading,
  wrap,
} from "@/lib/mobile-sensors/math";
export type CompassState = {
  heading: number | null;
  continuousHeading: number | null;
  absolute: boolean;
  error: string | null;
  needsPermission: boolean;
  requestPermission: () => Promise<void>;
};
export function useCompass(): CompassState {
  const [allowed, setAllowed] = useState(true);
  const [state, setState] = useState<Omit<CompassState, "requestPermission">>({
    heading: null,
    continuousHeading: null,
    absolute: false,
    error: null,
    needsPermission: false,
  });
  const requestPermission = useCallback(async () => {
    const ctor =
      window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: (absolute?: boolean) => Promise<string>;
      };
    try {
      if (
        ctor?.requestPermission &&
        (await ctor.requestPermission(true)) !== "granted"
      )
        throw new Error("denied");
      setAllowed(true);
      setState((s) => ({ ...s, needsPermission: false, error: null }));
    } catch {
      setState((s) => ({
        ...s,
        error: "مجوز حسگر داده نشد / Sensor permission denied",
      }));
    }
  }, []);
  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      setState((s) => ({
        ...s,
        error: "حسگر پشتیبانی نمی‌شود / Orientation unavailable",
      }));
      return;
    }
    const ctor =
      window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: unknown;
      };
    if (ctor.requestPermission) {
      setAllowed(false);
      setState((s) => ({ ...s, needsPermission: true }));
    }
  }, []);
  useEffect(() => {
    let filter = new HeadingFilter(),
      lock = new SourceLock(),
      last = 0,
      lastAbsolute = false;
    const handler = (event: DeviceOrientationEvent) => {
      if (!allowed || document.hidden) return;
      const now = performance.now(),
        e = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
      const webkit = Number.isFinite(e.webkitCompassHeading),
        absolute =
          webkit || e.absolute || e.type === "deviceorientationabsolute";
      const priority = webkit
        ? 4
        : e.type === "deviceorientationabsolute"
          ? 3
          : absolute
            ? 2
            : 1;
      const source = webkit
        ? "webkit"
        : e.type + (absolute ? ":absolute" : ":relative");
      let value: number | null = null;
      if (webkit) value = wrap(e.webkitCompassHeading!);
      else if (
        e.alpha !== null &&
        e.beta !== null &&
        e.gamma !== null &&
        [e.alpha, e.beta, e.gamma].every(Number.isFinite)
      )
        value = topHeading(
          fromOrientation(e.alpha, e.beta, e.gamma),
          screen.orientation?.angle ?? 0,
        );
      if (value === null || !lock.accept(source, priority, now)) return;
      if (absolute !== lastAbsolute) filter = new HeadingFilter();
      lastAbsolute = absolute;
      const continuousHeading = filter.update(value, (now - last) / 1000);
      last = now;
      setState((s) => ({
        ...s,
        heading: wrap(continuousHeading),
        continuousHeading,
        absolute,
        error: null,
      }));
    };
    const stale = setInterval(() => {
      if (last && performance.now() - last > 2500)
        setState((s) => ({
          ...s,
          heading: null,
          continuousHeading: null,
          error: "دادهٔ تازه نداریم / Waiting for fresh sensor data",
        }));
    }, 1000);
    const visibility = () => {
      filter = new HeadingFilter();
      lock = new SourceLock();
      last = 0;
      setState((s) => ({ ...s, heading: null, continuousHeading: null }));
    };
    window.addEventListener(
      "deviceorientationabsolute",
      handler as EventListener,
    );
    window.addEventListener("deviceorientation", handler);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clearInterval(stale);
      window.removeEventListener(
        "deviceorientationabsolute",
        handler as EventListener,
      );
      window.removeEventListener("deviceorientation", handler);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [allowed]);
  return { ...state, requestPermission };
}
