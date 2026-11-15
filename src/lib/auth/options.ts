import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findUser, recordGoogleLogin } from "./store";
export function isAdminEmail(email?: string | null) {
  return (
    !!email &&
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean)
      .includes(email.toLowerCase())
  );
}
export function googleConfigured() {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.NEXTAUTH_SECRET
  );
}
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      checks: ["pkce", "state"],
      authorization: {
        params: { scope: "openid email profile", prompt: "select_account" },
      },
    }),
  ],
  pages: { signIn: "/sign-in", error: "/sign-in" },
  callbacks: {
    async signIn({ account, profile }) {
      const google = profile as
        { email_verified?: boolean; sub?: string; email?: string } | undefined;
      return (
        googleConfigured() &&
        account?.provider === "google" &&
        google?.email_verified === true &&
        !!google.sub &&
        !!google.email
      );
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile) {
        const google = profile as {
          sub: string;
          email: string;
          name?: string;
          picture?: string;
          email_verified?: boolean;
        };
        if (google.email_verified !== true)
          throw new Error("Verified Google identity required");
        const user = recordGoogleLogin(google);
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      const user =
        typeof token.userId === "string" ? findUser(token.userId) : undefined;
      if (session.user && user) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.name = user.name;
        session.user.image = user.image;
        session.user.isAdmin = isAdminEmail(user.email);
      } else {
        session.user = undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        const target = new URL(url, baseUrl);
        return target.origin === new URL(baseUrl).origin
          ? target.href
          : baseUrl;
      } catch {
        return baseUrl;
      }
    },
  },
};
