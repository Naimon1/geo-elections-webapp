"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ScrollText,
  Star,
  Lightbulb,
  Users,
  Landmark,
} from "lucide-react";
import { CouncilorRole } from "@/lib/googleSheets";

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

interface CouncilorRolesClientProps {
  roles: CouncilorRole[];
}

function BulletList({ text }: { text: string }) {
  const items = text
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <ul className="space-y-2.5 mt-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-1.5 h-2 w-2 rounded-full bg-guild-yellow shrink-0" />
          <span className="text-gray-300 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: typeof ScrollText;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-white/5 pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 group text-left"
      >
        <span className="flex items-center gap-2.5 text-sm font-bold text-gray-200 group-hover:text-guild-yellow transition-colors">
          <Icon className="w-4 h-4 text-guild-yellow/70" />
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleCard({ role }: { role: CouncilorRole }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className="glass-dark rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-guild-red/10 border border-guild-red/20 group-hover:bg-guild-red/20 transition-colors">
            <Landmark className="w-6 h-6 text-guild-red" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-guild-yellow transition-colors">
            {role.position}
          </h3>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 ml-4"
        >
          <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-1">
              {role.constitutionalDuties && (
                <CollapsibleSection
                  title="Constitutional Duties"
                  icon={ScrollText}
                  defaultOpen
                >
                  <BulletList text={role.constitutionalDuties} />
                </CollapsibleSection>
              )}

              {role.additionalExpectations && (
                <CollapsibleSection
                  title="Additional Expectations"
                  icon={Star}
                >
                  <BulletList text={role.additionalExpectations} />
                </CollapsibleSection>
              )}

              {role.candidateGuidance && (
                <CollapsibleSection
                  title="Thinking of Running?"
                  icon={Lightbulb}
                >
                  <p className="text-gray-300 leading-relaxed mt-3">
                    {role.candidateGuidance}
                  </p>
                </CollapsibleSection>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CouncilorRolesClient({
  roles,
}: CouncilorRolesClientProps) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight font-serif">
            Guild Councilor Roles
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-guild-red to-guild-yellow mx-auto rounded-full mt-6 mb-6" />
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Understand each councilor position within the Guild of Students —
            their constitutional duties, expectations, and what it takes to run.
          </p>
        </motion.section>

        {/* Roles */}
        {roles.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
            className="space-y-4"
          >
            {roles.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark rounded-3xl p-12 text-center max-w-2xl mx-auto"
          >
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3 font-serif">
              Councilor role information is being compiled and will be available
              soon.
            </h3>
            <p className="text-gray-500 leading-relaxed max-w-lg mx-auto">
              The Guild Council consists of elected and appointed members who
              represent the student body. Each role carries specific
              constitutional duties and additional responsibilities.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
