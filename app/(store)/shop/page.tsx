import React from "react";
import { getProducts, getCategories } from "@/lib/actions/product";
import ProductCard from "@/components/store/ProductCard";
import Link from "next/link";
import { Search, Filter, SlidersHorizontal, Car, Zap, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: {
    category?: string;
    type?: string;
    search?: string;
    sortBy?: "newest" | "price_asc" | "price_desc" | "sales" | "discount";
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    page?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const currentPage = Number(searchParams.page) || 1;

  const [productsRes, categories] = await Promise.all([
    getProducts({
      categorySlug: searchParams.category,
      productType: searchParams.type,
      search: searchParams.search,
      sortBy: searchParams.sortBy || "newest",
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      inStockOnly: searchParams.inStock === "true",
      page: currentPage,
      limit: 20,
    }),
    getCategories(),
  ]);

  const sortOptions = [
    { label: "الأحدث أولاً", value: "newest" },
    { label: "الأعلى مبيعاً 🔥", value: "sales" },
    { label: "الأعلى خصماً 💥", value: "discount" },
    { label: "السعر: من الأقل للأعلى", value: "price_asc" },
    { label: "السعر: من الأعلى للأقل", value: "price_desc" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          متجر سيارات وخدمات Car Parking
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          تصفح جميع السيارات المعدلة، سيارات الرسم، خدمات الشحن والحسابات ({productsRes.totalCount} عنصر متاح)
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-garage-900/90 border border-gray-800 space-y-4 mb-8">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search || ""}
              placeholder="ابحث بالاسم أو المواصفات..."
              className="w-full pl-3 pr-9 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:border-neon-cyan text-right"
            />
            <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              name="category"
              defaultValue={searchParams.category || "all"}
              className="w-full px-3 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right"
            >
              <option value="all">جميع الأقسام والتصنيفات</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              name="sortBy"
              defaultValue={searchParams.sortBy || "newest"}
              className="w-full px-3 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Filter Button */}
          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold text-xs shadow-glow-cyan-sm hover:shadow-glow-cyan transition flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>تطبيق الفلاتر والبحث</span>
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-gray-800/80">
          <Link
            href="/shop"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              !searchParams.category || searchParams.category === "all"
                ? "bg-neon-cyan text-black font-bold shadow-glow-cyan-sm"
                : "bg-garage-850 text-gray-300 hover:text-white border border-gray-800"
            }`}
          >
            الكل
          </Link>
          {categories.map((cat) => {
            const isSelected = searchParams.category === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? "bg-neon-cyan text-black font-bold shadow-glow-cyan-sm"
                    : "bg-garage-850 text-gray-300 hover:text-white border border-gray-800"
                }`}
              >
                {cat.name.split("(")[0]}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {productsRes.items.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-garage-900/60 border border-gray-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-garage-850 mx-auto flex items-center justify-center text-gray-600">
            <Car className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">لم يتم العثور على أي منتجات مطابقة</h3>
            <p className="text-xs text-gray-400">
              جرب تغيير كلمات البحث أو اختيار قسم مختلف.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-block px-5 py-2 rounded-xl bg-garage-800 text-neon-cyan text-xs font-bold border border-cyan-500/30"
          >
            إعادة تعيين الفلاتر
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsRes.items.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {productsRes.totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          {Array.from({ length: productsRes.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/shop?page=${pageNum}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.sortBy ? `&sortBy=${searchParams.sortBy}` : ""}`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                currentPage === pageNum
                  ? "bg-neon-cyan text-black shadow-glow-cyan"
                  : "bg-garage-900 border border-gray-800 text-gray-300 hover:text-white"
              }`}
            >
              {pageNum}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
