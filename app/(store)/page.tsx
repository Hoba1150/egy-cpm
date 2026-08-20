import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { getProducts, getCategories, getRandomProducts } from "@/lib/actions/product";
import HeroSection from "@/components/store/HeroSection";
import LiveStatsTicker from "@/components/store/LiveStatsTicker";
import ProductCard from "@/components/store/ProductCard";
import WhyChooseUs from "@/components/store/WhyChooseUs";
import HowItWorks from "@/components/store/HowItWorks";
import CustomerReviewsCarousel from "@/components/store/CustomerReviewsCarousel";
import FAQSection from "@/components/store/FAQSection";
import Link from "next/link";
import { Flame, Sparkles, Car, Zap, ArrowLeft, ShieldCheck, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  const [randomHeroProducts, featuredCarsRes, popularServicesRes, latestProductsRes, categories] = await Promise.all([
    getRandomProducts(6),
    getProducts({ isFeatured: true, limit: 4 }),
    getProducts({ categorySlug: "services", limit: 4 }),
    getProducts({ limit: 8, sortBy: "newest" }),
    getCategories(),
  ]);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Dynamic Hero Section with Random Product Slider */}
      <HeroSection user={user} products={randomHeroProducts} />

      {/* 2. Live Stats Ticker */}
      <LiveStatsTicker />

      {/* 3. Category Quick Navigator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-cyan" />
            <h2 className="text-xl sm:text-2xl font-black text-white">تصفح أقسام المتجر</h2>
          </div>
          <Link href="/shop" className="text-xs text-neon-cyan hover:underline flex items-center gap-1">
            <span>جميع المنتجات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.slug === "services" ? "/services" : cat.slug === "accounts" ? "/accounts" : `/cars/${cat.slug}`}
              className="p-3.5 rounded-2xl bg-garage-900/90 border border-gray-800 hover:border-cyan-500/50 hover:shadow-glow-cyan-sm transition duration-300 flex flex-col items-center justify-center text-center space-y-2 group"
            >
              <div className="w-12 h-12 rounded-xl bg-garage-850 border border-gray-700 flex items-center justify-center text-neon-cyan group-hover:scale-110 group-hover:bg-cyan-500/10 transition duration-300">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-neon-cyan transition truncate max-w-[130px]">
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

      {/* 4. Featured Cars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neon-cyan text-xs font-mono font-bold">
              <Flame className="w-4 h-4 text-neon-cyan" />
              <span>وحوش السرعة والدريفت 1695HP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              السيارات المميزة (Featured Cars)
            </h2>
          </div>
          <Link
            href="/cars"
            className="px-4 py-2 rounded-xl bg-garage-850 hover:bg-garage-800 border border-cyan-500/30 text-neon-cyan text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>شاهد كل السيارات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCarsRes.items.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </div>
      </section>

      {/* 5. Special Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-950 via-garage-900 to-cyan-950 border border-purple-500/40 p-6 sm:p-10 shadow-glow-purple overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-right">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/20 border border-purple-500/40 text-neon-purple text-xs font-bold">
                <Tag className="w-3.5 h-3.5" />
                <span>عرض الموسم الحصري</span>
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white">
                خصم 15% على جميع التعديلات والحسابات
              </h3>
              <p className="text-xs sm:text-sm text-gray-300">
                استخدم كود الخصم <strong className="text-neon-cyan bg-black/40 px-2 py-0.5 rounded font-mono">CPM2026</strong> عند الدفع للحصول على خصم إضافي فوري على إجمالي سلتك.
              </p>
            </div>

            <Link
              href="/shop"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-extrabold text-sm shadow-glow-purple hover:scale-105 transition shrink-0"
            >
              تسوق العروض الآن
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Popular Account Recharge Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neon-green text-xs font-mono font-bold">
              <Zap className="w-4 h-4 text-neon-green" />
              <span>شحن فوري ومضمون 100%</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              خدمات الحساب والشحن (Popular Services)
            </h2>
          </div>
          <Link
            href="/services"
            className="px-4 py-2 rounded-xl bg-garage-850 hover:bg-garage-800 border border-green-500/30 text-neon-green text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>جميع خدمات الشحن</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServicesRes.items.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </div>
      </section>

      {/* 7. Latest Products Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <span className="text-xs font-mono text-neon-purple font-bold">أحدث الإضافات</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">أحدث المنتجات والتعديلات</h2>
          </div>
          <Link href="/shop" className="text-xs text-neon-cyan hover:underline flex items-center gap-1">
            <span>تصفح الكل ({latestProductsRes.totalCount})</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProductsRes.items.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </div>
      </section>

      {/* 8. Why Choose Us */}
      <WhyChooseUs />

      {/* 9. How It Works */}
      <HowItWorks />

      {/* 10. Customer Reviews */}
      <CustomerReviewsCarousel />

      {/* 11. FAQ Section */}
      <FAQSection />
    </div>
  );
}
