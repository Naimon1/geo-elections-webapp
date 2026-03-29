"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ImportantDate, FAQ } from "@/lib/googleSheets";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

interface HomeClientProps {
  dates: ImportantDate[];
  faqs: FAQ[];
}

export default function HomeClient({ dates, faqs }: HomeClientProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Section - Full viewport height minus navbar */}
      <section className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
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
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center animate-fade-in-up h-full justify-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both', opacity: 0 }}>
            <Image 
              src="/geo-logo.png" 
              alt="GEO Logo" 
              width={160} 
              height={160} 
              className="mb-8 drop-shadow-2xl filter brightness-110"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight leading-tight font-serif">
            Guild of Students Contingent <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-guild-yellow to-yellow-200">
              Presidential Elections 2026
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-medium drop-shadow-md max-w-2xl font-serif italic mb-20">
            Transparency. Integrity. Progress.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 1.5, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-guild-yellow/90 z-30"
        >
          <span className="text-xs tracking-widest uppercase font-bold mb-2">Scroll</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20L12 4M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 px-4 max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="glass-dark rounded-3xl p-10 md:p-16 shadow-2xl"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-extrabold text-white mb-6 tracking-tight font-serif">
            Welcome to <span className="text-guild-yellow">the Election Portal</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-gradient-to-r from-guild-red to-guild-yellow mx-auto mb-8"></motion.div>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
            This portal is the official source of campaign information for the <strong>2026 Guild of Students Contingent Presidential Elections</strong>. 
            It is maintained by the Guild Elections Office to ensure every resident has fair and equal access to candidate materials.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              href="/candidates/president" 
              className="group relative px-8 py-4 bg-gradient-to-r from-guild-red to-red-800 text-white rounded-xl font-bold shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">View Candidates</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
            </Link>
            <Link 
              href="/electoral-code" 
              className="group px-8 py-4 bg-transparent text-guild-yellow border-2 border-guild-yellow rounded-xl font-bold shadow-sm hover:bg-guild-yellow/10 transition-all hover:-translate-y-1"
            >
              Electoral Code
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <div className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
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
                  <div key={index} className="flex justify-between items-center group border-b border-gray-700/50 pb-4 last:border-0">
                    <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">{date.title}</span>
                    <span className="w-48 text-center font-mono text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50">{date.date}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-center border-b border-gray-700/50 pb-4">
                    <span className="font-semibold text-gray-300">Nomination Period</span>
                    <span className="w-48 text-center font-mono text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50">16th-18th March</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700/50 pb-4">
                    <span className="font-semibold text-gray-300">Filing Period</span>
                    <span className="w-48 text-center font-mono text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50">27th-29th March</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700/50 pb-4">
                    <span className="font-semibold text-gray-300">Campaign Period</span>
                    <span className="w-48 text-center font-mono text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50">30th Mar - 8th Apr</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700/50 pb-4">
                    <span className="font-semibold text-gray-300">Debate Night</span>
                    <span className="w-48 text-center font-mono text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50">8th April</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-300">Polling Day</span>
                    <span className="w-48 text-center font-mono text-sm tracking-tight text-guild-yellow font-bold bg-yellow-900/30 px-3 py-2 rounded-xl border border-yellow-700/50">9th April</span>
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
                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-guild-red transition-colors">What happens if there's a tie?</h4>
                    <p className="text-gray-400 leading-relaxed">In the event of a tie, the Electoral Code outlines the procedure for a run-off election.</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
