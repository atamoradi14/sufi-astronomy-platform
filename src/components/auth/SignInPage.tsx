"use client";
import { useEffect } from "react";
import { useSignInDialog, AccessRequired } from "./AuthProvider";
import { useLanguage } from "@/components/language/Language";
export function SignInPage() {
  const open = useSignInDialog();
  const { t } = useLanguage();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const target = query.get("callbackUrl") || "/";
    open(target.startsWith("/") && !target.startsWith("//") ? target : "/");
  }, [open]);
  return (
    <>
      <AccessRequired feature="sign-in" />
      <p
        role="status"
        className="mx-auto max-w-xl text-center text-sm text-[var(--muted)]"
      >
        {t(
          "اگر ورود انجام نشد، دوباره تلاش کنید یا حساب گوگل دیگری انتخاب کنید.",
          "If sign-in was unsuccessful, try again or choose another Google account.",
        )}
      </p>
    </>
  );
}
