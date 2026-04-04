"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Gavel,
  Users,
  UserCheck,
  User,
  Inbox,
  Clock,
  Calendar,
} from "lucide-react";
import { Official } from "@/lib/googleSheets";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

interface RecordsClientProps {
  officials: Official[];
}

type Tab = "returning_officer" | "geo_official" | "councilor";

const tabs: { key: Tab; label: string; icon: typeof Gavel }[] = [
  { key: "returning_officer", label: "Returning Officers", icon: Gavel },
  { key: "geo_official", label: "GEO Officials", icon: UserCheck },
  { key: "councilor", label: "Former Councilors", icon: Users },
];

const emptyLabels: Record<Tab, string> = {
  returning_officer: "Returning Officer",
  geo_official: "GEO Official",
  councilor: "Former Councilor",
};

function YearBadge({ start, end }: { start: string; end: string }) {
  return (
    <span className="text-xs text-gray-500 font-mono bg-gray-800/50 px-3 py-1 rounded-full">
      {start}
      {end ? ` – ${end}` : " – Present"}
    </span>
  );
}

function ReturningOfficersView({ officials }: { officials: Official[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="relative max-w-2xl mx-auto"
    >
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-guild-red via-guild-yellow/40 to-transparent" />

      {officials.map((officer, idx) => (
        <motion.div
          key={officer.id}
          variants={itemVariants}
          className="relative pl-14 pb-10 last:pb-0"
        >
          <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-gray-950 border-2 border-guild-red flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-guild-red" />
          </div>

          <div className="glass-dark rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start gap-4">
              {officer.photoUrl ? (
                <Image
                  src={officer.photoUrl}
                  alt={officer.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-guild-yellow/30 shadow-lg shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-800 border-2 border-guild-yellow/30 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white">{officer.name}</h3>
                <p className="text-guild-yellow text-sm font-semibold mb-2">
                  {officer.role}
                </p>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <YearBadge start={officer.yearStart} end={officer.yearEnd} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function GEOOfficialsView({ officials }: { officials: Official[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {officials.map((official) => (
        <motion.div
          key={official.id}
          variants={itemVariants}
          className="glass-dark rounded-2xl p-6 text-center hover:shadow-2xl hover:border-guild-yellow/30 transition-all duration-300"
        >
          {official.photoUrl ? (
            <Image
              src={official.photoUrl}
              alt={official.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-guild-yellow/30 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-800 border-2 border-guild-yellow/30 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-600" />
            </div>
          )}
          <h3 className="text-lg font-bold text-white mb-1">
            {official.name}
          </h3>
          <p className="text-guild-yellow text-sm font-semibold mb-3">
            {official.role}
          </p>
          <YearBadge start={official.yearStart} end={official.yearEnd} />
        </motion.div>
      ))}
    </motion.div>
  );
}

function CouncilorsView({ officials }: { officials: Official[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="overflow-x-auto"
    >
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Position
            </th>
            <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Period
            </th>
          </tr>
        </thead>
        <motion.tbody
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          {officials.map((official) => (
            <motion.tr
              key={official.id}
              variants={itemVariants}
              className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  {official.photoUrl ? (
                    <Image
                      src={official.photoUrl}
                      alt={official.name}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <span className="text-white font-semibold">
                    {official.name}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 text-guild-yellow text-sm font-medium">
                {official.role}
              </td>
              <td className="py-4 px-4">
                <YearBadge
                  start={official.yearStart}
                  end={official.yearEnd}
                />
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </motion.div>
  );
}

function EmptyState({ type }: { type: Tab }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-dark rounded-3xl p-12 text-center max-w-lg mx-auto"
    >
      <Inbox className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2 font-serif">
        No Records Yet
      </h3>
      <p className="text-gray-500">
        No {emptyLabels[type]} records available yet.
      </p>
    </motion.div>
  );
}

export default function RecordsClient({ officials }: RecordsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("returning_officer");

  const filtered = useMemo(
    () => officials.filter((o) => o.type === activeTab),
    [officials, activeTab]
  );

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
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight font-serif">
            Institutional Records
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-guild-red to-guild-yellow mx-auto rounded-full mt-6 mb-6" />
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Preserving the history and legacy of the Guild Elections Office —
            the people who have served and shaped student governance at Cave
            Hill.
          </p>
        </motion.section>

        {/* Tab Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {tabs.map((tab) => {
            const count = officials.filter((o) => o.type === tab.key).length;
            return (
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
                {count > 0 && (
                  <span className="ml-1 bg-guild-yellow/20 text-guild-yellow text-xs font-bold px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            {filtered.length === 0 ? (
              <EmptyState type={activeTab} />
            ) : activeTab === "returning_officer" ? (
              <ReturningOfficersView officials={filtered} />
            ) : activeTab === "geo_official" ? (
              <GEOOfficialsView officials={filtered} />
            ) : (
              <CouncilorsView officials={filtered} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
