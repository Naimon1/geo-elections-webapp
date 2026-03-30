import { getAboutSections, getOfficials } from "@/lib/googleSheets";
import AboutClient from "@/components/AboutClient";

export const revalidate = 60;

export default async function AboutPage() {
  const [sections, allOfficials] = await Promise.all([
    getAboutSections(),
    getOfficials(),
  ]);

  const officials = allOfficials.filter((o) => o.type === "geo_official");

  return <AboutClient sections={sections} officials={officials} />;
}
