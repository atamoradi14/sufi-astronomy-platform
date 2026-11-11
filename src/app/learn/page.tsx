import { LESSONS } from "@/lib/content/lessons";
import { SphereDemo } from "@/components/learn/SphereDemo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <header className="animate-in-fade">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          آموزش ریاضیات کروی
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-8 text-[var(--muted)]">
          مفاهیم پایه تا مثلث نجومی، با آزمایشگاه تعاملی برای فاصلهٔ زاویه‌ای و تبدیل مختصات استوایی به افقی.
        </p>
      </header>

      <SphereDemo />

      <div className="space-y-4">
        {LESSONS.map((lesson) => (
          <Card key={lesson.id} id={lesson.id}>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 prose-fa">
              {lesson.sections.map((s) => (
                <div key={s.heading}>
                  <h3 className="text-[var(--gold-soft)] font-medium">{s.heading}</h3>
                  <p className="mt-1 text-sm text-[var(--parchment)]/90">{s.body}</p>
                  {s.formula && (
                    <p className="mt-2 rounded-md border border-[var(--border)] bg-[var(--ink)]/50 px-3 py-2 font-mono text-xs text-[var(--teal)] dir-ltr text-left">
                      {s.formula}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
