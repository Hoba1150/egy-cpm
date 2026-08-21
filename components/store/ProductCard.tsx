"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Zap, Star, ShieldCheck, Clock, Check } from "lucide-react";
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
    deliveryTimeMinutes?: number;
    serviceRequirements?: string | null;
    avgRating?: number;
    reviewCount?: number;
    category?: { name: string; slug: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
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
    <div className="rounded-xl bg-garage-900 border border-gray-800 hover:border-cyan-500/40 transition flex flex-col justify-between overflow-hidden">
      {/* Product Image Link */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-garage-950">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />

        {product.discountPercent && product.discountPercent > 0 && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[9px]">
            خصم {product.discountPercent}%
          </span>
        )}

        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-gray-300">
          تسليم {product.deliveryTimeMinutes || 10} د
        </div>
      </Link>

      {/* Body Info */}
      <div className="p-3 flex-1 flex flex-col justify-between text-right space-y-2">
        <div>
          {/* Category */}
          <span className="text-[10px] text-neon-cyan block mb-0.5">
            {product.category?.name || "سيارات وتعديلات"}
          </span>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-white hover:text-neon-cyan transition line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-sm sm:text-base font-extrabold text-neon-green font-mono">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-500 line-through font-mono">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-gray-800">
          <button
            onClick={handleAddToCart}
            className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              isAdded
                ? "bg-green-500/20 border-green-500 text-neon-green"
                : "bg-garage-800 border-gray-700 text-gray-200"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3" />
                <span>تمت الإضافة</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 text-neon-cyan" />
                <span>السلة</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            className="py-1.5 px-2 rounded-lg bg-neon-cyan text-black font-extrabold text-[11px] hover:opacity-90 transition flex items-center justify-center gap-1"
          >
            <Zap className="w-3 h-3" />
            <span>شراء</span>
          </button>
        </div>
      </div>
    </div>
  );
}
