import React from "react";
import { getProducts } from "@/lib/actions/product";
import ProductCard from "@/components/store/ProductCard";
import Link from "next/link";
import { Car, Flame, Palette, Sparkles, Gauge, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CarsPage() {
  const [
    modifiedCars,
    drawnCars,
    realisticCars,
    limitedCars,
    stockCars,
  ] = await Promise.all([
    getProducts({ productType: "MODIFIED_CAR", limit: 4 }),
    getProducts({ productType: "DRAWN_CAR", limit: 4 }),
    getProducts({ productType: "REALISTIC_LOGO_CAR", limit: 4 }),
    getProducts({ productType: "LIMITED_CAR", limit: 4 }),
    getProducts({ productType: "STOCK_CAR", limit: 4 }),
  ]);

  const carCategories = [
    { title: "سيارات معدلة وسرعة 1695HP", slug: "modified", icon: Gauge, count: modifiedCars.totalCount, color: "text-neon-cyan" },
    { title: "سيارات رسم وتصميمات خاصة (Drawn)", slug: "drawn", icon: Palette, count: drawnCars.totalCount, color: "text-neon-purple" },
    { title: "سيارات لوجوهات واقعية وPolice", slug: "realistic-logos", icon: Sparkles, count: realisticCars.totalCount, color: "text-neon-green" },
    { title: "سيارات نادرة ومحدودة (Limited)", slug: "limited", icon: Flame, count: limitedCars.totalCount, color: "text-neon-red" },
    { title: "سيارات ستوك وكلاسيك الأصلية", slug: "stock", icon: Car, count: stockCars.totalCount, color: "text-neon-amber" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-neon-cyan uppercase tracking-widest">
          Car Parking Multiplayer Fleet
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          كراج سيارات كار باركينج الخارقة
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          اختر من بين أضخم تشكيلة سيارات معدلة بقوة 1695 حصان، سيارات مرسومة بدقة Ultra HD، وسيارات البوليس والفليشر.
        </p>
      </div>

      {/* Sub-Category Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {carCategories.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              href={`/cars/${c.slug}`}
              className="p-4 rounded-2xl bg-garage-900/90 border border-gray-800 hover:border-cyan-500/50 hover:shadow-glow-cyan-sm transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-gray-400 font-mono">{c.count} سيارة</span>
                <div className={`p-2 rounded-xl bg-garage-850 border border-gray-700 ${c.color} group-hover:scale-110 transition`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-neon-cyan transition">
                {c.title}
              </h3>
            </Link>
          );
        })}
      </div>

      {/* 1. Modified Cars Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-neon-cyan" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              سيارات دريفت وسرعة معدلة (1695HP)
            </h2>
          </div>
          <Link href="/cars/modified" className="text-xs text-neon-cyan hover:underline">
            عرض المزيد ({modifiedCars.totalCount})
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modifiedCars.items.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </div>
      </section>

      {/* 2. Drawn Cars Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-neon-purple" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              سيارات رسم وتصميمات خاصة (Drawn & Vinyl)
            </h2>
          </div>
          <Link href="/cars/drawn" className="text-xs text-neon-purple hover:underline">
            عرض المزيد ({drawnCars.totalCount})
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {drawnCars.items.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </div>
      </section>

      {/* 3. Limited Cars Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-neon-red" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              سيارات حصرية ومحدودة الكمية (Limited)
            </h2>
          </div>
          <Link href="/cars/limited" className="text-xs text-neon-red hover:underline">
            عرض المزيد ({limitedCars.totalCount})
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {limitedCars.items.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </div>
      </section>
    </div>
  );
}
