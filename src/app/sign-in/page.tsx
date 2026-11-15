import type { Metadata } from "next";
import { SignInPage } from "@/components/auth/SignInPage";
export const metadata: Metadata = {
  title: "ورود به فانوس خیال",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <SignInPage />;
}
