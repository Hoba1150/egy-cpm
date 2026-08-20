import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { getMyOrders } from "@/lib/actions/order";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Clock, CheckCircle2, XCircle, RefreshCw, Car, ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const orders = await getMyOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-neon-green border border-green-500/30 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /><span>مكتمل ومسلّم ✅</span></span>;
      case "PROCESSING":
      case "IN_PROGRESS":
        return <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-neon-cyan border border-cyan-500/30 text-xs font-bold flex items-center gap-1 animate-pulse"><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>جاري التنفيذ والتسليم ⏳</span></span>;
      case "REFUNDED":
        return <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-neon-purple border border-purple-500/30 text-xs font-bold">مسترجع للمحفظة 💰</span>;
      case "CANCELLED":
      case "REJECTED":
        return <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-neon-red border border-red-500/30 text-xs font-bold"><XCircle className="w-3.5 h-3.5" /><span>ملغي / مرفوض</span></span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-neon-blue border border-blue-500/30 text-xs font-bold">مدفوع ومؤكد</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-gray-800 pb-4">
        <span className="text-xs font-mono font-bold text-neon-cyan uppercase">
          Order History & Tracking
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          طلباتي وتتبع الخدمات
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          تتبع حالة طلباتك لحظة بلحظة واستلم سياراتك وبيانات حسابك بكل أمان.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-garage-900 border border-gray-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-garage-850 mx-auto flex items-center justify-center text-gray-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">لم تقم بإجراء أي طلبات حتى الآن</h3>
            <p className="text-xs text-gray-400">
              تصفح سيارات الدريفت المعدلة وخدمات الشحن واطلب الآن!
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold text-xs"
          >
            تصفح المتجر
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-3xl bg-garage-900/90 border border-gray-800 hover:border-cyan-500/40 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              {/* Order Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm sm:text-base font-black text-neon-cyan">
                    #{order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                  <span className="text-[11px] text-gray-500 font-mono">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Items preview */}
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span>
                    {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(" + ")}
                  </span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-800">
                <div className="text-right md:text-left">
                  <span className="text-[10px] text-gray-500 block">الإجمالي:</span>
                  <span className="text-base font-extrabold text-neon-green">
                    {formatCurrency(order.total)}
                  </span>
                </div>

                <Link
                  href={`/orders/${order.orderNumber}`}
                  className="px-4 py-2.5 rounded-xl bg-garage-850 hover:bg-cyan-500/20 border border-gray-700 hover:border-cyan-500 text-xs font-bold text-white hover:text-neon-cyan transition flex items-center gap-1.5"
                >
                  <span>تتبع الطلب</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
