import { getPastElectionResults } from "@/lib/googleSheets";
import ArchiveClient from "@/components/ArchiveClient";

export const revalidate = 60;

export default async function ArchivePage() {
  const results = await getPastElectionResults();

  return <ArchiveClient results={results} />;
}
