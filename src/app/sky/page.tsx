"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
const LiveSky = dynamic(
  () => import("@/components/sky/LiveSky").then((m) => m.LiveSky),
  {
    ssr: false,
    loading: () => (
      <p className="p-8 text-[var(--muted)]">بارگذاری آسمان‌نما…</p>
    ),
  },
);
import { ConstellationViewer } from "@/components/sky/ConstellationViewer";
import { Button } from "@/components/ui/button";

export default function SkyPage() {
  const [tab, setTab] = useState<"live" | "sufi">("live");

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header className="space-y-3">
        <p className="text-sm text-[var(--teal)]">
          رصدخانهٔ تعاملی · کرهٔ سماوی و میراث صوفی
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          آسمان‌نما
        </h1>
        <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
          مکان و زمان را تنظیم کنید، آسمان را بچرخانید و ستاره‌ها را انتخاب
          کنید. جهت‌ها و ارتفاع‌ها هندسی‌اند؛ کاتالوگ تا قدر ۷ و خطوط صورت‌های
          فلکی در دسترس است. نگاره‌های صور الکواکب در زبانهٔ صوفی و صفحهٔ{" "}
          <a
            href="/atlas"
            className="text-[var(--teal)] hover:text-[var(--gold-soft)]"
          >
            اطلس کامل
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={tab === "live" ? "default" : "secondary"}
            onClick={() => setTab("live")}
          >
            آسمان زنده
          </Button>
          <Button
            size="sm"
            variant={tab === "sufi" ? "default" : "secondary"}
            onClick={() => setTab("sufi")}
          >
            صور صوفی
          </Button>
        </div>
      </header>
      {tab === "live" ? <LiveSky /> : <ConstellationViewer />}
    </div>
  );
}
