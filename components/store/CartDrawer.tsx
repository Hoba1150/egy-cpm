"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Tag, ShieldCheck, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { validateCouponCode } from "@/lib/actions/coupon";
import { toast } from "sonner";
import Image from "next/image";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
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
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
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
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    applyCoupon(null);
    toast.info("تمت إزالة الكوبون.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 pr-0">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#0b0e14] border-r border-cyan-500/30 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green" />

              {/* Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-garage-900/60">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-neon-cyan border border-cyan-500/30">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">سلة المشتريات</h3>
                    <p className="text-xs text-gray-400">{items.length} منتجات في السلة</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      title="إفراغ السلة"
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800/60 rounded-lg transition text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-garage-850 border border-gray-800 flex items-center justify-center text-gray-600">
                      <ShoppingCart className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">سلتك فارغة حالياً</h4>
                      <p className="text-xs text-gray-400 max-w-xs">
                        تصفح أحدث سيارات الدريفت والسرعة وخدمات شحن الحساب وأضف ما يناسبك!
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold text-sm shadow-glow-cyan hover:scale-105 transition"
                    >
                      تصفح المنتجات الآن
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3 rounded-xl bg-garage-850 border border-gray-800/80 hover:border-cyan-500/30 transition flex gap-3 group relative overflow-hidden"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-20 h-20 rounded-lg bg-garage-900 overflow-hidden shrink-0 border border-gray-800">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-neon-cyan transition">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-neon-green">
                              {formatCurrency(item.price)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-[10px] text-gray-500 line-through">
                                {formatCurrency(item.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
                          {item.productType === "ACCOUNT" || item.productType === "UNIQUE_DIGITAL" ? (
                            <span className="text-[10px] text-neon-purple font-semibold">
                              عنصر رقمي فريد (1 فقط)
                            </span>
                          ) : (
                            <div className="flex items-center border border-gray-700 rounded-lg bg-garage-900 overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 transition"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 transition"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-gray-500 hover:text-red-400 transition p-1"
                            title="حذف من السلة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Checkout & Summary */}
              {items.length > 0 && (
                <div className="p-4 border-t border-gray-800 bg-garage-900/90 space-y-3">
                  {/* Coupon Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute right-3 top-3 text-gray-500" />
                      <input
                        type="text"
                        placeholder="كود الخصم (مثال: CPM2026)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full pl-3 pr-9 py-2 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isValidatingCoupon || !couponInput.trim()}
                      className="px-4 py-2 bg-gray-800 hover:bg-cyan-500/20 text-neon-cyan border border-cyan-500/30 hover:border-cyan-500 rounded-xl text-xs font-bold transition disabled:opacity-50"
                    >
                      {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "تطبيق"}
                    </button>
                  </form>

                  {/* Applied Coupon Pill */}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-neon-green">
                      <span>كوبون مفعّل: <strong>{appliedCoupon.code}</strong> (-{formatCurrency(appliedCoupon.discountAmount)})</span>
                      <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-800 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>المجموع الفرعي:</span>
                      <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-neon-green">
                        <span>الخصم المطبق:</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-800">
                      <span>الإجمالي المطلوب:</span>
                      <span className="text-neon-cyan text-base font-extrabold">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple text-black font-extrabold text-center block shadow-glow-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] active:scale-[0.98] transition flex items-center justify-center gap-2"
                  >
                    <span>متابعة إتمام الدفع</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
                    <span>الدفع الفوري والآمن عبر رصيد المحفظة</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
