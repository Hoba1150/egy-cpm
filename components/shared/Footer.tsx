"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Zap, Lock, Flame } from "lucide-react";
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
  const footerBio =
    settings.footer_bio ||
    "المتجر الأول والمتخصص في خدمات لعبة Car Parking Multiplayer على الهواتف. سيارات مرسومة، تعديل محركات 1695HP، كينج رانك، شحن كاش وكوينز بأمان 100%.";
  const footerGuarantee =
    settings.footer_guarantee || "ضمان ضد الباند 100% وتسليم فوري";
  const cashPhone =
    settings.vodafone_cash || settings.announcement_cash_phone || "01288212101";
  const copyrightText =
    settings.footer_copyright ||
    `© ${new Date().getFullYear()} ${storeName}. جميع الحقوق محفوظة لمتجر كار باركينج.`;

  return (
    <footer className="border-t border-cyan-500/20 bg-[#06070a] text-gray-400 relative z-10 pb-20 md:pb-8">
      {/* Top Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-right">
          {/* Col 1: Store Bio */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-xs leading-relaxed text-gray-400">{footerBio}</p>
            <div className="flex items-center gap-2 pt-1 text-xs text-neon-green font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{footerGuarantee}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-neon-cyan" />
              <span>أقسام المتجر</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cars" className="hover:text-neon-cyan transition">
                  جميع سيارات كار باركينج
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-neon-cyan transition">
                  سيارات معدلة 1695HP وسرعة
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-neon-cyan transition">
                  سيارات رسم وتصميمات خاصة (Drawn)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-neon-cyan transition">
                  شحن كاش وأموال خضراء 50M
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-neon-cyan transition">
                  تفعيل رتبة الكينج رانك (King Rank)
                </Link>
              </li>
              <li>
                <Link href="/accounts" className="hover:text-neon-cyan transition">
                  حسابات جاهزة VIP ماكس
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Center */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon-purple" />
              <span>خدمة العملاء</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/wallet" className="hover:text-neon-cyan transition">
                  محفظتي وسجل العمليات
                </Link>
              </li>
              <li>
                <Link href="/deposit" className="hover:text-neon-cyan transition">
                  شحن رصيد المحفظة (فودافون كاش)
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-neon-cyan transition">
                  تتبع حالة الطلب الفورية
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-neon-cyan transition">
                  مركز الدعم الفني والتذاكر
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-neon-cyan transition">
                  الأسئلة الشائعة والإجابات
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-neon-cyan transition">
                  الشروط والأحكام
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Methods & Security */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-neon-green" />
              <span>طرق الإيداع المعتمدة</span>
            </h4>
            <div className="p-3 rounded-xl bg-garage-900 border border-gray-800 space-y-2">
              <p className="text-[11px] text-gray-300">
                رقم التحويل الموحد لمحفظة المتجر:
              </p>
              <div className="flex items-center justify-between p-2 rounded-lg bg-garage-850 border border-cyan-500/30">
                <span className="font-mono text-neon-cyan font-bold tracking-widest text-sm dir-ltr">
                  {cashPhone}
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                  كاش
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-gray-400">
                <span className="bg-garage-800 p-1.5 rounded text-center">Vodafone Cash</span>
                <span className="bg-garage-800 p-1.5 rounded text-center">Orange Cash</span>
                <span className="bg-garage-800 p-1.5 rounded text-center">Etisalat Cash</span>
                <span className="bg-garage-800 p-1.5 rounded text-center">WE Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-gray-300">
              الشروط والأحكام
            </Link>
            <Link href="/privacy" className="hover:text-gray-300">
              الخصوصية
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              اتصل بنا
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
