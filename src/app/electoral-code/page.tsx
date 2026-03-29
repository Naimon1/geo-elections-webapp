"use client";

import { motion } from "framer-motion";

export default function ElectoralCode() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight font-serif">
            Guild <span className="text-guild-red">Electoral Code</span>
          </h1>
          <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
            The official rules and regulations governing the Guild of Students Contingent Presidential Elections.
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-guild-red to-guild-yellow mx-auto rounded-full mt-8"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-dark rounded-3xl shadow-2xl overflow-hidden border border-gray-700"
        >
          <div className="p-8 md:p-12">
            <div className="prose max-w-none">
              <h2 className="text-3xl font-bold text-white border-b-2 border-gray-700 pb-4 mb-8 font-serif">Table of Contents</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 list-none pl-0">
                {[
                  "CHAPTER I: THE CODE",
                  "CHAPTER II: THE GOVERNANCE OF THE ELECTORAL PROCESS",
                  "CHAPTER III: THE ANNUAL GENERAL ELECTION",
                  "CHAPTER IV: RULES GOVERNING CANDIDACY",
                  "CHAPTER V: RULES GOVERNING CAMPAIGNING PERIOD",
                  "CHAPTER VI: ELECTION CONTROVERSIES",
                  "CHAPTER VII: MISCELLANEOUS",
                  "CHAPTER VIII: CONDUCT OF INVOLVED PARTIES"
                ].map((chapter, idx) => (
                  <motion.li 
                    key={idx}
                    whileHover={{ x: 5, color: "#FBC02D" }}
                    className="text-gray-300 font-bold hover:text-guild-yellow cursor-pointer p-4 bg-white/5 rounded-xl border border-gray-700 shadow-sm transition-colors"
                  >
                    {chapter}
                  </motion.li>
                ))}
              </ul>

              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-l-4 border-guild-yellow p-6 rounded-r-xl my-8 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-base text-gray-300 m-0 flex items-center">
                  <span className="text-2xl mr-3">📄</span>
                  <strong>Note:</strong> You can view the full Electoral Code below or download it directly.
                </p>
                <a 
                  href="/electoral-code.pdf" 
                  download 
                  className="whitespace-nowrap px-6 py-3 bg-gradient-to-r from-guild-red to-red-800 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Download PDF
                </a>
              </div>

              {/* PDF Embed - Removed glass effect for better scrolling performance */}
              <div className="w-full h-[800px] bg-white rounded-2xl overflow-hidden shadow-inner border-2 border-gray-700">
                <iframe 
                  src="/electoral-code.pdf" 
                  className="w-full h-full"
                  title="Guild Electoral Code"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
