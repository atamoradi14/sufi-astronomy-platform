"use client";

import { useMemo, useState } from "react";
import { PROBLEMS } from "@/lib/content/problems";
import { COURSES } from "@/lib/content/courses";
import { SolutionSphere } from "@/components/problems/SolutionSphere";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/utils";

export function ProblemList() {
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const list = useMemo(() => {
    if (filter === "all") return PROBLEMS;
    return PROBLEMS.filter((p) => p.lessonId === filter);
  }, [filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          همه
        </FilterChip>
        {COURSES.map((l) => (
          <FilterChip
            key={l.id}
            active={filter === l.id}
            onClick={() => setFilter(l.id)}
          >
            {l.titleFa}
          </FilterChip>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((p, idx) => {
          const open = openId === p.id;
          return (
            <Card key={p.id}>
              <CardHeader className="cursor-pointer" onClick={() => setOpenId(open ? null : p.id)}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">
                      {toPersianDigits(idx + 1)}. {p.title}
                    </CardTitle>
                    <CardDescription className="mt-1">{p.prompt}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--gold-soft)]">
                      {p.difficulty}
                    </span>
                    <span className="max-w-[12rem] text-left text-[10px] text-[var(--muted)] dir-ltr">
                      {p.source}
                    </span>
                  </div>
                </div>
              </CardHeader>
              {open && (
                <CardContent className="space-y-3 border-t border-[var(--border)] pt-4">
                  <SolutionSphere mode={p.diagram} values={p.values} />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowHint((s) => ({ ...s, [p.id]: !s[p.id] }))}
                    >
                      {showHint[p.id] ? "پنهان کردن راهنما" : "نمایش راهنما"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setShowSolution((s) => ({ ...s, [p.id]: !s[p.id] }))
                      }
                    >
                      {showSolution[p.id] ? "پنهان کردن پاسخ" : "نمایش راه‌حل"}
                    </Button>
                  </div>
                  {showHint[p.id] && (
                    <div className="rounded-lg border border-[var(--teal)]/40 bg-[var(--teal)]/10 px-3 py-2 text-sm leading-7">
                      <strong className="text-[var(--gold-soft)]">راهنما: </strong>
                      {p.hint}
                    </div>
                  )}
                  {showSolution[p.id] && (
                    <div className="space-y-2 rounded-lg border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-3 py-3 text-sm leading-7">
                      <p>{p.solution}</p>
                      <p className="text-[var(--gold-soft)]">پاسخ نهایی: {p.answer}</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold-soft)]"
          : "border-[var(--border)] text-[var(--muted)]"
      }`}
    >
      {children}
    </button>
  );
}
