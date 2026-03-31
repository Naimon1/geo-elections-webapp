export interface Candidate {
  id: string;
  name: string;
  position: string;
  headshotUrl: string;
  manifestoUrl: string;
  videoUrl: string;
  keyPoints: string[];
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface ImportantDate {
  title: string;
  date: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Election {
  id: string;
  title: string;
  year: string;
  type: string;
  status: "active" | "upcoming" | "completed";
  description: string;
  votingDate: string;
  nominationStart: string;
  nominationEnd: string;
  campaignStart: string;
  campaignEnd: string;
}

export interface PastElectionResult {
  returningOfficer: string;
  day: string;
  month: string;
  year: string;
  position: string;
  candidateName: string;
  votes: string;
  ron: string;
  rejectedBallots: string;
  totalVotesCast: string;
  outcome: string;
}

export interface OfficialDocument {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  dateAdded: string;
  description: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  isActive: boolean;
}

export interface AboutSection {
  id: string;
  sectionTitle: string;
  content: string;
  order: number;
  iconName: string;
}

export interface Official {
  id: string;
  name: string;
  role: string;
  yearStart: string;
  yearEnd: string;
  type: "returning_officer" | "geo_official" | "councilor";
  photoUrl: string;
}

export interface CouncilorRole {
  id: string;
  position: string;
  constitutionalDuties: string;
  additionalExpectations: string;
  candidateGuidance: string;
  order: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
  isActive: boolean;
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

export async function fetchSheetData(range: string) {
  if (!SHEET_ID || !API_KEY) {
    console.warn("Google Sheets API key or Sheet ID is missing.");
    return [];
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error(`Error fetching Google Sheets data for range "${range}":`, error);
    return [];
  }
}

// ─── Candidates ──────────────────────────────────────────────
export async function getCandidates(): Promise<Candidate[]> {
  const rows = await fetchSheetData("Candidates!A2:I");

  return rows.map((row: string[], index: number) => ({
    id: `candidate-${index}`,
    name: row[0] || "",
    position: row[1] || "",
    headshotUrl: row[2] || "",
    manifestoUrl: row[3] || "",
    videoUrl: row[4] || "",
    keyPoints: row[5] ? row[5].split("|").map((p: string) => p.trim()) : [],
    socialLinks: {
      instagram: row[6] || "",
      twitter: row[7] || "",
      facebook: row[8] || "",
    },
  }));
}

// ─── Important Dates ─────────────────────────────────────────
export async function getImportantDates(): Promise<ImportantDate[]> {
  const rows = await fetchSheetData("Dates!A2:B");
  return rows.map((row: string[]) => ({
    title: row[0] || "",
    date: row[1] || "",
  }));
}

// ─── FAQs ────────────────────────────────────────────────────
export async function getFAQs(): Promise<FAQ[]> {
  const rows = await fetchSheetData("FAQ!A2:B");
  return rows.map((row: string[]) => ({
    question: row[0] || "",
    answer: row[1] || "",
  }));
}

// ─── Elections ───────────────────────────────────────────────
export async function getElections(): Promise<Election[]> {
  const rows = await fetchSheetData("Elections!A2:K");
  return rows.map((row: string[], index: number) => ({
    id: `election-${index}`,
    title: row[0] || "",
    year: row[1] || "",
    type: row[2] || "",
    status: (row[3]?.toLowerCase() || "upcoming") as Election["status"],
    description: row[4] || "",
    votingDate: row[5] || "",
    nominationStart: row[6] || "",
    nominationEnd: row[7] || "",
    campaignStart: row[8] || "",
    campaignEnd: row[9] || "",
  }));
}

export async function getActiveElection(): Promise<Election | null> {
  const elections = await getElections();
  return elections.find((e) => e.status === "active") || null;
}

// ─── Past Election Results ───────────────────────────────────
export async function getPastElectionResults(): Promise<PastElectionResult[]> {
  const rows = await fetchSheetData("PastResults!A2:K");
  return rows.map((row: string[]) => ({
    returningOfficer: row[0] || "",
    day: row[1] || "",
    month: row[2] || "",
    year: row[3] || "",
    position: row[4] || "",
    candidateName: row[5] || "",
    votes: row[6] || "",
    ron: row[7] || "",
    rejectedBallots: row[8] || "",
    totalVotesCast: row[9] || "",
    outcome: row[10] || "",
  }));
}

// ─── Official Documents ──────────────────────────────────────
export async function getDocuments(): Promise<OfficialDocument[]> {
  const rows = await fetchSheetData("Documents!A2:F");
  return rows.map((row: string[], index: number) => ({
    id: `doc-${index}`,
    title: row[0] || "",
    category: row[1] || "",
    fileUrl: row[2] || "",
    dateAdded: row[3] || "",
    description: row[4] || "",
  }));
}

// ─── Notices ─────────────────────────────────────────────────
export async function getNotices(): Promise<Notice[]> {
  const rows = await fetchSheetData("Notices!A2:F");
  return rows.map((row: string[], index: number) => ({
    id: `notice-${index}`,
    title: row[0] || "",
    content: row[1] || "",
    date: row[2] || "",
    type: row[3] || "announcement",
    isActive: (row[4] || "").toLowerCase() !== "no",
  }));
}

// ─── About Us ────────────────────────────────────────────────
export async function getAboutSections(): Promise<AboutSection[]> {
  const rows = await fetchSheetData("AboutUs!A2:D");
  return rows
    .map((row: string[], index: number) => ({
      id: `about-${index}`,
      sectionTitle: row[0] || "",
      content: row[1] || "",
      order: parseInt(row[2] || "0", 10),
      iconName: row[3] || "",
    }))
    .sort((a: AboutSection, b: AboutSection) => a.order - b.order);
}

// ─── Officials / Records ─────────────────────────────────────
export async function getOfficials(): Promise<Official[]> {
  const rows = await fetchSheetData("Officials!A2:G");
  return rows.map((row: string[], index: number) => ({
    id: `official-${index}`,
    name: row[0] || "",
    role: row[1] || "",
    yearStart: row[2] || "",
    yearEnd: row[3] || "",
    type: (row[4]?.toLowerCase() || "geo_official") as Official["type"],
    photoUrl: row[5] || "",
  }));
}

// ─── Councilor Roles ─────────────────────────────────────────
export async function getCouncilorRoles(): Promise<CouncilorRole[]> {
  const rows = await fetchSheetData("CouncilorRoles!A2:E");
  return rows
    .map((row: string[], index: number) => ({
      id: `role-${index}`,
      position: row[0] || "",
      constitutionalDuties: row[1] || "",
      additionalExpectations: row[2] || "",
      candidateGuidance: row[3] || "",
      order: parseInt(row[4] || "0", 10),
    }))
    .sort((a: CouncilorRole, b: CouncilorRole) => a.order - b.order);
}

// ─── Announcements (Real-time Updates) ───────────────────────
export async function getAnnouncements(): Promise<Announcement[]> {
  const rows = await fetchSheetData("Announcements!A2:F");
  return rows
    .map((row: string[], index: number) => ({
      id: `announcement-${index}`,
      title: row[0] || "",
      content: row[1] || "",
      date: row[2] || "",
      priority: (row[3]?.toLowerCase() || "medium") as Announcement["priority"],
      isActive: (row[4] || "").toLowerCase() !== "no",
    }))
    .filter((a: Announcement) => a.isActive);
}
