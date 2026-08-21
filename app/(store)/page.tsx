import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { getRandomProducts } from "@/lib/actions/product";
import HeroSection from "@/components/store/HeroSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let user = null;
  let randomHeroProducts: any[] = [];

  try {
    const results = await Promise.allSettled([
      getCurrentUser(),
      getRandomProducts(6),
    ]);

    if (results[0].status === "fulfilled") user = results[0].value;
    if (results[1].status === "fulfilled") randomHeroProducts = results[1].value;
  } catch (err) {
    console.error("HomePage fetch error:", err);
  }

  return (
    <div className="pb-8 text-right">
      {/* 1. Ultra Fast Action Hero with Wallet Balance & Slider Only */}
      <HeroSection user={user} products={randomHeroProducts} />
    </div>
  );
}
