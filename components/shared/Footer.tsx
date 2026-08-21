"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Phone, Mail } from "lucide-react";
import Logo from "@/components/shared/Logo";

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const storeName = settings.store_name || "EGY CPM";
  const cashPhone = settings.vodafone_cash || settings.announcement_cash_phone || "01288212101";
  const copyrightText =
    settings.footer_copyright ||
    `© ${new Date().getFullYear()} ${storeName}. جميع الحقوق محفوظة لمتجر كار باركينج.`;

  return (
    <footer className="border-t border-gray-800/80 bg-[#07090e] text-gray-400 relative z-10 pb-20 md:pb-6 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Col 1: Logo & Brief Bio */}
          <div className="space-y-2">
            <Logo size="sm" />
            <p className="text-xs text-gray-400">
              متجر خدمات وتعديلات لعبة Car Parking Multiplayer. تسليم سريع وضمان أمان 100%.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-300">
            <Link href="/" className="hover:text-neon-cyan transition">الرئيسية</Link>
            <Link href="/cars" className="hover:text-neon-cyan transition">السيارات</Link>
            <Link href="/services" className="hover:text-neon-cyan transition">الخدمات والشحن</Link>
            <Link href="/accounts" className="hover:text-neon-cyan transition">الحسابات</Link>
            <Link href="/deposit" className="hover:text-neon-cyan transition">شحن المحفظة</Link>
            <Link href="/support" className="hover:text-neon-cyan transition">الدعم الفني</Link>
            <Link href="/terms" className="hover:text-neon-cyan transition">الشروط</Link>
            <Link href="/privacy" className="hover:text-neon-cyan transition">الخصوصية</Link>
          </div>

          {/* Col 3: Cash & Contact Info */}
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-garage-900 border border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-300">رقم فودافون كاش:</span>
              <span className="font-mono text-neon-cyan font-bold text-xs dir-ltr">
                {cashPhone}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-neon-green">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>تسليم فوري ومضمون مع دعم متواصل</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-gray-800/60 text-center text-[11px] text-gray-500">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
