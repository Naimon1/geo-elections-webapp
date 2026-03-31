"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Bell,
  Search,
  ExternalLink,
  Download,
  FolderOpen,
  Inbox,
} from "lucide-react";
import { OfficialDocument, Notice } from "@/lib/googleSheets";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const FALLBACK_DOCUMENTS: OfficialDocument[] = [
  {
    id: "fallback-electoral-code",
    title: "Electoral Code",
    category: "Governance",
    fileUrl: "/electoral-code.pdf",
    dateAdded: "",
    description:
      "The official Electoral Code governing all Guild of Students elections at UWI Cave Hill Campus.",
  },
  {
    id: "fallback-constitution",
    title: "The Guild of Students Constitution",
    category: "Governance",
    fileUrl: "/The Guild of Students Constitution..pdf",
    dateAdded: "",
    description:
      "The constitution of the Guild of Students, University of the West Indies, Cave Hill Campus.",
  },
  {
    id: "fallback-consent-form",
    title: "Information Release Consent Form",
    category: "Nomination Forms",
    fileUrl: "/Information Release Consent Form..pdf",
    dateAdded: "",
    description:
      "Consent form authorising the release of candidate information for election purposes.",
  },
  {
    id: "fallback-candidacy-declaration",
    title: "Confirmation of Candidacy Declaration",
    category: "Nomination Forms",
    fileUrl: "/Confirmation of Candidacy Declaration..pdf",
    dateAdded: "",
    description:
      "Official declaration form to confirm candidacy for a Guild Council position.",
  },
  {
    id: "fallback-campaign-team",
    title: "Campaign Team Declaration Form",
    category: "Campaign Forms",
    fileUrl: "/Campaign Team Declaration Form - Guild Elections.pdf",
    dateAdded: "",
    description:
      "Declaration form listing all members of a candidate's official campaign team.",
  },
  {
    id: "fallback-campaign-expenditure",
    title: "Campaign Expenditure Form",
    category: "Campaign Forms",
    fileUrl: "/Campaign Expediture Form - Guild Elections.pdf",
    dateAdded: "",
    description:
      "Form for recording and reporting all campaign-related expenditures.",
  },
  {
    id: "fallback-complaint-resolution",
    title: "Elections Complaint Resolution Agreement Form",
    category: "Dispute Resolution",
    fileUrl: "/Elections Complaint Resolution Agreement Form..pdf",
    dateAdded: "",
    description:
      "Agreement form for the formal resolution of complaints arising during the electoral process.",
  },
];

interface DocumentsClientProps {
  documents: OfficialDocument[];
  notices: Notice[];
}

