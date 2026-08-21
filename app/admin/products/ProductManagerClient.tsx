"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { createProduct, updateProduct, deleteProduct } from "@/lib/actions/product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  Car,
  Zap,
  Image as ImageIcon,
  Flame,
  Star,
  Sparkles,
  X,
  Upload,
  Loader2,
  Search,
  FolderTree,
} from "lucide-react";

export default function ProductManagerClient({
  initialProducts,
  categories,
}: {
  initialProducts: any[];
  categories: any[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">(150);
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [discountPercent, setDiscountPercent] = useState<number | "">(0);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [stockType, setStockType] = useState("UNLIMITED");
  const [stockQuantity, setStockQuantity] = useState<number | "">(999);
  const [deliveryTimeMinutes, setDeliveryTimeMinutes] = useState<number | "">(10);
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isLimited, setIsLimited] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProductId(null);
    setName("");
    setDescription("");
    setPrice(150);
    setOriginalPrice("");
    setDiscountPercent(0);
    setCategoryId(categories[0]?.id || "");
    setStockType("UNLIMITED");
    setStockQuantity(999);
    setDeliveryTimeMinutes(10);
    setImageUrl("https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800");
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsLimited(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProductId(p.id);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || "");
    setDiscountPercent(p.discountPercent || 0);
    setCategoryId(p.categoryId);
    setStockType(p.stockType);
    setStockQuantity(p.stockQuantity);
    setDeliveryTimeMinutes(p.deliveryTimeMinutes || 10);

    let images = [];
    try {
      images = JSON.parse(p.images);
    } catch {
      images = [p.images];
    }
    setImageUrl(images[0] || "");
    setIsFeatured(p.isFeatured);
    setIsBestSeller(p.isBestSeller);
    setIsLimited(p.isLimited);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("يرجى إدخال اسم المنتج.");
      return;
    }

    setIsSaving(true);
    try {
      const selectedCat = categories.find((c) => c.id === categoryId);
      const inferredType = selectedCat?.slug?.includes("service")
        ? "SERVICE"
        : selectedCat?.slug?.includes("account")
        ? "ACCOUNT"
        : "MODIFIED_CAR";

      if (editingProductId) {
        await updateProduct(editingProductId, {
          name,
          description,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : null,
          discountPercent: Number(discountPercent || 0),
          categoryId,
          productType: inferredType,
          stockType,
          stockQuantity: Number(stockQuantity || 999),
          deliveryTimeMinutes: Number(deliveryTimeMinutes || 10),
          images: [imageUrl],
          isFeatured,
          isBestSeller,
          isLimited,
        });
        toast.success("تم تحديث بيانات المنتج بنجاح!");
      } else {
        await createProduct({
          name,
          description,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : null,
          discountPercent: Number(discountPercent || 0),
          categoryId,
          productType: inferredType,
          stockType,
          stockQuantity: Number(stockQuantity || 999),
          deliveryTimeMinutes: Number(deliveryTimeMinutes || 10),
          images: [imageUrl],
          isFeatured,
          isBestSeller,
          isLimited,
        });
        toast.success("تمت إضافة المنتج الجديد بنجاح!");
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "فشل حفظ المنتج.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!confirm(`هل أنت متأكد من حذف/أرشفة "${prodName}"؟`)) return;

    try {
      await deleteProduct(id);
      toast.success("تم حذف المنتج بنجاح.");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "فشل حذف المنتج.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-extrabold text-xs shadow-glow-cyan flex items-center gap-1.5 hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج أو سيارة جديدة +</span>
        </button>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="ابحث عن منتج بالاسم أو الوصف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right"
          />
          <Search className="w-4 h-4 absolute right-3.5 top-3 text-gray-400" />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-garage-900 border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-garage-950/80 text-gray-400 font-bold">
                <th className="p-4">المنتج</th>
                <th className="p-4">القسم</th>
                <th className="p-4">السعر</th>
                <th className="p-4">الخصم</th>
                <th className="p-4">المخزون</th>
                <th className="p-4">المبيعات</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filtered.map((p) => {
                let images = [];
                try {
                  images = JSON.parse(p.images);
                } catch {
                  images = [p.images];
                }

                return (
                  <tr key={p.id} className="hover:bg-garage-850/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={images[0] || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=100"}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-gray-700 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">/{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-neon-cyan border border-cyan-500/20 text-[11px] font-bold">
                        {p.category?.name || "بدون قسم"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-sm text-neon-green font-mono">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="p-4">
                      {p.discountPercent > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-neon-red font-bold text-[10px]">
                          {p.discountPercent}% خصم
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-gray-300">
                      {p.stockType === "UNLIMITED" ? "غير محدود" : `${p.stockQuantity} قطعة`}
                    </td>
                    <td className="p-4 font-mono font-bold text-white">{p.totalSales}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.isActive ? "bg-green-500/20 text-neon-green" : "bg-gray-700 text-gray-400"}`}>
                        {p.isActive ? "نشط" : "معطل"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-garage-800 hover:bg-cyan-500/20 text-gray-300 hover:text-neon-cyan border border-gray-700 transition"
                          title="تعديل المنتج"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-2xl w-full bg-[#0c1017] border border-cyan-500/40 rounded-3xl p-6 shadow-glow-cyan text-right space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-neon-cyan" />
                <span>{editingProductId ? "تعديل بيانات المنتج" : "إضافة منتج أو سيارة جديدة"}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">اسم المنتج / السيارة *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: BMW M8 Competition 1695HP Police"
                  className="w-full px-3.5 py-2.5 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">الوصف التفصيلي *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف تفصيلي للسيارة أو الخدمة ومميزاتها..."
                  className="w-full p-3 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right"
                />
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  القسم المراد وضع المنتج به *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-900 border border-cyan-500/40 rounded-xl text-xs text-white text-right focus:border-neon-cyan"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">السعر (ج.م) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white text-right font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">السعر قبل الخصم</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : "")}
                    placeholder="اختياري"
                    className="w-full px-3 py-2 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white text-right font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white text-right font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">صورة المنتج / السيارة *</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      id="product-image-file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            toast.error("حجم الصورة كبير، يفضل اختيار صورة أقل من 2 ميجابايت.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setImageUrl(event.target?.result as string);
                            toast.success("تم رفع الصورة بنجاح.");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="product-image-file"
                      className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs rounded-xl cursor-pointer transition flex items-center gap-1.5 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>اختر صورة من جهازك</span>
                    </label>
                    <span className="text-[11px] text-gray-400">أو ضع الرابط مباشرة</span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="رابط الصورة أو سيتم وضع الصورة المرفوعة تلقائياً هنا..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white text-right dir-ltr font-mono"
                  />

                  {imageUrl && (
                    <div className="mt-1 flex items-center gap-2 p-1.5 rounded-lg bg-black/50 border border-gray-800">
                      <img src={imageUrl} alt="معاينة" className="w-12 h-12 object-cover rounded-md border border-gray-700" />
                      <span className="text-[10px] text-gray-400">معاينة الصورة الحالية</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-garage-900 border border-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded accent-cyan-400"
                  />
                  <span className="text-xs text-gray-300">منتج مميز 🔥</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-garage-900 border border-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded accent-cyan-400"
                  />
                  <span className="text-xs text-gray-300">الأكثر مبيعاً ⭐</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-garage-900 border border-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLimited}
                    onChange={(e) => setIsLimited(e.target.checked)}
                    className="rounded accent-cyan-400"
                  />
                  <span className="text-xs text-gray-300">إصدار محدود 💎</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-800">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-extrabold text-xs shadow-glow-cyan transition disabled:opacity-50"
                >
                  {isSaving ? "جاري الحفظ..." : "حفظ المنتج"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-garage-850 text-gray-300 text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
