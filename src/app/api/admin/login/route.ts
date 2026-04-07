import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  canIssueAdminSession,
  createAdminSessionToken,
} from "@/lib/adminSession";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX = 10;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`admin:login:${ip}`, LOGIN_MAX, LOGIN_WINDOW_MS)) {
    return NextResponse.json(
      { authenticated: false, error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD is not configured in environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (!canIssueAdminSession()) {
      console.error("ADMIN_SESSION_SECRET is not configured (min 16 chars) or dev fallback unavailable");
      return NextResponse.json(
        { error: "Server configuration error: session signing not configured" },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      const token = createAdminSessionToken();
      if (!token) {
        return NextResponse.json({ error: "Could not create session" }, { status: 500 });
      }
      const res = NextResponse.json({ authenticated: true });
      res.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());
      return res;
    }

    return NextResponse.json(
      { authenticated: false, error: "Incorrect passphrase" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