type Tab = "documents" | "notices";

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    urgent: "bg-guild-red/20 text-red-300 border-guild-red/40",
    important: "bg-guild-yellow/20 text-yellow-300 border-guild-yellow/40",
    announcement: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    update: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  };

  const style =
    colors[type.toLowerCase()] ||
    "bg-gray-500/20 text-gray-300 border-gray-500/40";

  return (
    <span
      className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${style}`}
    >
      {type}
    </span>
  );
}

export default function DocumentsClient({
  documents,
  notices,
}: DocumentsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("documents");
  const [search, setSearch] = useState("");

  const allDocuments =
    documents.length > 0 ? documents : FALLBACK_DOCUMENTS;

  const filteredDocuments = useMemo(() => {
    if (!search.trim()) return allDocuments;
    const q = search.toLowerCase();
    return allDocuments.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }, [allDocuments, search]);

  const groupedDocuments = useMemo(() => {
    const groups: Record<string, OfficialDocument[]> = {};
    for (const doc of filteredDocuments) {
      const cat = doc.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(doc);
    }
    return groups;
  }, [filteredDocuments]);

  const activeNotices = useMemo(
    () => notices.filter((n) => n.isActive),
    [notices]
  );

  const tabs: { key: Tab; label: string; icon: typeof FileText }[] = [
    { key: "documents", label: "Documents", icon: FileText },
    { key: "notices", label: "Notices", icon: Bell },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <Image
            src="/GuildOfStudentsLogo.jpeg"
            alt="Guild of Students Logo"
            width={80}
            height={80}
            className="mx-auto mb-6 rounded-xl shadow-lg border border-white/10"
          />
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight font-serif">
            Official Documents & Notices
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-guild-red to-guild-yellow mx-auto rounded-full mt-6 mb-4" />
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Access official electoral documents, policies, and the latest
            notices from the Guild Elections Office.
          </p>
        </motion.section>

        {/* Tab Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-3 mb-10"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-guild-red to-red-800 text-white shadow-lg shadow-red-500/20"
                  : "glass-dark text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.key === "notices" && activeNotices.length > 0 && (
                <span className="ml-1 bg-guild-yellow/20 text-guild-yellow text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeNotices.length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ─── Documents Tab ─── */}
          {activeTab === "documents" && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Search */}
              <div className="relative max-w-md mx-auto mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/70 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-guild-yellow/50 focus:border-guild-yellow/50 transition-all"
                />
              </div>

              {Object.keys(groupedDocuments).length > 0 ? (
                Object.entries(groupedDocuments).map(([category, docs]) => (
                  <motion.section
                    key={category}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={containerVariants}
                    className="mb-12"
                  >
                    <motion.h2
                      variants={itemVariants}
                      className="text-2xl font-extrabold text-white mb-6 flex items-center font-serif"
                    >
                      <FolderOpen className="w-6 h-6 text-guild-yellow mr-3" />
                      {category}
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {docs.map((doc) => (
                        <motion.a
                          key={doc.id}
                          variants={itemVariants}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-dark rounded-2xl p-6 group hover:shadow-2xl hover:border-guild-yellow/30 transition-all duration-300 block"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-guild-red/10 border border-guild-red/20 shrink-0 group-hover:bg-guild-red/20 transition-colors">
                              <FileText className="w-6 h-6 text-guild-red" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-white group-hover:text-guild-yellow transition-colors mb-1 truncate">
                                {doc.title}
                              </h3>
                              {doc.description && (
                                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-3">
                                  {doc.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                {doc.dateAdded && (
                                  <span className="text-xs text-gray-500 font-mono">
                                    {doc.dateAdded}
                                  </span>
                                )}
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-guild-yellow opacity-0 group-hover:opacity-100 transition-opacity">
                                  {doc.fileUrl.endsWith(".pdf") ? (
                                    <>
                                      <Download className="w-3.5 h-3.5" />
                                      Download
                                    </>
                                  ) : (
                                    <>
                                      <ExternalLink className="w-3.5 h-3.5" />
                                      View
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </motion.section>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-dark rounded-3xl p-12 text-center max-w-lg mx-auto"
                >
                  <Inbox className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2 font-serif">
                    No Documents Found
                  </h3>
                  <p className="text-gray-500">
                    {search
                      ? "No documents match your search. Try a different term."
                      : "Official documents will be posted here."}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ─── Notices Tab ─── */}
          {activeTab === "notices" && (
            <motion.div
              key="notices"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeNotices.length > 0 ? (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={containerVariants}
                  className="space-y-5 max-w-3xl mx-auto"
                >
                  {activeNotices.map((notice) => (
                    <motion.div
                      key={notice.id}
                      variants={itemVariants}
                      className="glass-dark rounded-2xl p-6 border-l-4 border-guild-red hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <TypeBadge type={notice.type} />
                        <span className="text-xs text-gray-500 font-mono">
                          {notice.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                        {notice.content}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-dark rounded-3xl p-12 text-center max-w-lg mx-auto"
                >
                  <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2 font-serif">
                    No Active Notices
                  </h3>
                  <p className="text-gray-500">
                    There are no active notices at this time. Check back later
                    for updates from the Guild Elections Office.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
