import { getCouncilorRoles } from "@/lib/googleSheets";
import CouncilorRolesClient from "@/components/CouncilorRolesClient";

export const revalidate = 60;

export default async function CouncilorRolesPage() {
  const roles = await getCouncilorRoles();

  return <CouncilorRolesClient roles={roles} />;
}
