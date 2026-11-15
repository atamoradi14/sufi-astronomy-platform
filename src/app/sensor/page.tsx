import type { Metadata } from "next";
import { Protected } from "@/components/auth/Protected";
import { SensorContent } from "@/components/auth/SensorContent";
export const metadata: Metadata = { robots: { index: false, follow: true } };
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <Protected feature="sensor">
      <SensorContent />
    </Protected>
  );
}
