import React from "react";
import { getProducts } from "@/lib/actions/product";
import ProductCard from "@/components/store/ProductCard";
import { Shield, Sparkles, Key, CheckCircle2, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const accountsRes = await getProducts({
    productType: "ACCOUNT",
    limit: 24,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/60 via-garage-900 to-indigo-950/60 border border-purple-500/40 p-6 sm:p-10 shadow-glow-purple overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/20 border border-purple-500/40 text-neon-purple text-xs font-bold">
            <Key className="w-3.5 h-3.5" />
            <span>حسابات جاهزة VIP - تسليم فوري لبيانات الحساب</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            سوق حسابات لعبة Car Parking الجاهزة
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            امتلك حساباً متكاملاً يحتوي على جميع سيارات اللعبة معدلة 1695HP، سيارات بوليس وفليشر، 50 مليون كاش أخضر، 40 ألف كوينز، وكينج رانك دائم مع إمكانية تغيير الإيميل والباسورد فوراً.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-300">
            <span className="flex items-center gap-1 text-neon-green font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>تسليم فوري ومباشر بعد الدفع</span>
            </span>
            <span className="flex items-center gap-1 text-neon-purple font-bold">
              <Lock className="w-4 h-4" />
              <span>إمكانية نقل وتغيير بيانات الحساب بالكامل</span>
            </span>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-purple" />
            <span>الحسابات الجاهزة المتاحة للبيع ({accountsRes.totalCount})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountsRes.items.map((acc) => (
            <ProductCard key={acc.id} product={acc as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
