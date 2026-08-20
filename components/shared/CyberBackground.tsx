"use client";

import React from "react";

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dark Garage Gradient Overlay */}
      <div className="absolute inset-0 bg-[#06070a]/90" />

      {/* Cyber Grid with Neon Depth */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-20" />

      {/* Ambient Neon Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl" />

      {/* Speed Scanline */}
      <div className="racing-scanline" />
    </div>
  );
}
