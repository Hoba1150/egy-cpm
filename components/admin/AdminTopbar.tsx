"use client";

import React from "react";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminTopbar({ user }: { user: any }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("تم تسجيل الخروج من لوحة التحكم بنجاح.");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("فشل تسجيل الخروج.");
    }
  };

  return (
    <header className="h-14 bg-[#0d1117] border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-xs font-bold text-gray-300">
          النظام متصل بالسحابة | الإدارة
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-300">
          <User className="w-3.5 h-3.5 text-orange-500" />
          <span>{user?.name || "المشرف"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>خروج</span>
        </button>
      </div>
    </header>
  );
}
