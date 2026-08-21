import React from "react";
import { getProducts, getCategories } from "@/lib/actions/product";
import ProductCard from "@/components/store/ProductCard";
import Link from "next/link";
import { Search, Filter, Car } from "lucide-react";

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
      limit: 24,
    }),
    getCategories(),
  ]);

  const sortOptions = [
    { label: "الأحدث", value: "newest" },
    { label: "الأعلى مبيعاً", value: "sales" },
    { label: "الأعلى خصماً", value: "discount" },
    { label: "السعر: الأقل أولاً", value: "price_asc" },
    { label: "السعر: الأعلى أولاً", value: "price_desc" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 text-right space-y-4">
      {/* Search & Filter Compact Bar */}
      <div className="p-3 rounded-xl bg-[#12161f] border border-gray-800 space-y-2.5">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search || ""}
              placeholder="ابحث عن سيارة أو خدمة..."
              className="w-full pl-3 pr-8 py-2 bg-[#1a202c] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 text-right"
            />
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-gray-400" />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              name="category"
              defaultValue={searchParams.category || "all"}
              className="w-full px-3 py-2 bg-[#1a202c] border border-gray-700 rounded-lg text-xs text-white text-right"
            >
              <option value="all">جميع الأقسام</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <select
              name="sortBy"
              defaultValue={searchParams.sortBy || "newest"}
              className="w-full px-3 py-2 bg-[#1a202c] border border-gray-700 rounded-lg text-xs text-white text-right"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="py-2 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs shrink-0"
            >
              بحث
            </button>
          </div>
        </form>

        {/* Category Horizontal Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1.5 border-t border-gray-800/80">
          <Link
            href="/shop"
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition ${
              !searchParams.category || searchParams.category === "all"
                ? "bg-orange-500 text-black"
                : "bg-[#1a202c] text-gray-300 hover:text-white"
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
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition ${
                  isSelected
                    ? "bg-orange-500 text-black"
                    : "bg-[#1a202c] text-gray-300 hover:text-white"
                }`}
              >
                {cat.name.split("(")[0]}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Products Grid: 2 columns on Mobile (Amazon/Noon style), 3 on Tablet, 4-5 on Desktop */}
      {productsRes.items.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#12161f] border border-gray-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gray-800 mx-auto flex items-center justify-center text-gray-400">
            <Car className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-white">لا توجد منتجات مطابقة للبحث</p>
          <Link
            href="/shop"
            className="inline-block px-4 py-1.5 rounded-lg bg-orange-500 text-black text-xs font-bold"
          >
            عرض جميع المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {productsRes.items.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {productsRes.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-1.5">
          {Array.from({ length: productsRes.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/shop?page=${pageNum}${searchParams.category ? `&category=${searchParams.category}` : ""}${searchParams.sortBy ? `&sortBy=${searchParams.sortBy}` : ""}`}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition ${
                currentPage === pageNum
                  ? "bg-orange-500 text-black font-extrabold"
                  : "bg-[#12161f] border border-gray-800 text-gray-300 hover:text-white"
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
