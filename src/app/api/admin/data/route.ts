import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminSession";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import {
  getCandidates,
  getElections,
  getPastElectionResults,
  getDocuments,
  getNotices,
  getAboutSections,
  getOfficials,
  getCouncilorRoles,
  getAnnouncements,
} from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

const DATA_WINDOW_MS = 60 * 60 * 1000;
const DATA_MAX = 120;

const FETCHERS: Record<string, () => Promise<unknown>> = {
  candidates: getCandidates,
  elections: getElections,
  past_results: getPastElectionResults,
  documents: getDocuments,
  notices: getNotices,
  about: getAboutSections,
  officials: getOfficials,
  councilor_roles: getCouncilorRoles,
  announcements: getAnnouncements,
};

export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`admin:data:${ip}`, DATA_MAX, DATA_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dataType = searchParams.get("type");

  if (!dataType || !FETCHERS[dataType]) {
    return NextResponse.json(
      { error: `Invalid type. Must be one of: ${Object.keys(FETCHERS).join(', ')}` },
      { status: 400 }
    );
  }

  try {
    const data = await FETCHERS[dataType]();
    return NextResponse.json({ data });
  } catch (error) {
    console.error(`Error fetching ${dataType}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
