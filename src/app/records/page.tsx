import { getOfficials } from "@/lib/googleSheets";
import RecordsClient from "@/components/RecordsClient";

export const revalidate = 60;

export default async function RecordsPage() {
  const officials = await getOfficials();

  return <RecordsClient officials={officials} />;
}
