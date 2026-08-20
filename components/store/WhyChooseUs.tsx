import React from "react";
import { ShieldCheck, Zap, Wallet, Headphones, Award, Sparkles } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      title: "ضمان أمان وحظر 100%",
      description: "نستخدم طرق شحن وتعديل رسمية ومحمية برمجياً بنسبة 100% دون أي خطر للباند على حسابك.",
      icon: ShieldCheck,
      color: "border-cyan-500/30 text-neon-cyan shadow-glow-cyan-sm",
    },
    {
      title: "تسليم فوري وسريع",
      description: "فريق عمل متخصص على مدار 24 ساعة لتنفيذ طلبات الشحن وتسليم السيارات في دقائق معدودة.",
      icon: Zap,
      color: "border-purple-500/30 text-neon-purple shadow-glow-purple",
    },
    {
      title: "نظام محفظة إلكترونية آمن",
      description: "اشحن محفظتك بسهولة عبر فودافون كاش، أورنج، اتصالات، أو وي باي واستمتع بالشراء الفوري.",
      icon: Wallet,
      color: "border-green-500/30 text-neon-green shadow-glow-green",
    },
    {
      title: "دعم فني وتذاكر 24/7",
      description: "مركز دعم ومساعدة متكامل للرد على أي استفسارات وحل أي مشكلة تواجهك فورياً.",
      icon: Headphones,
      color: "border-amber-500/30 text-neon-amber shadow-glow-amber",
    },
    {
      title: "تعديلات حصرية ومحركات W16",
      description: "أقوى تظبيطات الدريفت والدراج والسرعة وتصاميم فينيل ورسم لا تجدها في أي متجر آخر.",
      icon: Sparkles,
      color: "border-pink-500/30 text-neon-pink",
    },
    {
      title: "أفضل وأوفر الأسعار",
      description: "خصومات وعروض متجددة يومياً وكوبونات تخفيض مع نظام رصيد هدايا مجاني للعملاء المميزين.",
      icon: Award,
      color: "border-blue-500/30 text-neon-blue",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-right relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-mono font-bold text-neon-cyan uppercase tracking-widest">
          لماذا متجر CPM GARAGE ؟
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          المتجر المعتمد والمفضل للاعبي Car Parking
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          نقدم تجربة استثنائية تجمع بين الأمان الفائق، السرعة الصاروخية، وأعلى جودة في السيارات والتعديلات.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-garage-900/80 border border-gray-800 hover:border-gray-700 transition duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-garage-850 border flex items-center justify-center ${f.color} group-hover:scale-110 transition duration-300`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white group-hover:text-neon-cyan transition">
                  {f.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
