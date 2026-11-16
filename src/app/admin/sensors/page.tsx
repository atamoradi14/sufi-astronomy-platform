import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserSession } from "@/lib/auth/session";
import { canUseMobileSensors } from "@/lib/mobile-sensors/access";
import { AccessRequired } from "@/components/auth/AuthProvider";
import { MobileSensors } from "@/components/mobile-sensors/MobileSensors";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title:
    "سنسورهای گوشی و دینامیک سه بعدی لایو | Phone sensors & live 3D dynamics",
  alternates: { canonical: "/admin/sensors" },
  robots: { index: false, follow: false },
};
export default async function Page() {
  const session = await getUserSession();
  if (!session?.user?.id) return <AccessRequired feature="mobile-sensors" />;
  if (!canUseMobileSensors(session.user.email)) notFound();
  return <MobileSensors />;
}
