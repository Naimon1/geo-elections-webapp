import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { DynamicBackground } from "@/components/DynamicBackground";
import Link from "next/link";
import { Lock } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guild of Students Contingent Presidential Elections 2026",
  description: "Transparency. Integrity. Progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-black min-h-screen flex flex-col relative`}>
        <DynamicBackground />
        <Navbar />
        <main className="flex-grow z-10">
          {children}
        </main>
        <footer className="bg-gray-900/90 backdrop-blur-md text-white py-6 px-4 z-10 relative flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 sm:mb-0">&copy; 2026 Guild Elections Office. All rights reserved.</p>
          <Link 
            href="/admin" 
            className="flex items-center text-xs text-gray-500 hover:text-guild-yellow transition-colors opacity-70 hover:opacity-100 bg-gray-800/50 px-3 py-1.5 rounded-full"
          >
            <Lock className="w-3 h-3 mr-1.5" /> Admin Portal
          </Link>
        </footer>
      </body>
    </html>
  );
}
