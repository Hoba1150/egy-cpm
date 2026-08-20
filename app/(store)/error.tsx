"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Store error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-right">
      <div className="max-w-md w-full p-8 rounded-3xl bg-garage-900 border border-cyan-500/40 shadow-glow-cyan text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-neon-cyan flex items-center justify-center mx-auto border border-cyan-500/30">
          <AlertTriangle className="w-7 h-7 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-white">جاري مزامنة بيانات المتجر...</h2>
          <p className="text-xs text-gray-400">
            حدث تحديث طفيف في جلسة الاتصال، اضغط إعادة المحاولة ليتم تحميل المتجر فوراً.
          </p>
        </div>

        <div className="flex gap-2 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-extrabold text-xs shadow-glow-cyan hover:scale-105 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-garage-850 text-gray-300 text-xs font-bold hover:text-white transition flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
