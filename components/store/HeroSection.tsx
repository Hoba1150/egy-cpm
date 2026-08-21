"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft, Flame, Sparkles, Zap, ShieldCheck } from "lucide-react";
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
    specs: { engine: "W16", hp: "1695 HP", delivery: "فوري (10 د)" },
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
    specs: { engine: "Flat-6", hp: "1695 HP", delivery: "فوري (5 د)" },
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
    specs: { engine: "VR38", hp: "1695 HP", delivery: "فوري (10 د)" },
  },
];

export default function HeroSection({ user, products = [] }: HeroSectionProps) {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const slides = products && products.length > 0 ? products : DEFAULT_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, currentIndex]);

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
    <section className="relative pt-4 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 text-right space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-neon-cyan text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.hero_badge || "متجر كار باركينج الاحترافي #1"}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {settings.store_name || "EGY CPM"}{" "}
              <span className="text-neon-cyan block sm:inline mt-1 sm:mt-0">
                {settings.hero_title || "لسيارات وخدمات اللعبة"}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
              {settings.hero_description || "أقوى تشكيلة سيارات معدلة 1695HP، سيارات رسم مميزة، وخدمات شحن كاش وكوينز سريعة وآمنة 100%."}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="px-6 py-3 rounded-xl bg-neon-cyan text-black font-extrabold text-xs sm:text-sm hover:opacity-90 transition"
              >
                تصفح المنتجات
              </Link>
              <Link
                href="/deposit"
                className="px-5 py-3 rounded-xl bg-garage-850 text-white font-bold text-xs sm:text-sm border border-gray-700 hover:border-cyan-500/50 transition"
              >
                شحن المحفظة
              </Link>
            </div>
          </div>

          {/* Lightweight Clean Product Showcase Slider */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-garage-900 border border-gray-800 p-3 sm:p-4 text-right">
              {/* Top Slider Control Header */}
              <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neon-green" />
                  <span className="text-xs font-bold text-white truncate max-w-[200px]">
                    {currentProduct.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevSlide}
                    className="p-1 rounded-lg bg-garage-850 hover:bg-gray-700 text-gray-300"
                    aria-label="السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono text-gray-400 px-1">
                    {currentIndex + 1}/{slides.length}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="p-1 rounded-lg bg-garage-850 hover:bg-gray-700 text-gray-300"
                    aria-label="التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Image */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-garage-950 mb-3">
                <img
                  src={displayImage}
                  alt={currentProduct.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {currentProduct.discountPercent && currentProduct.discountPercent > 0 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">
                    خصم {currentProduct.discountPercent}%
                  </span>
                )}
              </div>

              {/* Product Action & Price */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">
                    {currentProduct.category?.name || "سيارات وخدمات"}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-black text-neon-cyan font-mono">
                      {formatCurrency(currentProduct.price)}
                    </span>
                    {currentProduct.originalPrice && (
                      <span className="text-xs text-gray-500 line-through font-mono">
                        {formatCurrency(currentProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/product/${currentProduct.slug}`}
                  className="px-4 py-2 rounded-xl bg-neon-cyan text-black font-bold text-xs hover:opacity-90 transition flex items-center gap-1"
                >
                  <span>عرض التفاصيل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
