"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Zap, Star, ShieldCheck, Clock, Flame, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    discountPercent?: number | null;
    productType: string;
    stockType: string;
    stockQuantity: number;
    imagesArray?: string[];
    images?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isLimited?: boolean;
    totalSales?: number;
    deliveryTimeMinutes?: number;
    serviceRequirements?: string | null;
    avgRating?: number;
    reviewCount?: number;
    category?: { name: string; slug: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem, setIsOpen } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  let images: string[] = [];
  if (product.imagesArray) {
    images = product.imagesArray;
  } else if (typeof product.images === "string") {
    try {
      images = JSON.parse(product.images);
    } catch {
      images = [product.images];
    }
  }

  const primaryImage = images[0] || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: primaryImage,
      productType: product.productType,
      deliveryTimeMinutes: product.deliveryTimeMinutes,
      serviceRequirements: product.serviceRequirements,
    });

    setIsAdded(true);
    toast.success(`تمت إضافة "${product.name}" إلى السلة 🏎️`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: primaryImage,
      productType: product.productType,
      deliveryTimeMinutes: product.deliveryTimeMinutes,
      serviceRequirements: product.serviceRequirements,
    });

    router.push("/checkout");
  };

  return (
    <div className="group relative rounded-2xl bg-garage-900/90 border border-gray-800/80 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-glow-cyan-sm flex flex-col justify-between overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1 items-end">
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="px-2 py-0.5 rounded-md bg-neon-red/90 text-white font-extrabold text-[10px] shadow-glow-red flex items-center gap-1">
            <Flame className="w-3 h-3" />
            <span>خصم {product.discountPercent}%</span>
          </span>
        )}

        {product.isFeatured && (
          <span className="px-2 py-0.5 rounded-md bg-neon-cyan/20 border border-cyan-500/40 text-neon-cyan font-bold text-[10px]">
            مميز ⭐
          </span>
        )}

        {product.isLimited && (
          <span className="px-2 py-0.5 rounded-md bg-neon-purple/20 border border-purple-500/40 text-neon-purple font-bold text-[10px]">
            حصري نادر 🔥
          </span>
        )}
      </div>

      {/* Product Image Link */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-garage-950">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-garage-900 via-transparent to-transparent opacity-80" />

        {/* Delivery Time Pill */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-gray-700 text-[10px] text-gray-300">
          <Clock className="w-3 h-3 text-neon-cyan" />
          <span>{product.deliveryTimeMinutes || 10} دقيقة</span>
        </div>
      </Link>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between text-right space-y-3">
        <div>
          {/* Category / Type Tag */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span className="text-neon-cyan/90 font-mono">
              {product.category?.name || "سيارات وتعديلات"}
            </span>
            <div className="flex items-center gap-1 text-neon-amber">
              <Star className="w-3 h-3 fill-neon-amber" />
              <span className="font-bold text-xs">{product.avgRating || 5.0}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-white group-hover:text-neon-cyan transition line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-gray-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="text-left">
              <span className="text-base font-extrabold text-neon-green">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="block text-[11px] text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
              <span>ضمان ضد الباند</span>
            </span>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                isAdded
                  ? "bg-green-500/20 border-green-500 text-neon-green"
                  : "bg-garage-800 hover:bg-garage-750 border-gray-700 hover:border-cyan-500/40 text-gray-200"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تمت الإضافة</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>أضف للسلة</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-extrabold text-xs shadow-glow-cyan-sm hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>شراء فوري</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
