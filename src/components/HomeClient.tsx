"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ImportantDate, FAQ, Election, Announcement } from "@/lib/googleSheets";
import { AlertCircle, ArrowRight, Bell } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface HomeClientProps {
  dates: ImportantDate[];
  faqs: FAQ[];
  activeElection: Election | null;
  announcements: Announcement[];
}

export default function HomeClient({ dates, faqs, activeElection, announcements }: HomeClientProps) {
  const highPriorityAnnouncements = announcements.filter((a) => a.priority === "high");
  const hasAnnouncements = announcements.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Live Announcements Ticker */}
      {highPriorityAnnouncements.length > 0 && (
        <div className="bg-gradient-to-r from-guild-red to-red-800 text-white py-2.5 px-4 relative z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-sm font-medium">
            <Bell className="w-4 h-4 mr-2 animate-pulse shrink-0" />
            <span className="truncate">{highPriorityAnnouncements[0].title}: {highPriorityAnnouncements[0].content}</span>
          </div>
        </div>
      )}

      {/* Banner Section */}
      <section className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-guild-red/60 to-gray-950/90 mix-blend-multiply z-10"></div>
          <Image
            src="/groupPhoto.jpeg"
            alt="GEO Group Photo"
            fill
            className="object-cover object-center opacity-70 scale-105 motion-safe:animate-pulse-slow"
            priority
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-20 pb-28 sm:pb-24">
          <div className="animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both", opacity: 0 }}>
            <Image
              src="/geo-logo.png"
              alt="GEO Logo"
              width={160}
              height={160}
              className="mb-6 sm:mb-8 drop-shadow-2xl filter brightness-110 w-28 h-28 sm:w-40 sm:h-40"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-xl tracking-tight leading-tight font-serif">
            Guild of Students Contingent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-guild-yellow to-yellow-200">
              Presidential Elections 2026
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-medium drop-shadow-md max-w-2xl font-serif italic mb-8 sm:mb-12">
            Transparency. Integrity. Progress.
          </p>

          {/* Election Status Badge */}
          {activeElection && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link
                href="/elections"
                className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all group text-sm sm:text-base"
              >
                <span className="relative flex h-3 w-3 mr-2 sm:mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-semibold truncate max-w-[200px] sm:max-w-none">{activeElection.title}</span>
                <span className="ml-2 text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full font-bold uppercase hidden sm:inline">
                  {activeElection.status}
                </span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex-col items-center text-guild-yellow/90 z-30 hidden sm:flex"
        >
          <span className="text-xs tracking-widest uppercase font-bold mb-2">Scroll</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20L12 4M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* Announcements Section */}
      {hasAnnouncements && (
        <section className="py-12 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-dark rounded-2xl p-6 border-l-4 border-guild-yellow"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center font-serif">
                <AlertCircle className="w-5 h-5 text-guild-yellow mr-2" />
                Latest Updates
              </h3>
              <div className="space-y-3">
                {announcements.slice(0, 3).map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${a.priority === "high" ? "bg-red-500" : a.priority === "medium" ? "bg-guild-yellow" : "bg-gray-500"}`} />
                    <div>
                      <p className="text-white font-semibold text-sm">{a.title}</p>
                      <p className="text-gray-400 text-sm">{a.content}</p>
                    </div>
                    {a.date && <span className="text-xs text-gray-500 ml-auto shrink-0">{a.date}</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Welcome Section */}
      <section className="py-12 sm:py-24 px-4 max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="glass-dark rounded-3xl p-6 sm:p-10 md:p-16 shadow-2xl"
        >
          <motion.h2 variants={itemVariants} className="text-2xl sm:text-4xl font-extrabold text-white mb-6 tracking-tight font-serif">
            Welcome to <span className="text-guild-yellow">the Election Portal</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-guild-red to-guild-yellow mx-auto mb-8"></motion.div>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
            This portal is the official source of campaign information for the <strong>2026 Guild of Students Contingent Presidential Elections</strong>.
            It is maintained by the Guild Elections Office to ensure every resident has fair and equal access to candidate materials.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-6 flex-wrap">
            <Link
              href="/candidates/president"
              className="group relative px-8 py-4 bg-gradient-to-r from-guild-red to-red-800 text-white rounded-xl font-bold shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">View Candidates</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
            </Link>
            <Link
              href="/elections"
              className="group px-8 py-4 bg-transparent text-guild-yellow border-2 border-guild-yellow rounded-xl font-bold shadow-sm hover:bg-guild-yellow/10 transition-all hover:-translate-y-1"
            >
              Election Hub
            </Link>
            <Link
              href="/documents"
              className="group px-8 py-4 bg-transparent text-white border-2 border-gray-600 rounded-xl font-bold shadow-sm hover:bg-white/5 transition-all hover:-translate-y-1"
            >
              Documents & Notices
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Dates + FAQ side-by-side */}
      <div className="py-12 sm:py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Important Dates */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-dark rounded-2xl p-8 md:p-10 shadow-xl border-t-4 border-guild-yellow hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-3xl font-extrabold text-white mb-8 flex items-center font-serif">
              <span className="bg-gradient-to-b from-guild-yellow to-yellow-600 w-2 h-10 mr-4 rounded-full shadow-sm"></span>
              Important Dates
            </h3>
            <div className="space-y-6">
              {dates.length > 0 ? (
                dates.map((date, index) => (
                  <div key={index} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 group border-b border-gray-700/50 pb-4 last:border-0">
                    <span className="font-semibold text-gray-300 group-hover:text-white transition-colors text-sm sm:text-base">{date.title}</span>
                    <span className="sm:w-48 text-center font-mono text-xs sm:text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50 shrink-0">
                      {date.date}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-700/50 pb-4">
                    <span className="font-semibold text-gray-300 text-sm sm:text-base">Nomination Period</span>
                    <span className="sm:w-48 text-center font-mono text-xs sm:text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50 shrink-0">16th-18th March</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-700/50 pb-4">
                    <span className="font-semibold text-gray-300 text-sm sm:text-base">Filing Period</span>
                    <span className="sm:w-48 text-center font-mono text-xs sm:text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50 shrink-0">27th-29th March</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-700/50 pb-4">
                    <span className="font-semibold text-gray-300 text-sm sm:text-base">Campaign Period</span>
                    <span className="sm:w-48 text-center font-mono text-xs sm:text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50 shrink-0">30th Mar - 8th Apr</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-700/50 pb-4">
                    <span className="font-semibold text-gray-300 text-sm sm:text-base">Debate Night</span>
                    <span className="sm:w-48 text-center font-mono text-xs sm:text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50 shrink-0">8th April</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <span className="font-semibold text-gray-300 text-sm sm:text-base">Polling Day</span>
                    <span className="sm:w-48 text-center font-mono text-xs sm:text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50 shrink-0">9th April</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-dark rounded-2xl p-8 md:p-10 shadow-xl border-t-4 border-guild-red hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-3xl font-extrabold text-white mb-8 flex items-center font-serif">
              <span className="bg-gradient-to-b from-guild-red to-red-800 w-2 h-10 mr-4 rounded-full shadow-sm"></span>
              Frequently Asked Questions
            </h3>
            <div className="space-y-8">
              {faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <div key={index} className="group">
                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-guild-red transition-colors">{faq.question}</h4>
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="group">
                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-guild-red transition-colors">Who can vote?</h4>
                    <p className="text-gray-400 leading-relaxed">All registered students who are members of the Guild are eligible to vote.</p>
                  </div>
                  <div className="group">
                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-guild-red transition-colors">How to vote?</h4>
                    <p className="text-gray-400 leading-relaxed">Voting will be conducted online through the official university portal.</p>
                  </div>
                  <div className="group">
                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-guild-red transition-colors">What happens if there&apos;s a tie?</h4>
                    <p className="text-gray-400 leading-relaxed">In the event of a tie, the Electoral Code outlines the procedure for a run-off election.</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Links Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-white text-center mb-12 font-serif"
          >
            Explore the Portal
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href: "/councilor-roles", label: "Councilor Roles", desc: "Learn about each Guild position", color: "from-blue-900/40 to-blue-800/20", border: "border-blue-700/50" },
              { href: "/records", label: "Institutional Records", desc: "Past officers and officials", color: "from-purple-900/40 to-purple-800/20", border: "border-purple-700/50" },
              { href: "/about", label: "About GEO", desc: "Our mandate and structure", color: "from-green-900/40 to-green-800/20", border: "border-green-700/50" },
              { href: "/elections/archive", label: "Election Archive", desc: "Past results and turnout", color: "from-amber-900/40 to-amber-800/20", border: "border-amber-700/50" },
            ].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={`block p-6 rounded-2xl bg-gradient-to-br ${link.color} border ${link.border} hover:scale-[1.03] transition-all duration-200 group`}
                >
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-guild-yellow transition-colors">{link.label}</h3>
                  <p className="text-gray-400 text-sm">{link.desc}</p>
                  <ArrowRight className="w-4 h-4 text-gray-500 mt-3 group-hover:translate-x-1 group-hover:text-guild-yellow transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
