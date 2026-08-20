"use client";

import React, { useState } from "react";
import { ShoppingCart, Zap, Star, ShieldCheck, Clock, Check, Plus, Minus, Flame, Share2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { submitProductReview } from "@/lib/actions/review";

interface ProductDetailsClientProps {
  product: any;
  user?: any;
}

export default function ProductDetailsClient({ product, user }: ProductDetailsClientProps) {
  const router = useRouter();
  const { addItem, setIsOpen } = useCartStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const images = product.imagesArray || [product.images];
  const currentImage = images[activeImageIndex] || images[0];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: currentImage,
      productType: product.productType,
      deliveryTimeMinutes: product.deliveryTimeMinutes,
      serviceRequirements: product.serviceRequirements,
    }, quantity);

    setIsAdded(true);
    toast.success(`تمت إضافة "${product.name}" (${quantity}) إلى السلة!`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: currentImage,
      productType: product.productType,
      deliveryTimeMinutes: product.deliveryTimeMinutes,
      serviceRequirements: product.serviceRequirements,
    }, quantity);

    router.push("/checkout");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ رابط المنتج للمشاركة!");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("يجب تسجيل الدخول لإضافة تقييم.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await submitProductReview({
        productId: product.id,
        rating,
        comment,
      });
      toast.success("شكراً لك! تم نشر تقييمك بنجاح ⭐");
      setShowReviewForm(false);
      setComment("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "فشل إرسال التقييم.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Right Column: Image Gallery (Mobile/Desktop) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Display Image */}
        <div className="relative aspect-[16/10] rounded-3xl bg-garage-950 border border-cyan-500/30 overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.15)] group">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
            {product.discountPercent > 0 && (
              <span className="px-3 py-1 rounded-xl bg-neon-red text-white font-black text-xs shadow-glow-red flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>خصم {product.discountPercent}%</span>
              </span>
            )}
            {product.isFeatured && (
              <span className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-neon-cyan font-bold text-xs">
                مميز ⭐
              </span>
            )}
          </div>

          <button
            onClick={handleShare}
            className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-gray-700 transition"
            title="مشاركة المنتج"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                  activeImageIndex === idx
                    ? "border-neon-cyan shadow-glow-cyan-sm scale-105"
                    : "border-gray-800 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Left Column: Product Purchasing & Specs */}
      <div className="lg:col-span-5 space-y-6">
        {/* Category & Rating */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neon-cyan uppercase font-mono px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            {product.category?.name || "سيارات وتعديلات"}
          </span>

          <div className="flex items-center gap-1.5 text-neon-amber">
            <Star className="w-4 h-4 fill-neon-amber" />
            <span className="text-sm font-bold text-white">{product.avgRating || 5.0}</span>
            <span className="text-xs text-gray-400">({product.reviewCount || 0} تقييم)</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          {product.name}
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          {product.description}
        </p>

        {/* Key Features Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-garage-900 border border-gray-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon-cyan" />
            <span>تسليم: <strong>{product.deliveryTimeMinutes || 10} دقائق</strong></span>
          </div>
          <div className="p-2.5 rounded-xl bg-garage-900 border border-gray-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neon-green" />
            <span>حماية: <strong>ضد الباند 100%</strong></span>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="p-5 rounded-2xl bg-garage-900 border border-cyan-500/30 shadow-glow-cyan-sm space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-gray-400">السعر الإجمالي:</span>
            <div className="text-left">
              <span className="text-2xl sm:text-3xl font-black text-neon-green">
                {formatCurrency(product.price * quantity)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="block text-xs text-gray-500 line-through">
                  {formatCurrency(product.originalPrice * quantity)}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector (for standard items) */}
          {product.productType !== "ACCOUNT" && product.productType !== "UNIQUE_DIGITAL" && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
              <span className="text-xs text-gray-300">الكمية:</span>
              <div className="flex items-center border border-gray-700 rounded-xl bg-garage-850 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-white font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className={`py-3.5 px-4 rounded-xl border font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                isAdded
                  ? "bg-green-500/20 border-green-500 text-neon-green"
                  : "bg-garage-800 hover:bg-garage-750 border-gray-700 text-white hover:border-cyan-500"
              }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4 text-neon-cyan" />}
              <span>{isAdded ? "تمت الإضافة للسلة" : "إضافة إلى السلة"}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple text-black font-extrabold text-xs sm:text-sm shadow-glow-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>شراء الآن (Checkout)</span>
            </button>
          </div>
        </div>

        {/* Review Trigger Button */}
        <div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full py-2.5 rounded-xl bg-garage-850 border border-gray-800 text-xs font-bold text-gray-300 hover:text-neon-cyan transition flex items-center justify-center gap-2"
          >
            <Star className="w-3.5 h-3.5 text-neon-amber" />
            <span>كتابة تقييم وتجربة لهذا المنتج</span>
          </button>

          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mt-3 p-4 rounded-2xl bg-garage-900 border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">اختر عدد النجوم:</span>
                <div className="flex items-center gap-1 text-neon-amber">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? "fill-neon-amber" : "text-gray-600"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="اكتب رأيك وتجربتك بالتفصيل..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full p-3 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:border-neon-cyan text-right"
              />

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-2 bg-gradient-to-r from-neon-green to-emerald-500 text-black font-bold text-xs rounded-xl hover:shadow-glow-green transition disabled:opacity-50"
              >
                {isSubmittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
