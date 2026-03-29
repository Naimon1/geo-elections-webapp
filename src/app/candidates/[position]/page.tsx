import { getCandidates } from "@/lib/googleSheets";
import PositionClient from "@/components/PositionClient";

export const revalidate = 60; // Revalidate every minute

export default async function PositionPage({ params }: { params: { position: string } }) {
  const decodedPosition = decodeURIComponent(params.position).toLowerCase();
  const allCandidates = await getCandidates();
  
  // Filter candidates by position and sort alphabetically by name
  const candidates = allCandidates
    .filter(c => c.position.toLowerCase() === decodedPosition)
    .sort((a, b) => {
      const aLastName = a.name.split(' ').pop() || a.name;
      const bLastName = b.name.split(' ').pop() || b.name;
      return aLastName.localeCompare(bLastName);
    });

  return <PositionClient candidates={candidates} position={decodedPosition} />;
}
