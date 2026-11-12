"use client";

import { useEffect, useState } from "react";

export type CompassState = {
  heading: number | null;
  absolute: boolean;
  error: string | null;
  needsPermission: boolean;
  requestPermission: () => Promise<void>;
};

function normalize(deg: number) {
  return ((deg % 360) + 360) % 360;
}

export function useCompass(): CompassState {
  const [heading, setHeading] = useState<number | null>(null);
  const [absolute, setAbsolute] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsPermission, setNeedsPermission] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const Doe = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    if (typeof Doe.requestPermission === "function") {
      setNeedsPermission(true);
    }

    const handler = (event: DeviceOrientationEvent) => {
      const e = event as DeviceOrientationEvent & {
        webkitCompassHeading?: number;
        absolute?: boolean;
      };
      if (typeof e.webkitCompassHeading === "number") {
        setHeading(normalize(e.webkitCompassHeading));
        setAbsolute(true);
        setError(null);
        return;
      }
      if (e.alpha == null) {
        setError("دادهٔ جهت‌گیری در دسترس نیست — دستگاه را حرکت دهید یا از شبیه‌ساز استفاده کنید.");
        return;
      }
      // alpha: rotation around z; for absolute orientation, 0 ≈ north
      const abs = Boolean(e.absolute);
      setAbsolute(abs);
      setHeading(normalize(abs ? 360 - e.alpha : e.alpha));
      setError(null);
    };

    window.addEventListener("deviceorientationabsolute", handler as EventListener, true);
    window.addEventListener("deviceorientation", handler as EventListener, true);
    return () => {
      window.removeEventListener("deviceorientationabsolute", handler as EventListener, true);
      window.removeEventListener("deviceorientation", handler as EventListener, true);
    };
  }, []);

  const requestPermission = async () => {
    try {
      const Doe = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (typeof Doe.requestPermission === "function") {
        const result = await Doe.requestPermission();
        if (result !== "granted") {
          setError("مجوز حسگر جهت‌گیری داده نشد.");
        } else {
          setNeedsPermission(false);
          setError(null);
        }
      }
    } catch {
      setError("درخواست مجوز قطب‌نما ناموفق بود.");
    }
  };

  return { heading, absolute, error, needsPermission, requestPermission };
}
