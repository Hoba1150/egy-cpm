"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft, Wallet, ShieldCheck, Plus } from "lucide-react";
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

  const walletTotal = currentUser?.wallet?.totalAvailable ?? 0;

  return (
    <section className="relative pt-3 pb-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full space-y-4">
        {/* 1. Prominent User Wallet Card in Hero (Orange / Dark Theme) */}
        <div className="rounded-xl bg-[#12161f] border border-orange-500/30 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/40 text-orange-500 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block font-medium">
                {currentUser ? `مرحباً بك، ${currentUser.name}` : "رصيد المحفظة المتاح للتسوق"}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-2xl font-black text-orange-500 font-mono">
                  {formatCurrency(walletTotal)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              href="/deposit"
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>شحن رصيد</span>
            </Link>
            <Link
              href="/shop"
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[#1a202c] hover:bg-[#232b3b] text-white border border-gray-700 font-bold text-xs transition text-center"
            >
              تصفح المنتجات
            </Link>
          </div>
        </div>

        {/* 2. Main Action Header & Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 text-right space-y-3">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
              <span>{settings.hero_badge || "متجر كار باركينج الرسمي"}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {settings.store_name || "EGY CPM"}{" "}
              <span className="text-orange-500 block sm:inline mt-1 sm:mt-0">
                {settings.hero_title || "لخدمات وسيارات اللعبة"}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
              {settings.hero_description || "أقوى تشكيلة سيارات معدلة 1695HP، سيارات رسم مميزة، وخدمات شحن كاش وكوينز سريعة وآمنة 100%."}
            </p>
          </div>

          {/* Clean Orange Slider Showcase */}
          <div className="lg:col-span-6">
            <div className="rounded-xl bg-[#12161f] border border-gray-800 p-3 text-right">
              {/* Top Slider Control Header */}
              <div className="flex items-center justify-between mb-2.5 border-b border-gray-800 pb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  <span className="text-xs font-bold text-white truncate">
                    {currentProduct.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={prevSlide}
                    className="p-1 rounded bg-[#1a202c] hover:bg-gray-700 text-gray-300"
                    aria-label="السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono text-gray-400 px-1">
                    {currentIndex + 1}/{slides.length}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="p-1 rounded bg-[#1a202c] hover:bg-gray-700 text-gray-300"
                    aria-label="التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Image */}
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black mb-2.5">
                <img
                  src={displayImage}
                  alt={currentProduct.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {currentProduct.discountPercent && currentProduct.discountPercent > 0 && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-orange-600 text-white text-[10px] font-bold">
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
                    <span className="text-base font-black text-orange-500 font-mono">
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
                  className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs transition flex items-center gap-1"
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
