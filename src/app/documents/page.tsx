import { getDocuments, getNotices } from "@/lib/googleSheets";
import DocumentsClient from "@/components/DocumentsClient";

export const revalidate = 60;

export default async function DocumentsPage() {
  const [documents, notices] = await Promise.all([
    getDocuments(),
    getNotices(),
  ]);

  return <DocumentsClient documents={documents} notices={notices} />;
}
