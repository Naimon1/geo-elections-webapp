import { getImportantDates, getFAQs } from "@/lib/googleSheets";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const dates = await getImportantDates();
  const faqs = await getFAQs();

  return <HomeClient dates={dates} faqs={faqs} />;
}