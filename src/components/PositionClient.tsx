"use client";

import Image from "next/image";
import { Candidate } from "@/lib/googleSheets";
import { FileText, Video, Instagram, Twitter, Facebook } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

interface PositionClientProps {
  candidates: Candidate[];
  position: string;
}

export default function PositionClient({ candidates, position }: PositionClientProps) {
  const displayPosition = candidates.length > 0 
    ? candidates[0].position 
    : position.charAt(0).toUpperCase() + position.slice(1);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight font-serif">
            {displayPosition} <span className="text-guild-red">Candidates</span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-guild-red to-guild-yellow mx-auto rounded-full"></div>
        </motion.div>

        {candidates.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-dark rounded-3xl shadow-xl max-w-2xl mx-auto"
          >
            <p className="text-xl text-gray-300 font-medium">No candidates have been announced for this position yet.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {candidates.map((candidate) => (
              <motion.div 
                variants={cardVariants}
                key={candidate.id} 
                className="glass-dark rounded-3xl overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-guild-red/10 transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Headshot */}
                <div className="relative w-full h-96 bg-gray-900 overflow-hidden">
                  {candidate.headshotUrl ? (
                    <Image
                      src={candidate.headshotUrl}
                      alt={`${candidate.name} - ${candidate.position}`}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
                      No Photo Available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-8 flex-grow flex flex-col bg-gray-900/50 backdrop-blur-sm">
                  <h2 className="text-3xl font-extrabold text-white mb-1 font-serif">{candidate.name}</h2>
                  <p className="text-guild-yellow font-semibold mb-6 tracking-wide uppercase text-sm">{candidate.position}</p>

                  {/* Key Points */}
                  <div className="mb-8 flex-grow">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Platform Summary</h3>
                    <ul className="space-y-2 text-gray-300">
                      {candidate.keyPoints.length > 0 ? (
                        candidate.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-guild-yellow mr-2 mt-1">•</span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">No key points provided</li>
                      )}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-700/50">
                    {candidate.manifestoUrl && (
                      <a 
                        href={candidate.manifestoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 py-3 px-4 rounded-xl transition-all font-semibold shadow-sm hover:shadow-md"
                      >
                        <FileText className="w-4 h-4 mr-2 text-guild-red" /> Read Manifesto
                      </a>
                    )}
                    
                    {candidate.videoUrl && (
                      <a 
                        href={candidate.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-gradient-to-r from-guild-red to-red-800 hover:from-red-700 hover:to-red-900 text-white py-3 px-4 rounded-xl transition-all font-semibold shadow-md hover:shadow-lg"
                      >
                        <Video className="w-4 h-4 mr-2" /> Watch Campaign Video
                      </a>
                    )}
                  </div>

                  {/* Social Links */}
                  {(candidate.socialLinks.instagram || candidate.socialLinks.twitter || candidate.socialLinks.facebook) && (
                    <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-700/50">
                      {candidate.socialLinks.instagram && (
                        <a href={candidate.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 hover:scale-110 transition-all">
                          <Instagram className="w-6 h-6" />
                        </a>
                      )}
                      {candidate.socialLinks.twitter && (
                        <a href={candidate.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 hover:scale-110 transition-all">
                          <Twitter className="w-6 h-6" />
                        </a>
                      )}
                      {candidate.socialLinks.facebook && (
                        <a href={candidate.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 hover:scale-110 transition-all">
                          <Facebook className="w-6 h-6" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}