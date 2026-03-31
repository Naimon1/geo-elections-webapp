"use client";

import React from 'react';

export function DynamicBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-950" style={{ minHeight: '100dvh' }}>
      <div className="absolute top-0 -left-4 w-48 sm:w-72 h-48 sm:h-72 bg-guild-red rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-48 sm:w-72 h-48 sm:h-72 bg-guild-yellow rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-pink-900 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  );
}
