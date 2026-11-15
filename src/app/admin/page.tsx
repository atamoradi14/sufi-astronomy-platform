import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserSession } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/options";
import { AccessRequired } from "@/components/auth/AuthProvider";
import { AdminUsers } from "@/components/auth/AdminUsers";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "مدیریت کاربران",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const session = await getUserSession();
  if (!session?.user?.id) return <AccessRequired feature="admin" />;
  if (!isAdminEmail(session.user.email)) notFound();
  return <AdminUsers />;
}
