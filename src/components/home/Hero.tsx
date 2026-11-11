"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, BookOpen, Map } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(201,162,39,0.15), transparent 35%), radial-gradient(circle at 70% 60%, rgba(61,122,122,0.2), transparent 40%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-16">
        <div className="animate-in-fade">
          <p className="ornament mb-3 text-sm text-[var(--teal)]">صور الکواکب الثابتة</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--gold-soft)] md:text-6xl md:leading-[1.15]">
            صوفی‌آسمان
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[var(--parchment)]/90 md:text-lg">
            آموزش زندهٔ ریاضیات کروی، رصد، زمان نجومی و قبله — با حسگرهای گوشی، نقشهٔ ماهواره‌ای و میراث عبدالرحمن صوفی.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/learn">
                <BookOpen className="h-4 w-4" />
                شروع آموزش
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/compass">
                <Compass className="h-4 w-4" />
                قطب‌نما و قبله
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/map">
                <Map className="h-4 w-4" />
                نقشه و دایره‌ها
              </Link>
            </Button>
          </div>
        </div>

        <div className="animate-in-fade animate-delay-1 relative aspect-square max-h-[420px] w-full justify-self-center">
          <SufiSkyWheel />
        </div>
      </div>
    </section>
  );
}

function SufiSkyWheel() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full drop-shadow-2xl" aria-hidden>
      <defs>
        <radialGradient id="disk" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#1c3148" />
          <stop offset="70%" stopColor="#101c30" />
          <stop offset="100%" stopColor="#070d18" />
        </radialGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6d39a" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8a7020" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="188" fill="url(#disk)" stroke="url(#rim)" strokeWidth="3" className="compass-ring" />
      <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(201,162,39,0.25)" strokeWidth="1" />
      <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(91,124,153,0.35)" strokeWidth="1" strokeDasharray="4 6" />
      <ellipse cx="200" cy="200" rx="140" ry="48" fill="none" stroke="rgba(61,122,122,0.55)" strokeWidth="1.5" transform="rotate(-18 200 200)" />
      <ellipse cx="200" cy="200" rx="140" ry="48" fill="none" stroke="rgba(201,162,39,0.35)" strokeWidth="1" transform="rotate(42 200 200)" />
      {[
        [200, 70],
        [280, 110],
        [310, 200],
        [250, 290],
        [150, 300],
        [90, 210],
        [120, 120],
        [220, 150],
        [170, 180],
        [240, 220],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 === 0 ? 2.8 : 1.6}
          fill={i % 2 === 0 ? "#e6d39a" : "#e8e2d4"}
          className="twinkle"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
      <path
        d="M130 150 L165 140 L200 155 L235 135 L270 150"
        fill="none"
        stroke="rgba(230,211,154,0.55)"
        strokeWidth="1.2"
      />
      <text
        x="200"
        y="205"
        textAnchor="middle"
        fill="#e6d39a"
        fontSize="22"
        fontFamily="var(--font-display), serif"
      >
        عبدالرحمن صوفی
      </text>
      <text
        x="200"
        y="232"
        textAnchor="middle"
        fill="#9aa6b8"
        fontSize="11"
        fontFamily="var(--font-body), sans-serif"
      >
        کتاب صور الکواکب
      </text>
    </svg>
  );
}
