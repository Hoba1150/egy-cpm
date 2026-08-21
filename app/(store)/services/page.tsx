import React from "react";
import { getProducts } from "@/lib/actions/product";
import ProductCard from "@/components/store/ProductCard";
import { Zap, ShieldCheck, Clock, Flame, Sparkles } from "lucide-react";

import { getStoreSettings } from "@/lib/actions/settings";
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const servicesRes = await getProducts({
    productType: "SERVICE",
    limit: 24,
  });

  const settings: Record<string, string> = await getStoreSettings().catch(() => ({}));
  const pageTitle = settings.page_services_title || "خدمات الشحن وزيادة الرتبة";
  const pageDesc = settings.page_services_desc || "خدمات شحن الكاش وزيادة الرتبة في Car Parking بأسرع تسليم";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-green-950/60 via-garage-900 to-cyan-950/60 border border-green-500/30 p-6 sm:p-10  overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>شحن مباشر وسريع في 5-15 دقيقة فقط</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">{pageTitle}</h1>
          <p className="text-xs sm:text-sm text-gray-400">{pageDesc}</p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-300">
            <span className="flex items-center gap-1 text-green-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>أمان 100% بدون أي باند</span>
            </span>
            <span className="flex items-center gap-1 text-orange-500 font-bold">
              <Clock className="w-4 h-4" />
              <span>تسليم سريع ومباشر</span>
            </span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span>باقات الشحن والخدمات المتاحة ({servicesRes.totalCount})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesRes.items.map((service) => (
            <ProductCard key={service.id} product={service as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
