"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Crown,
  ArrowLeft,
  Archive,
  Gavel,
  Calendar,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { PastElectionResult } from "@/lib/googleSheets";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface PositionGroup {
  position: string;
  rejectedBallots: string;
  totalVotesCast: string;
  ron: string;
  candidates: PastElectionResult[];
}

interface ElectionGroup {
  year: string;
  month: string;
  day: string;
  returningOfficer: string;
  positions: PositionGroup[];
}

function groupResults(results: PastElectionResult[]): ElectionGroup[] {
  const yearMap = new Map<string, PastElectionResult[]>();

  for (const r of results) {
    const key = r.year;
    const existing = yearMap.get(key) || [];
    existing.push(r);
    yearMap.set(key, existing);
  }

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, entries]) => {
      const first = entries[0];

      const positionMap = new Map<string, PastElectionResult[]>();
      for (const e of entries) {
        const existing = positionMap.get(e.position) || [];
        existing.push(e);
        positionMap.set(e.position, existing);
      }

      return {
        year,
        month: first?.month || "",
        day: first?.day || "",
        returningOfficer: first?.returningOfficer || "",
        positions: Array.from(positionMap.entries()).map(([position, cands]) => {
          const posFirst = cands[0];
          return {
            position,
            rejectedBallots: posFirst?.rejectedBallots || "",
            totalVotesCast: posFirst?.totalVotesCast || "",
            ron: posFirst?.ron || "",
            candidates: cands.sort((a, b) => {
              if (a.outcome === "Winner" && b.outcome !== "Winner") return -1;
              if (a.outcome !== "Winner" && b.outcome === "Winner") return 1;
              return parseInt(b.votes || "0") - parseInt(a.votes || "0");
            }),
          };
        }),
      };
    });
}

interface ArchiveClientProps {
  results: PastElectionResult[];
}

export default function ArchiveClient({ results }: ArchiveClientProps) {
  const groups = groupResults(results);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight font-serif">
            Election <span className="text-guild-yellow">Archive</span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-guild-red to-guild-yellow mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Historical election results from past Guild of Students elections at
            UWI Cave Hill Campus.
          </p>
        </motion.div>

        {groups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-dark rounded-3xl p-12 md:p-16 text-center max-w-lg mx-auto"
          >
            <Archive className="w-16 h-16 text-guild-yellow mx-auto mb-6" />
            <h2 className="text-2xl font-extrabold text-white mb-4 font-serif">
              No Past Election Data
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              No past election data available yet. Check back soon!
            </p>
            <Link
              href="/elections"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-guild-red to-red-800 text-white rounded-xl font-bold shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Current Election
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-12"
          >
            {groups.map((group) => (
              <motion.div
                key={group.year}
                variants={itemVariants}
                className="glass-dark rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Election Header */}
                <div className="bg-gradient-to-r from-guild-red/30 to-transparent px-8 py-6 border-b border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-guild-red to-red-800 flex items-center justify-center shadow-lg">
                        <Trophy className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-extrabold text-white font-serif">
                          {group.year}
                        </h2>
                        {(group.day || group.month) && (
                          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {group.day && `${group.day} `}{group.month} {group.year}
                          </p>
                        )}
                      </div>
                    </div>

                    {group.returningOfficer && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                        <Gavel className="w-4 h-4 text-guild-yellow shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Returning Officer</p>
                          <p className="text-white font-semibold text-sm">{group.returningOfficer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Positions */}
                <div className="p-8 space-y-10">
                  {group.positions.map((pos) => (
                    <div key={pos.position}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                        <h3 className="text-lg font-bold text-guild-yellow uppercase tracking-wider flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-guild-yellow rounded-full" />
                          {pos.position}
                        </h3>
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-400">
                          {pos.totalVotesCast && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              <span className="font-bold text-gray-300">{pos.totalVotesCast}</span> total votes
                            </span>
                          )}
                          {pos.rejectedBallots && (
                            <span className="flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 text-red-400" />
                              <span className="font-bold text-gray-300">{pos.rejectedBallots}</span> rejected
                            </span>
                          )}
                          {pos.ron && (
                            <span className="flex items-center gap-1">
                              RON: <span className="font-bold text-gray-300">{pos.ron}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {pos.candidates.map((c, idx) => {
                          const isWinner = c.outcome === "Winner";
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl px-4 sm:px-5 py-3 sm:py-4 gap-2 transition-colors ${
                                isWinner
                                  ? "bg-guild-yellow/10 border border-guild-yellow/30"
                                  : "bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800/80"
                              }`}
                            >
                              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                {isWinner && (
                                  <Crown className="w-4 sm:w-5 h-4 sm:h-5 text-guild-yellow shrink-0" />
                                )}
                                <span className={`font-semibold text-sm sm:text-base ${isWinner ? "text-white" : "text-gray-300"}`}>
                                  {c.candidateName}
                                </span>
                                {isWinner && (
                                  <span className="text-xs font-bold bg-guild-yellow/20 text-guild-yellow px-2 py-0.5 rounded-full border border-guild-yellow/40 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Winner
                                  </span>
                                )}
                                {!isWinner && c.outcome && (
                                  <span className="text-xs font-bold bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-full border border-gray-600/40">
                                    {c.outcome}
                                  </span>
                                )}
                              </div>
                              <span className={`font-mono font-bold text-xs sm:text-sm shrink-0 ${isWinner ? "text-guild-yellow" : "text-gray-400"}`}>
                                {c.votes} votes
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {groups.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/elections"
              className="inline-flex items-center gap-2 text-guild-yellow hover:text-yellow-300 font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Current Election
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
