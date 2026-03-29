// src/lib/googleSheets.ts

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

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

export async function fetchSheetData(range: string) {
  if (!SHEET_ID || !API_KEY) {
    console.warn("Google Sheets API key or Sheet ID is missing.");
    return [];
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 60 } }); // Cache for 60 seconds
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    return [];
  }
}

export async function getCandidates(): Promise<Candidate[]> {
  const rows = await fetchSheetData("Candidates!A2:I");
  
  return rows.map((row: any[], index: number) => {
    // Expected columns: 
    // A: Name, B: Position, C: Headshot URL, D: Manifesto URL, E: Video URL, 
    // F: Key Points (comma separated), G: Instagram, H: Twitter, I: Facebook
    return {
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
      }
    };
  });
}

export async function getImportantDates(): Promise<ImportantDate[]> {
  const rows = await fetchSheetData("Dates!A2:B");
  return rows.map((row: any[]) => ({
    title: row[0] || "",
    date: row[1] || "",
  }));
}

export async function getFAQs(): Promise<FAQ[]> {
  const rows = await fetchSheetData("FAQ!A2:B");
  return rows.map((row: any[]) => ({
    question: row[0] || "",
    answer: row[1] || "",
  }));
}
