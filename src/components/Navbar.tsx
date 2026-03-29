"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Hardcoded positions for now, could be fetched from API
  const positions = ['President'];

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
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-guild-yellow transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-guild-yellow transition-all group-hover:w-full"></span>
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className="flex items-center text-sm font-medium hover:text-guild-yellow transition-colors group"
              >
                Campaign Material 
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-4 w-48 rounded-xl shadow-2xl glass ring-1 ring-black ring-opacity-5 overflow-hidden"
                  >
                    <div className="py-2" role="menu">
                      {positions.map((position) => (
                        <Link
                          key={position}
                          href={`/candidates/${encodeURIComponent(position.toLowerCase())}`}
                          className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-guild-red/10 hover:text-guild-red transition-colors font-medium"
                          role="menuitem"
                        >
                          {position}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/electoral-code" className="text-sm font-medium hover:text-guild-yellow transition-colors relative group">
              Electoral Code
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-guild-yellow transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
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
            className="md:hidden glass-dark border-t border-white/10"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2.5 rounded-lg text-base font-medium hover:text-guild-yellow hover:bg-white/5 transition-colors">
                Home
              </Link>
              <div className="px-3 py-2.5 text-base font-medium text-white/90">
                Campaign Material
                <div className="mt-2 space-y-1 pl-4 border-l-2 border-guild-red/50">
                  {positions.map((position) => (
                    <Link
                      key={position}
                      href={`/candidates/${encodeURIComponent(position.toLowerCase())}`}
                      className="block px-3 py-2 rounded-lg text-sm hover:text-guild-yellow hover:bg-white/5 transition-colors"
                    >
                      {position}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/electoral-code" className="block px-3 py-2.5 rounded-lg text-base font-medium hover:text-guild-yellow hover:bg-white/5 transition-colors">
                Electoral Code
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
