import { getImportantDates, getFAQs, getActiveElection, getAnnouncements } from "@/lib/googleSheets";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60;

export default async function Home() {
  const [dates, faqs, activeElection, announcements] = await Promise.all([
    getImportantDates(),
    getFAQs(),
    getActiveElection(),
    getAnnouncements(),
  ]);

  return (
    <HomeClient
      dates={dates}
      faqs={faqs}
      activeElection={activeElection}
      announcements={announcements}
    />
  );
}
