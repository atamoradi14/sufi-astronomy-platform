"use client";

import { useCallback, useEffect, useState } from "react";

export type GeoReading = {
  lat: number;
  lon: number;
  accuracy: number | null;
  altitude: number | null;
  speed: number | null; // m/s
  heading: number | null; // degrees
  timestamp: number;
};

export type GeoState = {
  reading: GeoReading | null;
  error: string | null;
  loading: boolean;
  supported: boolean;
};

const FALLBACK: GeoReading = {
  lat: 35.6892,
  lon: 51.389,
  accuracy: null,
  altitude: null,
  speed: null,
  heading: null,
  timestamp: Date.now(),
};

export function useGeolocation(watch = true) {
  const [state, setState] = useState<GeoState>({
    reading: null,
    error: null,
    loading: true,
    supported: typeof navigator !== "undefined" && "geolocation" in navigator,
  });

  const applyPosition = useCallback((pos: GeolocationPosition) => {
    setState({
      reading: {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        altitude: pos.coords.altitude,
        speed: pos.coords.speed,
        heading: pos.coords.heading,
        timestamp: pos.timestamp,
      },
      error: null,
      loading: false,
      supported: true,
    });
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setState({
        reading: FALLBACK,
        error: "موقعیت‌یابی در این دستگاه پشتیبانی نمی‌شود — نمایش نمونهٔ تهران.",
        loading: false,
        supported: false,
      });
      return;
    }

    const onError = (err: GeolocationPositionError) => {
      setState((prev) => ({
        reading: prev.reading ?? FALLBACK,
        error:
          err.code === err.PERMISSION_DENIED
            ? "دسترسی موقعیت رد شد — از مختصات نمونهٔ تهران استفاده می‌شود."
            : "خطا در خواندن GPS — مختصات نمونه فعال است.",
        loading: false,
        supported: true,
      }));
    };

    const opts: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 15000,
    };

    if (!watch) {
      navigator.geolocation.getCurrentPosition(applyPosition, onError, opts);
      return;
    }

    const id = navigator.geolocation.watchPosition(applyPosition, onError, opts);
    return () => navigator.geolocation.clearWatch(id);
  }, [watch, applyPosition]);

  return state;
}
