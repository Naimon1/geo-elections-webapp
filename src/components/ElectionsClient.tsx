"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Vote,
  Megaphone,
  Users,
  AlertCircle,
  ChevronRight,
  Archive,
  Bell,
} from "lucide-react";
import {
  Election,
  ImportantDate,
  Announcement,
} from "@/lib/googleSheets";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface ElectionsClientProps {
  election: Election | null;
  dates: ImportantDate[];
  announcements: Announcement[];
}

function StatusBadge({ status }: { status: Election["status"] }) {
  const config = {
    active: {
      bg: "bg-green-500/20 border-green-500/50",
      dot: "bg-green-400",
      text: "text-green-300",
      label: "Active",
    },
    upcoming: {
      bg: "bg-guild-yellow/20 border-guild-yellow/50",
      dot: "bg-guild-yellow",
      text: "text-yellow-300",
      label: "Upcoming",
    },
    completed: {
      bg: "bg-gray-500/20 border-gray-500/50",
      dot: "bg-gray-400",
      text: "text-gray-300",
      label: "Completed",
    },
  };
  const c = config[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold tracking-wide ${c.bg} ${c.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  );
}

function PriorityDot({ priority }: { priority: Announcement["priority"] }) {
  const colors = {
    high: "bg-guild-red",
    medium: "bg-guild-yellow",
    low: "bg-gray-400",
  };
  return <span className={`w-2.5 h-2.5 rounded-full ${colors[priority]} shrink-0`} />;
}

const timelineItems = (election: Election) => [
  {
    icon: Megaphone,
    label: "Nomination Period",
    date: `${election.nominationStart} – ${election.nominationEnd}`,
    color: "from-guild-yellow to-yellow-600",
  },
  {
    icon: Users,
    label: "Campaign Period",
    date: `${election.campaignStart} – ${election.campaignEnd}`,
    color: "from-guild-red to-red-700",
  },
  {
    icon: Vote,
    label: "Voting Day",
    date: election.votingDate,
    color: "from-green-500 to-emerald-600",
  },
];

export default function ElectionsClient({
  election,
  dates,
  announcements,
}: ElectionsClientProps) {
  if (!election) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-dark rounded-3xl p-12 md:p-16 text-center max-w-lg"
        >
          <AlertCircle className="w-16 h-16 text-guild-yellow mx-auto mb-6" />
          <h1 className="text-3xl font-extrabold text-white mb-4 font-serif">
            No Active Election
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            There is no active election at this time. Browse the archive for
            past election results and historical data.
          </p>
          <Link
            href="/elections/archive"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-guild-red to-red-800 text-white rounded-xl font-bold shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-1"
          >
            <Archive className="w-5 h-5" />
            View Election Archive
          </Link>
        </motion.div>
      </div>
    );
  }

  const timeline = timelineItems(election);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <StatusBadge status={election.status} />
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-6 mb-4 tracking-tight font-serif">
            {election.title}
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-guild-red to-guild-yellow mx-auto rounded-full mb-6" />
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {election.description}
          </p>
          <p className="text-sm text-gray-500 mt-3 font-mono">
            {election.type} &middot; {election.year}
          </p>
        </motion.section>

        {/* Key Dates Timeline */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-extrabold text-white mb-10 flex items-center font-serif"
          >
            <span className="bg-gradient-to-b from-guild-yellow to-yellow-600 w-2 h-10 mr-4 rounded-full" />
            Key Dates
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-dark rounded-2xl p-8 relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}
                />
                <item.icon className="w-10 h-10 text-guild-yellow mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.label}
                </h3>
                <p className="font-mono text-sm text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50 inline-block">
                  {item.date}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Important Dates */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-dark rounded-2xl p-8 md:p-10 shadow-xl border-t-4 border-guild-yellow"
          >
            <h3 className="text-2xl font-extrabold text-white mb-8 flex items-center font-serif">
              <Calendar className="w-6 h-6 text-guild-yellow mr-3" />
              Important Dates
            </h3>
            <div className="space-y-5">
              {dates.length > 0 ? (
                dates.map((d, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center group border-b border-gray-700/50 pb-4 last:border-0"
                  >
                    <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">
                      {d.title}
                    </span>
                    <span className="w-48 text-center font-mono text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50">
                      {d.date}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No important dates available yet.
                </p>
              )}
            </div>
          </motion.section>

          {/* Announcements */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-dark rounded-2xl p-8 md:p-10 shadow-xl border-t-4 border-guild-red"
          >
            <h3 className="text-2xl font-extrabold text-white mb-8 flex items-center font-serif">
              <Bell className="w-6 h-6 text-guild-red mr-3" />
              Announcements
            </h3>
            {announcements.length > 0 ? (
              <div className="space-y-6">
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className="group border-b border-gray-700/50 pb-5 last:border-0"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <PriorityDot priority={a.priority} />
                      <div className="flex-1">
                        <h4 className="font-bold text-white group-hover:text-guild-red transition-colors">
                          {a.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                          {a.date}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed ml-5">
                      {a.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No announcements at this time.
              </p>
            )}
          </motion.section>
        </div>

        {/* Actions */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <Link
            href="/candidates/president"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-guild-red to-red-800 text-white rounded-xl font-bold shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-1 overflow-hidden"
          >
            <Users className="w-5 h-5" />
            <span className="relative z-10">View Candidates</span>
            <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10" />
          </Link>
          <Link
            href="/elections/archive"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-guild-yellow border-2 border-guild-yellow rounded-xl font-bold hover:bg-guild-yellow/10 transition-all hover:-translate-y-1"
          >
            <Archive className="w-5 h-5" />
            Election Archive
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
