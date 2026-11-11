"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Box, PenLine } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="hero-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 md:grid-cols-[1.15fr_0.85fr] md:items-center md:pt-16">
        <div className="animate-in-fade">
          <p className="ornament mb-3 text-sm tracking-wide text-[var(--teal)]">
            المپیاد نجوم · رصد آماتوری · Smart
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.2] text-[var(--gold-soft)] md:text-6xl">
            صوفی‌آسمان
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--parchment)]/90 md:text-lg">
            آزمایشگاه سه‌بعدی کره، اثبات سینوس و کسینوس کروی، و درس‌نامهٔ المپیادی — به زبان فارسی، با میراث عبدالرحمن صوفی.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/lab">
                <Box className="h-4 w-4" />
                کرهٔ تعاملی
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/proofs">
                <PenLine className="h-4 w-4" />
                اثبات‌ها
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/learn">
                <BookOpen className="h-4 w-4" />
                درس‌نامه
              </Link>
            </Button>
          </div>
        </div>

        <div className="animate-in-fade animate-delay-1 relative aspect-[4/3] w-full justify-self-center">
          <HeroSphereArt />
        </div>
      </div>
    </section>
  );
}

function HeroSphereArt() {
  return (
    <svg viewBox="0 0 420 320" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="hg" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#1a2a44" />
          <stop offset="100%" stopColor="#070d18" />
        </radialGradient>
        <linearGradient id="rim2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6d39a" />
          <stop offset="100%" stopColor="#8a7020" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="160" rx="150" ry="150" fill="url(#hg)" stroke="url(#rim2)" strokeWidth="2.5" />
      {/* great circle equator */}
      <ellipse cx="210" cy="160" rx="148" ry="42" fill="none" stroke="#c9a227" strokeWidth="2" />
      {/* great meridian */}
      <ellipse cx="210" cy="160" rx="55" ry="148" fill="none" stroke="#5b7c99" strokeWidth="1.5" />
      {/* small circle / parallel */}
      <ellipse cx="210" cy="100" rx="110" ry="22" fill="none" stroke="#3d7a7a" strokeWidth="1.75" strokeDasharray="5 5" />
      {/* spherical triangle */}
      <path
        d="M210 28 L320 190 L120 175 Z"
        fill="rgba(201,162,39,0.08)"
        stroke="#e6d39a"
        strokeWidth="1.8"
      />
      <circle cx="210" cy="28" r="4" fill="#e6d39a" className="twinkle" />
      <circle cx="320" cy="190" r="4" fill="#e6d39a" />
      <circle cx="120" cy="175" r="4" fill="#e6d39a" />
      <text x="218" y="26" fill="#e6d39a" fontSize="12" fontFamily="var(--font-display), serif">
        A
      </text>
      <text x="328" y="194" fill="#e6d39a" fontSize="12">
        B
      </text>
      <text x="100" y="180" fill="#e6d39a" fontSize="12">
        C
      </text>
      <text
        x="210"
        y="300"
        textAnchor="middle"
        fill="#9aa6b8"
        fontSize="11"
        fontFamily="var(--font-body), sans-serif"
      >
        عظیمه · صغیره · مثلث کروی
      </text>
    </svg>
  );
}
