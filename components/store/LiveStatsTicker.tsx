import React from "react";
import { Users, CheckCircle2, ShieldCheck, Clock } from "lucide-react";

export default function LiveStatsTicker() {
  const stats = [
    { label: "لاعب و عميل سعيد", value: "+15,000", icon: Users, color: "text-neon-cyan" },
    { label: "طلب مكتمل وناجح", value: "+28,500", icon: CheckCircle2, color: "text-neon-green" },
    { label: "متوسط وقت التسليم", value: "8 دقائق", icon: Clock, color: "text-neon-purple" },
    { label: "حماية وضمان أمان", value: "100%", icon: ShieldCheck, color: "text-neon-amber" },
  ];

  return (
    <section className="py-6 border-y border-cyan-500/20 bg-[#090c12]/80 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-garage-850/50 border border-gray-800/60 text-right"
              >
                <div className={`p-2.5 rounded-xl bg-black/40 border border-gray-800 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className={`block text-lg sm:text-2xl font-black font-mono ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
