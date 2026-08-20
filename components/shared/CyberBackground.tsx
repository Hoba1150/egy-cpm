"use client";

import React from "react";

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dark Garage Solid Background */}
      <div className="absolute inset-0 bg-[#06070a]" />

      {/* Cyber Grid with Low Opacity */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10" />

      {/* Optimized Ambient Glows for Desktop, hidden on mobile for maximum GPU performance */}
      <div className="hidden md:block absolute -top-40 -left-40 w-96 h-96 bg-neon-cyan/10 rounded-full blur-2xl" />
      <div className="hidden md:block absolute top-1/3 -right-40 w-96 h-96 bg-neon-purple/10 rounded-full blur-2xl" />
    </div>
  );
}
