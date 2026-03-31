import { NextResponse } from 'next/server';
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
} from '@/lib/googleSheets';

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
  const { searchParams } = new URL(request.url);
  const dataType = searchParams.get('type');

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
