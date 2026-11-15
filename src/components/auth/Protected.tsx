import type { ReactNode } from "react";
import { getUserSession } from "@/lib/auth/session";
import { AccessRequired } from "./AuthProvider";
export async function Protected({
  children,
  feature,
}: {
  children: ReactNode;
  feature: string;
}) {
  const session = await getUserSession();
  return session?.user?.id ? children : <AccessRequired feature={feature} />;
}
