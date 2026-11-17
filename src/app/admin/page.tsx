import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserSession } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/options";
import { AccessRequired } from "@/components/auth/AuthProvider";
import { AdminUsers } from "@/components/auth/AdminUsers";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "مدیریت کاربران",
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false },
};
export default async function Page() {
  const session = await getUserSession();
  if (!session?.user?.id) return <AccessRequired feature="admin" />;
  if (!isAdminEmail(session.user.email)) notFound();
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <a
          className="underline text-[var(--gold-soft)]"
          href="/satellite#satellite-plans"
        >
          مدیریت طرح‌ها و قیمت ماهواره · Satellite plans & pricing
        </a>
      </div>
      <AdminUsers />
    </>
  );
}
