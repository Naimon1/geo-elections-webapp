"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavDropdown {
  label: string;
  items: { label: string; href: string }[];
}

const navLinks: (NavDropdown | { label: string; href: string })[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Elections',
    items: [
      { label: 'Current Election', href: '/elections' },
      { label: 'Election Archive', href: '/elections/archive' },
    ],
  },
  {
    label: 'Candidates',
    items: [
      { label: 'Presidential Candidates', href: '/candidates/president' },
    ],
  },
  { label: 'Documents & Notices', href: '/documents' },
  { label: 'Councilor Roles', href: '/councilor-roles' },
  { label: 'Records', href: '/records' },
  { label: 'About GEO', href: '/about' },
];

function isDropdown(item: (typeof navLinks)[number]): item is NavDropdown {
  return 'items' in item;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="glass-dark text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-2xl tracking-tight group font-serif">
              <span className="text-guild-yellow group-hover:text-white transition-colors">GEO</span>
              <span className="text-guild-red ml-1">Elections</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {navLinks.map((item) =>
              isDropdown(item) ? (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                    className="flex items-center text-sm font-medium hover:text-guild-yellow transition-colors group"
                  >
                    {item.label}
                    <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-4 w-52 rounded-xl shadow-2xl glass-dark ring-1 ring-white/10 overflow-hidden"
                      >
                        <div className="py-2" role="menu">
                          {item.items.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-guild-red/10 hover:text-guild-yellow transition-colors font-medium"
                              role="menuitem"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium hover:text-guild-yellow transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-guild-yellow transition-all group-hover:w-full"></span>
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-guild-yellow hover:bg-white/10 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-dark border-t border-white/10"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3 max-h-[80vh] overflow-y-auto">
              {navLinks.map((item) =>
                isDropdown(item) ? (
                  <div key={item.label} className="px-3 py-2.5 text-base font-medium text-white/90">
                    {item.label}
                    <div className="mt-2 space-y-1 pl-4 border-l-2 border-guild-red/50">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 rounded-lg text-sm hover:text-guild-yellow hover:bg-white/5 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-base font-medium hover:text-guild-yellow hover:bg-white/5 transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
