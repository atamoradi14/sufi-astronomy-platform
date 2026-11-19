import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  findUser,
  recordEmailOtpLogin,
  recordGoogleLogin,
  recordPhoneOtpLogin,
} from "./store";
import { verifyOtp } from "./otp";
import { emailConfigured, smsConfigured } from "./otp-senders";
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
export function otpChannels() {
  return {
    email: !!process.env.NEXTAUTH_SECRET && emailConfigured(),
    phone: !!process.env.NEXTAUTH_SECRET && smsConfigured(),
  };
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
    // One-time codes by email (Azure Communication Services) or SMS (Ravand SMS relay).
    // Codes are requested through /api/auth/otp/request and checked here.
    CredentialsProvider({
      id: "otp",
      name: "One-time code",
      credentials: {
        channel: { type: "text" },
        target: { type: "text" },
        code: { type: "text" },
      },
      async authorize(credentials) {
        const channel = credentials?.channel;
        if (channel !== "email" && channel !== "phone") return null;
        if (!otpChannels()[channel]) return null;
        const target = verifyOtp(channel, credentials?.target, credentials?.code);
        if (!target) return null;
        const user =
          channel === "email"
            ? recordEmailOtpLogin(target)
            : recordPhoneOtpLogin(target);
        return { id: user.id, email: user.email || null, name: user.name };
      },
    }),
  ],
  pages: { signIn: "/sign-in", error: "/sign-in" },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "otp") return !!user?.id;
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
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "otp" && user?.id) {
        token.userId = user.id;
        token.authMethod = "otp";
        return token;
      }
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
        const record = recordGoogleLogin(google);
        token.userId = record.id;
        token.authMethod = "google";
      }
      return token;
    },
    async session({ session, token }) {
      const user =
        typeof token.userId === "string" ? findUser(token.userId) : undefined;
      if (session.user && user) {
        session.user.id = user.id;
        session.user.email = user.email || null;
        session.user.name = user.name;
        session.user.image = user.image;
        session.user.phone = user.phone;
        session.user.authMethod = token.authMethod === "otp" ? "otp" : "google";
        // Administration stays tied to a Google sign-in; a one-time code alone never grants it.
        session.user.isAdmin =
          session.user.authMethod === "google" && isAdminEmail(user.email);
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
