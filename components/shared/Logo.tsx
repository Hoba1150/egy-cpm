"use client";

import React from "react";
import Link from "next/link";
import { Car, Flame } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const iconSizes = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-16 h-16",
  };

  const titleSizes = {
    sm: "text-base sm:text-lg",
    md: "text-lg sm:text-2xl",
    lg: "text-2xl sm:text-4xl",
  };

  return (
    <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
      {/* Cyber Racing Garage Emblem */}
      <div
        className={`relative flex items-center justify-center ${iconSizes[size]} rounded-2xl bg-gradient-to-br from-cyan-500/20 via-garage-850 to-purple-600/20 border border-cyan-500/40 shadow-glow-cyan-sm group-hover:shadow-glow-cyan group-hover:border-neon-cyan transition-all duration-300`}
      >
        <Car className="w-3/5 h-3/5 text-neon-cyan group-hover:scale-110 transition duration-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-green animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-green" />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="text-right">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${titleSizes[size]} font-black tracking-wider text-white flex items-center gap-1.5 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]`}>
              EGY <span className="text-neon-cyan">CPM</span>
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] tracking-widest font-bold text-gray-400 font-mono block mt-0.5 uppercase">
            Car Parking Marketplace
          </span>
        </div>
      )}
    </Link>
  );
}
