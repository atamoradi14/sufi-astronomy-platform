import { createHmac, timingSafeEqual } from "node:crypto";
export type Claims = {
  aud: "control" | "device";
  sub: string;
  exp: number;
  email?: string;
  owner?: string;
  version?: number;
};
export function signClaims(claims: Claims, secret: string) {
  const body = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return (
    body +
    "." +
    createHmac("sha256", secret)
      .update("satellite-v1." + body)
      .digest("base64url")
  );
}
export function verifyClaims(
  token: string,
  secret: string,
  audience: Claims["aud"],
): Claims | null {
  if (typeof token !== "string" || token.length > 4096) return null;
  const [body, signature, ...extra] = token.split(".");
  if (!body || !signature || extra.length) return null;
  const expected = createHmac("sha256", secret)
      .update("satellite-v1." + body)
      .digest(),
    actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return null;
  try {
    const c = JSON.parse(Buffer.from(body, "base64url").toString()) as Claims;
    if (
      c.aud !== audience ||
      typeof c.sub !== "string" ||
      !c.sub ||
      !Number.isFinite(c.exp) ||
      c.exp <= Date.now() / 1000
    )
      return null;
    return c;
  } catch {
    return null;
  }
}
