"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Zap,
  ShieldCheck,
  ShoppingBag,
  Gauge,
  Flame,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Star,
  Tag,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface HeroSectionProps {
  user?: any;
  products?: any[];
}

const DEFAULT_SLIDES = [
  {
    id: "default-1",
    name: "BMW M8 W16 Police Mod",
    slug: "bmw-m8-competition-1695hp",
    price: 180,
    originalPrice: 240,
    discountPercent: 25,
    category: { name: "سيارات معدلة 1695HP" },
    imagesArray: ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800"],
    specs: { engine: "W16 Quad-Turbo", hp: "1695 HP Max", delivery: "فوري (10 د)" },
  },
  {
    id: "default-2",
    name: "Porsche 911 GT3 RS Drawn Vinyl",
    slug: "porsche-911-gt3-rs-anime-drawn",
    price: 220,
    originalPrice: 280,
    discountPercent: 21,
    category: { name: "سيارات رسم وفينيل" },
    imagesArray: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800"],
    specs: { engine: "Flat-6 Twin Turbo", hp: "1695 HP Beast", delivery: "فوري (5 د)" },
  },
  {
    id: "default-3",
    name: "Nissan GTR R35 Nismo Chrome",
    slug: "nissan-gtr-r35-nismo-godzilla",
    price: 160,
    originalPrice: 210,
    discountPercent: 23,
    category: { name: "سيارات معدلة 1695HP" },
    imagesArray: ["https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800"],
    specs: { engine: "VR38DETT Tuned", hp: "1695 HP Full", delivery: "فوري (10 د)" },
  },
];

