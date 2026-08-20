"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Tag, ShieldCheck, Zap, Loader2 } from "lucide-react";
import { validateCouponCode } from "@/lib/actions/coupon";
import { toast } from "sonner";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    getSubtotal,
    getDiscount,
    getTotal,
    clearCart,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidating(true);
    try {
      const res = await validateCouponCode(couponInput, subtotal);
      if (res.valid) {
        applyCoupon({
          code: res.code!,
          discountType: res.discountType as any,
          discountValue: res.discountValue!,
          discountAmount: res.discountAmount!,
        });
        toast.success(res.message);
        setCouponInput("");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("فشل التحقق من الكوبون.");
    } finally {
      setIsValidating(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-garage-900 border border-gray-800 mx-auto flex items-center justify-center text-gray-600">
          <ShoppingCart className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white">سلة التسوق فارغة</h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
            لم تقم بإضافة أي سيارات أو خدمات حتى الآن. تصفح أقسام المتجر واكتشف أقوى العروض!
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-extrabold text-sm shadow-glow-cyan hover:scale-105 transition"
        >
          <Zap className="w-4 h-4" />
          <span>تصفح المتجر الآن</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right space-y-8">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">عربة التسوق</h1>
          <p className="text-xs text-gray-400">{items.length} منتجات مضافة</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          <span>إفراغ السلة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="p-4 rounded-2xl bg-garage-900/90 border border-gray-800 hover:border-cyan-500/30 transition flex flex-col sm:flex-row items-center gap-4 group"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-xl object-cover border border-gray-800 shrink-0"
              />

              <div className="flex-1 min-w-0 text-center sm:text-right space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-neon-cyan transition">
                  {item.name}
                </h3>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-neon-green">
                  <span>{formatCurrency(item.price)}</span>
                  {item.originalPrice && (
                    <span className="text-gray-500 line-through text-[11px]">
                      {formatCurrency(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity & Delete */}
              <div className="flex items-center gap-4">
                {item.productType !== "ACCOUNT" && item.productType !== "UNIQUE_DIGITAL" && (
                  <div className="flex items-center border border-gray-700 rounded-xl bg-garage-850 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white font-mono">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <span className="text-sm font-extrabold text-white w-24 text-left">
                  {formatCurrency(item.price * item.quantity)}
                </span>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 text-gray-500 hover:text-red-400 transition"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-garage-900/90 border border-cyan-500/30 shadow-glow-cyan-sm space-y-6">
          <h3 className="text-lg font-bold text-white">ملخص الحساب</h3>

          {/* Coupon Code */}
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 absolute right-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="كود الخصم (CPM2026)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="w-full pl-3 pr-9 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isValidating || !couponInput.trim()}
              className="px-4 py-2.5 bg-cyan-500/20 text-neon-cyan border border-cyan-500/40 rounded-xl text-xs font-bold transition disabled:opacity-50"
            >
              {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "تطبيق"}
            </button>
          </form>

          {appliedCoupon && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-between text-xs text-neon-green">
              <span>كوبون فعال: <strong>{appliedCoupon.code}</strong> (-{formatCurrency(appliedCoupon.discountAmount)})</span>
              <button onClick={() => applyCoupon(null)} className="text-gray-400 hover:text-red-400">
                إزالة
              </button>
            </div>
          )}

          {/* Pricing breakdown */}
          <div className="space-y-2 pt-2 border-t border-gray-800 text-xs text-gray-300">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-neon-green">
                <span>خصم الكوبون:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-gray-800">
              <span>الإجمالي النهائي:</span>
              <span className="text-neon-cyan text-lg">{formatCurrency(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple text-black font-black text-center flex items-center justify-center gap-2 shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition"
          >
            <span>متابعة إتمام الطلب (Checkout)</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
