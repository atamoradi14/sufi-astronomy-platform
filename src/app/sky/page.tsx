"use client";

import { useState } from "react";
import { LiveSky } from "@/components/sky/LiveSky";
import { ConstellationViewer } from "@/components/sky/ConstellationViewer";
import { Button } from "@/components/ui/button";

export default function SkyPage() {
  const [tab, setTab] = useState<"live" | "sufi">("live");

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header className="space-y-3">
        <p className="text-sm text-[var(--teal)]">آسمان زنده · Stellarium-style · صور صوفی</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          آسمان‌نما
        </h1>
        <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
          نمای تعاملی به سبک Stellarium: بکشید تا بچرخید، اسکرول برای زوم، کلیک برای انتخاب ستاره — بیش از ۱۵ هزار ستاره تا قدر ۷ و خطوط IAU، به‌همراه اطلس صوفی.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={tab === "live" ? "default" : "secondary"} onClick={() => setTab("live")}>
            آسمان زنده (IAU)
          </Button>
          <Button size="sm" variant={tab === "sufi" ? "default" : "secondary"} onClick={() => setTab("sufi")}>
            اطلس صوفی
          </Button>
        </div>
      </header>
      {tab === "live" ? <LiveSky /> : <ConstellationViewer />}
    </div>
  );
}
