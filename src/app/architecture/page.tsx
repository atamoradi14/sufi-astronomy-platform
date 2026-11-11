import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SERVICES = [
  {
    name: "web-gateway",
    desc: "Next.js BFF / لبهٔ کاربری فارسی؛ امروز کل UI، فردا فقط پوسته و تجمیع API.",
  },
  {
    name: "astro-time",
    desc: "روز ژولیوسی، GMST/LST، معادلهٔ زمان، مختصات تقریبی خورشید. مسیر فعلی: /api/astro/clock",
  },
  {
    name: "sphere-math",
    desc: "تبدیل استوایی↔افقی، فاصلهٔ زاویه‌ای، مثلث کروی. مسیر: /api/astro/horizontal",
  },
  {
    name: "qibla",
    desc: "سمت و فاصلهٔ قبله، مسیر دایرهٔ عظیمه. مسیر: /api/geo/qibla",
  },
  {
    name: "catalog",
    desc: "صورت‌های فلکی و ستارگان صوفی. مسیر: /api/catalog/constellations",
  },
  {
    name: "geo-track",
    desc: "اختیاری برای آینده: ذخیرهٔ مسیر حرکت، دایره‌های هم‌فاصلهٔ سمت‌سرور.",
  },
];

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          معماری میکروسرویس
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--muted)]">
          هم‌اکنون منطق دامنه در ماژول‌های جداگانه و Route Handlerها پیاده شده است. پوشهٔ{" "}
          <code className="text-[var(--gold-soft)]">services/</code> و مانیفست‌های{" "}
          <code className="text-[var(--gold-soft)]">deploy/k8s/</code> نقشهٔ استقرار بعدی روی Kubernetes را مشخص می‌کنند.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {SERVICES.map((s) => (
          <Card key={s.name}>
            <CardHeader>
              <CardTitle className="font-mono text-base dir-ltr text-left">{s.name}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>مسیر استقرار Kubernetes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-[var(--parchment)]/90">
          <ol className="list-decimal list-inside space-y-2">
            <li>هر سرویس در <code className="text-[var(--gold-soft)]">services/&lt;name&gt;</code> به یک کانتینر مستقل تبدیل می‌شود.</li>
            <li>Ingress واحد ترافیک را به gateway و APIهای دامنه می‌رساند.</li>
            <li>ConfigMap/Secret برای آدرس کاشی‌های نقشه و هر کلید اختیاری.</li>
            <li>HPA روی gateway و sphere-math برای بار آموزشی همزمان.</li>
            <li>مانیفست‌های نمونه در <code className="text-[var(--gold-soft)]">deploy/k8s/</code> آمادهٔ سفارشی‌سازی‌اند.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
