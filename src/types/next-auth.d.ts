import type { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id: string;
      isAdmin: boolean;
      phone?: string | null;
      authMethod?: "google" | "otp";
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    authMethod?: "google" | "otp";
  }
}
