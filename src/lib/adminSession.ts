import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "geo_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "development" && process.env.ADMIN_PASSWORD) {
    return `dev-session:${process.env.ADMIN_PASSWORD}`;
  }
  return "";
}

export function canIssueAdminSession(): boolean {
  return getSessionSecret().length > 0;
}

/** Stateless signed token: payload HMAC. Verified server-side only. */
export function createAdminSessionToken(): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = Buffer.from(JSON.stringify({ v: 1, exp }), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token: string): boolean {
  const secret = getSessionSecret();
  if (!secret || !token) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expectedSig = createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expectedSig, "utf8");
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp: number };
    if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}
