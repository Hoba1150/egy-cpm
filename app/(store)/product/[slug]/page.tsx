import React from "react";
import { getProductBySlug, getProducts } from "@/lib/actions/product";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import ProductDetailsClient from "./ProductDetailsClient";
import ProductCard from "@/components/store/ProductCard";
import { Star, ShieldCheck, Clock, Award, Sparkles, MessageSquare } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const user = await getCurrentUser();
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Related products in same category
  const relatedRes = await getProducts({
    categorySlug: product.category?.slug,
    limit: 4,
  });

  const relatedProducts = relatedRes.items.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right space-y-16">
      {/* Product Hero & Interactive Client Section */}
      <ProductDetailsClient product={product} user={user} />

      {/* Specifications & Features Tab Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-gray-800">
        {/* Left 2 Cols: Specs & Service Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-garage-900/90 border border-gray-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-cyan" />
              <span>المواصفات والتفاصيل الفنية</span>
            </h3>

            {product.specs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-garage-850 border border-gray-800/80 flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-400 font-mono uppercase">{key}:</span>
                    <span className="text-xs font-bold text-neon-green">{String(val)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                مواصفات قياسية أصلية ومطابقة لمعايير المتجر المعتمدة.
              </p>
            )}

            {product.serviceRequirements && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 mt-4 space-y-1">
                <span className="font-bold block">متطلبات وشروط تنفيذ الخدمة:</span>
                <p>{product.serviceRequirements}</p>
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="p-6 rounded-3xl bg-garage-900/90 border border-gray-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neon-purple" />
                <span>تقييمات ومراجعات العملاء ({product.reviewCount})</span>
              </h3>
              <div className="flex items-center gap-1.5 text-neon-amber">
                <Star className="w-4 h-4 fill-neon-amber" />
                <span className="text-sm font-bold text-white">{product.avgRating} / 5</span>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {product.reviews.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">
                  لا توجد مراجعات حتى الآن. كن أول من يقيّم هذا المنتج بعد الشراء!
                </p>
              ) : (
                product.reviews.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-garage-850 border border-gray-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80"}
                          alt={rev.user?.name || "User"}
                          className="w-8 h-8 rounded-lg object-cover border border-cyan-500/30"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-white">{rev.user?.name || "عميل موثق"}</h5>
                          <span className="text-[10px] text-gray-500">{formatDate(rev.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-neon-amber">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-neon-amber" />
                        ))}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-gray-300 leading-relaxed pt-1">
                        {rev.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Trust & Guarantees */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-garage-900/90 border border-cyan-500/20 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neon-green" />
              <span>ضمانات المتجر المعتمدة</span>
            </h4>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-neon-green font-bold">✓</span>
                <span>ضمان أمان وحماية ضد الباند بنسبة 100%.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-green font-bold">✓</span>
                <span>تسليم سريع ومباشر خلال {product.deliveryTimeMinutes || 10} دقائق.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-green font-bold">✓</span>
                <span>تشفير كامل لكافة بيانات الحساب بـ AES-256-GCM.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-green font-bold">✓</span>
                <span>دعم فني فوري ومتابعة حتى اكتمال التسليم.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            منتجات وسيارات مشابهة قد تعجبك
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
