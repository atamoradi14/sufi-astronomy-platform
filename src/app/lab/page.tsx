import type { Metadata } from "next";
import { Protected } from "@/components/auth/Protected";
import { LabContent } from "@/components/auth/LabContent";
export const metadata: Metadata = { robots: { index: false, follow: true } };
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <Protected feature="lab">
      <LabContent />
    </Protected>
  );
}
