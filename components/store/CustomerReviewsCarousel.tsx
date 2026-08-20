import React from "react";
import { Star, ShieldCheck, Quote } from "lucide-react";

export default function CustomerReviewsCarousel() {
  const reviews = [
    {
      name: "عمر الراجحي",
      badge: "مشتري معتمد 👑",
      car: "BMW M8 1695HP Police Mod",
      rating: 5,
      comment: "أقسم بالله أفضل متجر في كار باركينج! طلبت بي إم دبليو M8 واستلمتها في أقل من 7 دقائق والسيارة طيارة في سباق الدراج! شكراً لكم 🔥",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120",
    },
    {
      name: "كريم الزهراني",
      badge: "مشتري معتمد ⭐",
      car: "شحن 50 مليون كاش + كينج رانك",
      rating: 5,
      comment: "شحنت 50 مليون وتفعيل الكينج رانك الملكي، الحساب بقى أسطوري والتسليم كان فوري بدون أي تأخير وأمان تام.",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120",
    },
    {
      name: "يوسف المهدي",
      badge: "مشتري معتمد 🏎️",
      car: "Nissan Skyline GT-R R34 Paul Walker",
      rating: 5,
      comment: "تفاصيل رسمة سكايلاين بول ووكر تحفة فنية حقيقية لا توصف! متجر ثقة وسريع جداً في الرد والدعم الفني محترم للغاية.",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-right relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-mono font-bold text-neon-purple uppercase tracking-widest">
          آراء وتقييمات اللاعبين
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          تجارب حقيقية لعملائنا في السيرفرات
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          أكثر من 15 ألف لاعب يثقون في متجر CPM GARAGE لتعديل وشحن سياراتهم
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-garage-900/90 border border-gray-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition shadow-inner group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-neon-amber">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-neon-amber" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-gray-700 group-hover:text-neon-cyan transition" />
            </div>

            <p className="text-xs text-gray-300 leading-relaxed italic">
              &quot;{r.comment}&quot;
            </p>

            <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{r.name}</h4>
                  <span className="text-[10px] text-neon-green flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{r.badge}</span>
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-gray-500 max-w-[100px] truncate">
                {r.car}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
