import type { ReactNode } from "react";
export function SiteFrame({ children }: { children: ReactNode }) {
  return <div className="app-shell flex min-h-dvh flex-col">{children}</div>;
}
