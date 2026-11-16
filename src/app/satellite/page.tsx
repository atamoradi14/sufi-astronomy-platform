import { pageMetadata } from "@/lib/seo";
import { SatelliteDashboard } from "@/components/satellite/SatelliteDashboard";
export const metadata = pageMetadata(
  "ماهوارهٔ خودت را بساز | Build your own satellite",
  "گوشی اندرویدی را به ماهوارهٔ آزمایشی تبدیل کنید؛ اتصال امن، حسگرهای زنده، دوربین، آسمان و شبیه‌سازی مدار در فانوس خیال.",
  "/satellite",
);
export default function Page() {
  return <SatelliteDashboard />;
}
