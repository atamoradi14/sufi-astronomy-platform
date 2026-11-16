"use client";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const DARK_ROUTES = [
  "/sky",
  "/lab",
  "/sensor",
  "/charts",
  "/map",
  "/compass",
  "/admin",
];
export function SiteFrame({ children }: { children: ReactNode }) {
  const path = usePathname();
  const observing = DARK_ROUTES.some(
    (route) => path === route || path.startsWith(route + "/"),
  );
  useEffect(() => {
    document.documentElement.style.colorScheme = observing ? "dark" : "light";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", observing ? "#0b1723" : "#f6f3ec");
  }, [observing]);
  return (
    <div
      className="app-shell flex min-h-dvh flex-col"
      data-theme={observing ? "observatory" : "editorial"}
    >
      {children}
    </div>
  );
}
