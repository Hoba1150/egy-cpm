import React from "react";
import { UserCheck, Wallet, ShoppingCart, CheckCircle2, ArrowLeft } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "دخول Google فوري",
      desc: "سجل دخولك بنقرة واحدة بحساب Google (Gmail) وسيتم إنشاء حسابك ومحفظتك تلقائياً.",
      icon: UserCheck,
      color: "text-neon-cyan border-cyan-500/30",
    },
    {
      num: "02",
      title: "شحن رصيد المحفظة",
      desc: "حول المبلغ المطلوب عبر فودافون كاش أو أورنج أو اتصالات لرقمنا 01288212101 وارفع الإثبات.",
      icon: Wallet,
      color: "text-neon-green border-green-500/30",
    },
    {
      num: "03",
      title: "اختر طلبك وأكد الشراء",
      desc: "تصفح السيارات والخدمات، أضف لسلة الشراء وادفع بضغطة زر مباشرة من رصيد محفظتك.",
      icon: ShoppingCart,
      color: "text-neon-purple border-purple-500/30",
    },
    {
      num: "04",
      title: "استلام فوري داخل اللعبة",
      desc: "يقوم فريق المتخصصين بتسليم السيارة أو شحن الحساب في غضون 5 إلى 15 دقيقة مع تتبع مباشر.",
      icon: CheckCircle2,
      color: "text-neon-amber border-amber-500/30",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-right relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-mono font-bold text-neon-green uppercase tracking-widest">
          خطوات الشراء والتسليم
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          كيف يعمل متجر CPM GARAGE ؟
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          4 خطوات بسيطة وسريعة تفصلك عن أقوى تعديلات وسيارات كار باركينج
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-garage-900/90 border border-gray-800 relative group overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black font-mono text-gray-700 group-hover:text-neon-cyan transition duration-300">
                  {step.num}
                </span>
                <div className={`p-3 rounded-xl bg-garage-850 border ${step.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-neon-cyan transition">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