export default function HeroSection({ user: initialUser, products = [] }: HeroSectionProps) {
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [settings, setSettings] = useState<Record<string, string>>({});

  const fetchLiveSession = () => {
    Promise.all([
      fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json()).catch(() => ({ user: null })),
      fetch("/api/settings", { cache: "no-store" }).then((r) => r.json()).catch(() => ({ settings: {} })),
    ]).then(([authData, settingsData]) => {
      if (authData.user) {
        setCurrentUser(authData.user);
      } else {
        setCurrentUser(null);
      }
      if (settingsData.settings) {
        setSettings(settingsData.settings);
      }
    });
  };

  useEffect(() => {
    fetchLiveSession();

    window.addEventListener("cpm_auth_changed", fetchLiveSession);
    window.addEventListener("focus", fetchLiveSession);

    return () => {
      window.removeEventListener("cpm_auth_changed", fetchLiveSession);
      window.removeEventListener("focus", fetchLiveSession);
    };
  }, []);

  const user = currentUser;

  // Prepare slider slides (dynamic store products or fallback)
  const slides = products && products.length > 0 ? products : DEFAULT_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-rotate slides every 4.5 seconds
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered, slides.length, currentIndex]);

  const currentProduct = slides[currentIndex] || slides[0];

  let displayImage = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800";
  if (currentProduct?.imagesArray && currentProduct.imagesArray.length > 0) {
    displayImage = currentProduct.imagesArray[0];
  } else if (currentProduct?.images) {
    try {
      const parsed = JSON.parse(currentProduct.images);
      displayImage = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      displayImage = currentProduct.images;
    }
  }

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Neon Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080b11]/80 to-[#06070a]" />

      {/* Cyber Grid & HUD Circles */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/10 -top-40 -right-40 animate-[spin_60s_linear_infinite]" />
      <div className="absolute w-[400px] h-[400px] rounded-full border border-purple-500/10 -bottom-20 -left-20 animate-[spin_40s_linear_infinite_reverse]" />

      <div className="relative max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 text-right space-y-6">
            {/* Garage HUD Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-neon-cyan text-xs font-bold shadow-glow-cyan-sm"
            >
              <Flame className="w-4 h-4 text-neon-cyan animate-pulse" />
              <span>{settings.hero_badge || "ورشة تعديل سيارات Racing Garage المستقبلية #1"}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight"
            >
              {settings.store_name || "EGY CPM"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green">
                {settings.hero_title || "خدمات وسيارات وتعديلات احترافية"}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed"
            >
              {settings.hero_description || "المتجر الأقوى لشراء سيارات دريفت وسرعة معدلة 1695HP، سيارات رسم وتصميمات نادرة، شحن أموال خضراء 50M وكوينز ذهبي وتفعيل الكينج رانك الملكي وحسابات جاهزة بتسليم فوري وضمان ضد الباند 100%."}
            </motion.p>

            {/* Live Wallet Snippet if logged in */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 rounded-2xl bg-garage-900/90 border border-cyan-500/30 flex items-center justify-between max-w-md shadow-glow-cyan-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-neon-cyan flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400">رصيدك المتاح للشراء:</span>
                    <h4 className="text-base font-extrabold text-neon-green font-mono">
                      {formatCurrency(user.wallet?.totalAvailable || 0)}
                    </h4>
                  </div>
                </div>
                <Link
                  href="/deposit"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-neon-green to-emerald-500 text-black font-bold text-xs hover:shadow-glow-green transition"
                >
                  شحن رصيد +
                </Link>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 pt-2"
            >
              <Link
                href="/cars"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-extrabold text-xs sm:text-sm shadow-glow-cyan hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4" />
                <span>Shop Cars (سيارات)</span>
              </Link>

              <Link
                href="/services"
                className="px-6 py-3.5 rounded-xl bg-garage-850 hover:bg-garage-750 border border-purple-500/40 text-neon-purple font-bold text-xs sm:text-sm shadow-glow-purple hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Account Services</span>
              </Link>

              <Link
                href="/accounts"
                className="px-5 py-3.5 rounded-xl bg-garage-900 hover:bg-garage-800 border border-gray-800 hover:border-gray-700 text-gray-200 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-neon-green" />
                <span>VIP Accounts</span>
              </Link>

              <Link
                href="/orders"
                className="px-5 py-3.5 rounded-xl bg-garage-900 hover:bg-garage-800 border border-gray-800 hover:border-gray-700 text-gray-200 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <span>My Orders (طلباتي)</span>
              </Link>
            </motion.div>
          </div>

          {/* DYNAMIC PRODUCT SLIDER / CAROUSEL */}
          <div
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative rounded-3xl bg-gradient-to-b from-garage-800/90 to-garage-950/90 border border-cyan-500/40 p-5 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden group">
              {/* Top Slider Header & Counter */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-neon-cyan font-mono text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>معرض منتجات المتجر</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-gray-400 bg-garage-900 px-2 py-0.5 rounded-lg border border-gray-800">
                    {currentIndex + 1} / {slides.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevSlide}
                      className="p-1 rounded-lg bg-garage-900 hover:bg-cyan-500/20 text-gray-300 hover:text-neon-cyan border border-gray-800 transition"
                      aria-label="المنتج السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-1 rounded-lg bg-garage-900 hover:bg-cyan-500/20 text-gray-300 hover:text-neon-cyan border border-gray-800 transition"
                      aria-label="المنتج التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Animated Slide Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProduct?.id || currentIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-60 sm:h-64 rounded-2xl overflow-hidden bg-black/50 border border-gray-800">
                    <img
                      src={displayImage}
                      alt={currentProduct?.name || "Product"}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Corner Tag */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      {currentProduct?.discountPercent > 0 && (
                        <span className="px-2.5 py-1 rounded-full bg-red-500 text-white font-black text-[10px] shadow-glow-red flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>خصم {currentProduct.discountPercent}%</span>
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full bg-black/70 border border-cyan-500/40 text-neon-cyan font-bold text-[10px] backdrop-blur-sm">
                        {currentProduct?.category?.name || "سيارات وتعديلات"}
                      </span>
                    </div>

                    {/* Product Overlay Info */}
                    <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between">
                      <div className="text-right flex-1 min-w-0 pr-2">
                        <span className="text-[10px] text-neon-cyan font-mono block truncate">
                          {currentProduct?.category?.name || "EGY CPM EXCLUSIVE"}
                        </span>
                        <h3 className="text-base font-extrabold text-white truncate">
                          {currentProduct?.name}
                        </h3>
                      </div>
                      <div className="text-left shrink-0">
                        {currentProduct?.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                          <span className="text-xs text-gray-400 line-through block font-mono">
                            {formatCurrency(currentProduct.originalPrice)}
                          </span>
                        )}
                        <span className="block text-lg font-black text-neon-green font-mono">
                          {formatCurrency(currentProduct?.price || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Spec Mini Badges Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-garage-900 border border-gray-800">
                      <span className="block text-[10px] text-gray-400">التصنيف</span>
                      <span className="text-xs font-bold text-neon-cyan truncate block">
                        {currentProduct?.category?.name?.split("(")[0] || "سيارة"}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-garage-900 border border-gray-800">
                      <span className="block text-[10px] text-gray-400">الضمان</span>
                      <span className="text-xs font-bold text-neon-purple">ضد الباند 100%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-garage-900 border border-gray-800">
                      <span className="block text-[10px] text-gray-400">التسليم</span>
                      <span className="text-xs font-bold text-neon-green">
                        {currentProduct?.deliveryTimeMinutes ? `${currentProduct.deliveryTimeMinutes} دقيقة` : "فوري (5-10 د)"}
                      </span>
                    </div>
                  </div>

                  {/* CTA Action Button */}
                  <Link
                    href={`/product/${currentProduct?.slug}`}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan via-cyan-400 to-neon-blue text-black font-extrabold text-xs text-center flex items-center justify-center gap-2 hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition"
                  >
                    <span>عرض تفاصيل وشراء المنتج</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Slider Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 pt-3 mt-1 border-t border-gray-800/80">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-6 bg-neon-cyan shadow-glow-cyan-sm" : "w-1.5 bg-gray-700 hover:bg-gray-500"
                    }`}
                    aria-label={`شريحة ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
