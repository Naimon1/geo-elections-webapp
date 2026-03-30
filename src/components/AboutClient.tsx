"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Shield,
  Scale,
  Landmark,
  ClipboardList,
  Users,
  User,
  CheckCircle2,
} from "lucide-react";
import { AboutSection, Official } from "@/lib/googleSheets";

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

interface AboutClientProps {
  sections: AboutSection[];
  officials: Official[];
}

const ICON_MAP: Record<string, typeof Shield> = {
  shield: Shield,
  scale: Scale,
  landmark: Landmark,
  clipboard: ClipboardList,
  users: Users,
};

const DEFAULT_SECTIONS = [
  {
    id: "default-mandate",
    sectionTitle: "Our Mandate",
    content:
      "The Guild Elections Office (GEO) is the independent body responsible for the administration and conduct of all elections within the Guild of Students, University of the West Indies, Cave Hill Campus.",
    icon: Shield,
    color: "from-guild-red to-red-700",
  },
  {
    id: "default-role",
    sectionTitle: "Our Role",
    content:
      "The GEO ensures free, fair, and transparent elections. We manage the entire electoral process including nominations, campaigning, voting, and results declaration.",
    icon: Scale,
    color: "from-guild-yellow to-yellow-600",
  },
  {
    id: "default-structure",
    sectionTitle: "Our Structure",
    content:
      "The GEO is headed by the Returning Officer, supported by Deputy Returning Officers and electoral staff appointed for each election cycle.",
    icon: Landmark,
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "default-responsibilities",
    sectionTitle: "Our Responsibilities",
    content:
      "Administering the Electoral Code|Managing nominations and candidacy|Overseeing campaign compliance|Conducting polling and counting|Declaring official results|Adjudicating election disputes",
    icon: ClipboardList,
    color: "from-emerald-500 to-emerald-700",
    isList: true,
  },
];

function SectionIcon({ iconName }: { iconName: string }) {
  const Icon = ICON_MAP[iconName?.toLowerCase()] || Shield;
  return <Icon className="w-7 h-7" />;
}

export default function AboutClient({
  sections,
  officials,
}: AboutClientProps) {
  const hasSheetSections = sections.length > 0;

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
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight font-serif">
            About the Guild Elections Office
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-guild-red to-guild-yellow mx-auto rounded-full mt-6 mb-6" />
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Ensuring free, fair, and transparent elections for the student body
            of UWI Cave Hill Campus.
          </p>
        </motion.section>

        {/* ─── About Sections ─── */}
        {hasSheetSections ? (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
          >
            {sections.map((section) => (
              <motion.div
                key={section.id}
                variants={itemVariants}
                className="glass-dark rounded-2xl p-8 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-guild-red/10 border border-guild-red/20">
                    <SectionIcon iconName={section.iconName} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white font-serif">
                    {section.sectionTitle}
                  </h2>
                </div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
          >
            {DEFAULT_SECTIONS.map((section) => (
              <motion.div
                key={section.id}
                variants={itemVariants}
                className="glass-dark rounded-2xl p-8 relative overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${section.color}`}
                />
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-guild-red/10 border border-guild-red/20 text-guild-yellow">
                    <section.icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white font-serif">
                    {section.sectionTitle}
                  </h2>
                </div>
                {section.isList ? (
                  <ul className="space-y-3">
                    {section.content.split("|").map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-guild-yellow shrink-0 mt-0.5" />
                        <span className="text-gray-300">{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300 leading-relaxed">
                    {section.content}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ─── Key Officials ─── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-extrabold text-white mb-10 flex items-center font-serif">
            <span className="bg-gradient-to-b from-guild-yellow to-yellow-600 w-2 h-10 mr-4 rounded-full" />
            Key Officials
          </h2>

          {officials.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
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
                  <p className="text-guild-yellow text-sm font-semibold mb-2">
                    {official.role}
                  </p>
                  {(official.yearStart || official.yearEnd) && (
                    <span className="text-xs text-gray-500 font-mono bg-gray-800/50 px-3 py-1 rounded-full">
                      {official.yearStart}
                      {official.yearEnd ? ` – ${official.yearEnd}` : " – Present"}
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-dark rounded-3xl p-12 text-center max-w-lg mx-auto"
            >
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 font-serif">
                Coming Soon
              </h3>
              <p className="text-gray-500">
                Officials information coming soon.
              </p>
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
