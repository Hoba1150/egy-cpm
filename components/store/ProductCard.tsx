"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Zap, Check } from "lucide-react";
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
    toast.success(`تمت إضافة "${product.name}" إلى السلة`);
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
    <div className="rounded-xl bg-[#12161f] border border-gray-800 hover:border-orange-500/50 transition flex flex-col justify-between overflow-hidden shadow-sm">
      {/* Product Image Link (Clean Amazon / Noon aspect ratio) */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-black">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />

        {product.discountPercent && product.discountPercent > 0 && (
          <span className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-orange-600 text-white font-bold text-[8px] sm:text-[9px]">
            %{product.discountPercent}-
          </span>
        )}

        <div className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-black/80 text-[8px] text-gray-300">
          {product.deliveryTimeMinutes || 10}د
        </div>
      </Link>

      {/* Body Info */}
      <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between text-right space-y-1.5">
        <div>
          {/* Category */}
          <span className="text-[9px] text-orange-400 block truncate">
            {product.category?.name || "سيارات"}
          </span>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-[11px] sm:text-xs font-bold text-white hover:text-orange-500 transition line-clamp-2 leading-tight min-h-[28px]">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs sm:text-sm font-extrabold text-orange-500 font-mono">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[9px] text-gray-500 line-through font-mono">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Compact Action Buttons */}
        <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-gray-800">
          <button
            onClick={handleAddToCart}
            className={`py-1 px-1 rounded border text-[10px] font-bold transition flex items-center justify-center gap-0.5 ${
              isAdded
                ? "bg-green-500/20 border-green-500 text-green-400"
                : "bg-[#1a202c] border-gray-700 hover:border-gray-500 text-gray-200"
            }`}
          >
            {isAdded ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 text-orange-400" />
                <span>سلة</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            className="py-1 px-1 rounded bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-[10px] transition flex items-center justify-center gap-0.5"
          >
            <Zap className="w-3 h-3" />
            <span>شراء</span>
          </button>
        </div>
      </div>
    </div>
  );
}
