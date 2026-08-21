import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { getProducts, getCategories, getRandomProducts } from "@/lib/actions/product";
import HeroSection from "@/components/store/HeroSection";
import ProductCard from "@/components/store/ProductCard";
import Link from "next/link";
import { Sparkles, Car, ArrowLeft, Zap, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let user = null;
  let randomHeroProducts: any[] = [];
  let latestProductsRes: any = { items: [], totalCount: 0 };
  let categories: any[] = [];

  try {
    const results = await Promise.allSettled([
      getCurrentUser(),
      getRandomProducts(6),
      getProducts({ limit: 8, sortBy: "newest" }),
      getCategories(),
    ]);

    if (results[0].status === "fulfilled") user = results[0].value;
    if (results[1].status === "fulfilled") randomHeroProducts = results[1].value;
    if (results[2].status === "fulfilled") latestProductsRes = results[2].value;
    if (results[3].status === "fulfilled") categories = results[3].value;
  } catch (err) {
    console.error("HomePage data fetch error:", err);
  }

  return (
    <div className="space-y-10 pb-8 text-right">
      {/* 1. Ultra Clean Hero Section with Product Slider */}
      <HeroSection user={user} products={randomHeroProducts} />

      {/* 2. Compact Fast Trust Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-3 rounded-2xl bg-garage-900 border border-gray-800 text-center">
          <div className="p-2">
            <span className="block text-neon-green font-bold text-xs sm:text-sm">تسليم سريع</span>
            <span className="text-[11px] text-gray-400">خلال 5-15 دقيقة</span>
          </div>
          <div className="p-2 border-r border-gray-800">
            <span className="block text-neon-cyan font-bold text-xs sm:text-sm">أمان 100%</span>
            <span className="text-[11px] text-gray-400">ضمان كامل ضد الباند</span>
          </div>
          <div className="p-2 border-r border-gray-800">
            <span className="block text-neon-purple font-bold text-xs sm:text-sm">دفع فودافون كاش</span>
            <span className="text-[11px] text-gray-400">شحن فوري ومباشر</span>
          </div>
          <div className="p-2 border-r border-gray-800">
            <span className="block text-yellow-400 font-bold text-xs sm:text-sm">دعم فني</span>
            <span className="text-[11px] text-gray-400">متابعة مستمرة معك</span>
          </div>
        </div>
      </div>

      {/* 3. Category Quick Navigator */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <h2 className="text-lg sm:text-xl font-bold text-white">أقسام المتجر</h2>
            </div>
            <Link href="/shop" className="text-xs text-neon-cyan hover:underline flex items-center gap-1">
              <span>جميع المنتجات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.slug === "services" ? "/services" : cat.slug === "accounts" ? "/accounts" : `/cars/${cat.slug}`}
                className="p-3 rounded-xl bg-garage-900 border border-gray-800 hover:border-cyan-500/40 transition flex flex-col items-center justify-center text-center space-y-1.5"
              >
                <div className="w-9 h-9 rounded-lg bg-garage-850 border border-gray-700 flex items-center justify-center text-neon-cyan">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white truncate max-w-[120px]">
                    {cat.name.split("(")[0]}
                  </h3>
                  <span className="text-[10px] text-gray-400">
                    {cat._count?.products || 0} عنصر
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. Featured & Latest Products */}
      {latestProductsRes.items.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">أحدث المنتجات والسيارات</h2>
            <Link href="/shop" className="text-xs text-neon-cyan hover:underline flex items-center gap-1">
              <span>تصفح الكل ({latestProductsRes.totalCount})</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {latestProductsRes.items.map((prod: any) => (
              <ProductCard key={prod.id} product={prod as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
