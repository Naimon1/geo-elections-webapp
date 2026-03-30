import {
  getActiveElection,
  getImportantDates,
  getAnnouncements,
} from "@/lib/googleSheets";
import ElectionsClient from "@/components/ElectionsClient";

export const revalidate = 60;

export default async function ElectionsPage() {
  const [election, dates, announcements] = await Promise.all([
    getActiveElection(),
    getImportantDates(),
    getAnnouncements(),
  ]);

  return (
    <ElectionsClient
      election={election}
      dates={dates}
      announcements={announcements}
    />
  );
}
