"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  BarChart3,
  Crown,
  ArrowLeft,
  Archive,
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

interface YearGroup {
  year: string;
  voterTurnout: string;
  totalEligible: string;
  positions: {
    position: string;
    candidates: PastElectionResult[];
  }[];
}

function groupByYear(results: PastElectionResult[]): YearGroup[] {
  const yearMap = new Map<string, PastElectionResult[]>();

  for (const r of results) {
    const existing = yearMap.get(r.year) || [];
    existing.push(r);
    yearMap.set(r.year, existing);
  }

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, candidates]) => {
      const positionMap = new Map<string, PastElectionResult[]>();
      for (const c of candidates) {
        const existing = positionMap.get(c.position) || [];
        existing.push(c);
        positionMap.set(c.position, existing);
      }

      const first = candidates[0];

      return {
        year,
        voterTurnout: first?.voterTurnout || "",
        totalEligible: first?.totalEligible || "",
        positions: Array.from(positionMap.entries()).map(
          ([position, cands]) => ({
            position,
            candidates: cands.sort((a, b) => {
              if (a.isWinner !== b.isWinner) return a.isWinner ? -1 : 1;
              return parseInt(b.votes || "0") - parseInt(a.votes || "0");
            }),
          })
        ),
      };
    });
}

function TurnoutBar({ turnout }: { turnout: string }) {
  const pct = parseFloat(turnout) || 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(pct, 100)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="h-full bg-gradient-to-r from-guild-yellow to-yellow-500 rounded-full"
        />
      </div>
      <span className="text-guild-yellow font-bold font-mono text-sm w-14 text-right">
        {pct > 0 ? `${pct}%` : "N/A"}
      </span>
    </div>
  );
}

interface ArchiveClientProps {
  results: PastElectionResult[];
}

export default function ArchiveClient({ results }: ArchiveClientProps) {
  const groups = groupByYear(results);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight font-serif">
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
                {/* Year Header */}
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
                        {group.totalEligible && (
                          <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                            <Users className="w-3.5 h-3.5" />
                            {group.totalEligible} eligible voters
                          </p>
                        )}
                      </div>
                    </div>

                    {group.voterTurnout && (
                      <div className="sm:w-64">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5" />
                          Voter Turnout
                        </p>
                        <TurnoutBar turnout={group.voterTurnout} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Positions */}
                <div className="p-8 space-y-8">
                  {group.positions.map((pos) => (
                    <div key={pos.position}>
                      <h3 className="text-lg font-bold text-guild-yellow uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-guild-yellow rounded-full" />
                        {pos.position}
                      </h3>

                      <div className="space-y-3">
                        {pos.candidates.map((c, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between rounded-xl px-5 py-4 transition-colors ${
                              c.isWinner
                                ? "bg-guild-yellow/10 border border-guild-yellow/30"
                                : "bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800/80"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {c.isWinner && (
                                <Crown className="w-5 h-5 text-guild-yellow shrink-0" />
                              )}
                              <span
                                className={`font-semibold ${
                                  c.isWinner ? "text-white" : "text-gray-300"
                                }`}
                              >
                                {c.candidateName}
                              </span>
                              {c.isWinner && (
                                <span className="text-xs font-bold bg-guild-yellow/20 text-guild-yellow px-2.5 py-0.5 rounded-full border border-guild-yellow/40">
                                  Winner
                                </span>
                              )}
                            </div>
                            <span
                              className={`font-mono font-bold text-sm ${
                                c.isWinner
                                  ? "text-guild-yellow"
                                  : "text-gray-400"
                              }`}
                            >
                              {c.votes} votes
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Back link */}
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
