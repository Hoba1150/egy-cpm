import React from "react";
import { MessageSquare, Phone, Mail, Clock, Headphones } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "اتصل بنا | CPM GARAGE",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right space-y-8">
      <div className="space-y-2 border-b border-gray-800 pb-4">
        <span className="text-xs font-mono font-bold text-neon-cyan uppercase">
          Get In Touch
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          تواصل مع إدارة ودعم CPM GARAGE
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          نحن هنا لمساعدتك على مدار الساعة عبر التذاكر المباشرة أو قنوات التواصل الرسمية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-garage-900 border border-cyan-500/30 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-neon-cyan flex items-center justify-center">
            <Headphones className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">نظام التذاكر المباشر</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            أسرع طريقة للحصول على دعم مخصص بخصوص طلباتك وشحن المحفظة.
          </p>
          <Link
            href="/support"
            className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold text-xs shadow-glow-cyan"
          >
            فتح تذكرة دعم فني
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-garage-900 border border-gray-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/20 text-neon-green flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">رقم الكاش وخدمة العملاء</h3>
          <div className="space-y-1 text-xs text-gray-300">
            <p>رقم التحويل المعتمد: <strong className="text-neon-cyan font-mono text-sm">01288212101</strong></p>
            <p>البريد الإلكتروني الرسمي: <strong className="text-white font-mono">support@cpmgarage.com</strong></p>
            <p>أوقات العمل: 24 ساعة / 7 أيام في الأسبوع</p>
          </div>
        </div>
      </div>
    </div>
  );
}
