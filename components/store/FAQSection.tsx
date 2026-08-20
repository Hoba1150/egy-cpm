"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "كيف أستلم السيارة أو الخدمة بعد الدفع؟",
      a: "بمجرد إتمام الدفع من رصيد محفظتك، يظهر لك رقم الطلب وتتبعه مباشرة في صفحة 'تتبع الطلب'. يقوم فريقنا بتسليم السيارة لك داخل سيرفر خاص باللعبة أو شحن حسابك في غضون 5 إلى 15 دقيقة فقط.",
    },
    {
      q: "هل الشحن والسيارات آمنة 100% ضد الباند؟",
      a: "نعم، 100% بدون أي ريسك. جميع تعديلات السيارات، الأموال الخضراء، الكوينز، والكينج رانك تتم بطرق برمجية متوافقة بالكامل مع قواعد سيرفرات اللعبة لضمان سلامة حسابك بشكل دائم.",
    },
    {
      q: "كيف أقوم بشحن رصيد المحفظة عبر فودافون كاش؟",
      a: "توجه إلى صفحة 'شحن المحفظة' وانسخ رقم الكاش المعتمد (01288212101)، ثم قم بتحويل المبلغ من محفظتك (فودافون كاش، أورنج، اتصالات، أو وي باي) واملأ نموذج الإيداع برقم هاتفك واسمك وصورة إثبات التحويل. سيقوم الأدمن بتأكيد الإيداع وإضافة الرصيد فوراً.",
    },
    {
      q: "ماذا لو كان رصيد المحفظة غير كافٍ عند إتمام الشراء؟",
      a: "سيظهر لك تنبيه فوري بأن الرصيد غير كافٍ مع زر مباشر لنقلك لصفحة شحن المحفظة. بمجرد شحن رصيدك وتأكيده يمكنك العودة للسلة وإتمام الشراء بنقرة واحدة.",
    },
    {
      q: "هل يمكنني استرجاع أموالي إذا حدثت أي مشكلة؟",
      a: "نعم بالتأكيد! إذا تعذر تنفيذ أي خدمة أو تم إلغاء الطلب من قِبل الإدارة، يتم استرجاع المبلغ بالكامل فورياً إلى رصيد محفظتك مع إشعار رسمي وتوثيق العملية في سجل معاملاتك.",
    },
    {
      q: "كيف أحصل على كود خصم أو رصيد هدية؟",
      a: "نوفر كوبونات خصم دائمة مثل CPM2026. كما نمنح رصيد هدايا مجاني (Gift Balance) للعملاء النشطين وفي المناسبات، ويتم إشعارك فورياً عند إضافة أي هدية لمحفظتك.",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-right relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-mono font-bold text-neon-cyan uppercase tracking-widest flex items-center justify-center gap-1">
          <HelpCircle className="w-4 h-4 text-neon-cyan" />
          <span>الأسئلة الشائعة</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          كل ما تحتاج معرفته عن الشراء والتسليم
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-garage-900/90 border border-gray-800 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-right gap-4 hover:text-neon-cyan transition"
              >
                <span className="font-bold text-sm sm:text-base text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-neon-cyan" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-gray-800/60">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
