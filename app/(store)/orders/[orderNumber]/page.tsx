import React from "react";
import { getOrderByNumber } from "@/lib/actions/order";
import { notFound, redirect } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Car,
  ShoppingBag,
  ShieldCheck,
  Headphones,
  Key,
  Flame,
  ArrowRight,
  AlertCircle,
  Copy,
} from "lucide-react";
import OrderTrackerClient from "./OrderTrackerClient";

export const dynamic = "force-dynamic";

interface OrderTrackingPageProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const order = await getOrderByNumber(params.orderNumber);

  if (!order) {
    notFound();
  }

  let timelineArray: any[] = [];
  try {
    timelineArray = JSON.parse(order.timeline || "[]");
  } catch {
    timelineArray = [];
  }

  const isCompleted = order.status === "COMPLETED";
  const isRefunded = order.status === "REFUNDED";

  // Check if any digital account secret was delivered
  const deliveredAccounts = order.items
    .filter((i) => i.deliveredDataEncrypted)
    .map((i) => ({
      name: i.productName,
      data: i.deliveredDataEncrypted,
    }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan mb-1">
            <Link href="/orders" className="hover:underline flex items-center gap-1">
              <span>طلباتي</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span>/</span>
            <span>تتبع الطلب</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>طلب رقم:</span>
            <span className="font-mono text-neon-cyan font-bold">{order.orderNumber}</span>
          </h1>
        </div>

        <Link
          href={`/support?relatedId=${order.orderNumber}`}
          className="px-4 py-2.5 rounded-xl bg-garage-850 hover:bg-garage-750 border border-gray-700 text-xs font-bold text-gray-300 hover:text-neon-cyan transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Headphones className="w-4 h-4" />
          <span>مساعدة بخصوص هذا الطلب</span>
        </Link>
      </div>

      {/* Cybernetic Live HUD Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-garage-900/90 border border-cyan-500/30 shadow-glow-cyan-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-neon-cyan" />
            <span>مراحل وتتبع تنفيذ الطلب المباشر</span>
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            {formatDate(order.createdAt)}
          </span>
        </div>

        {/* Timeline Steps */}
        <div className="relative border-r-2 border-cyan-500/30 mr-4 pr-6 space-y-6 py-2">
          {timelineArray.map((step, idx) => {
            const isLast = idx === timelineArray.length - 1;
            return (
              <div key={idx} className="relative group">
                {/* Step Node Marker */}
                <div
                  className={`absolute -right-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-[#06070a] ${
                    isLast
                      ? "bg-neon-cyan shadow-glow-cyan animate-pulse"
                      : "bg-neon-green"
                  }`}
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-white">{step.title}</h4>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {formatDate(step.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Admin Notes if any */}
        {order.adminNotes && (
          <div className="p-4 rounded-2xl bg-garage-850 border border-cyan-500/20 text-xs space-y-1 text-cyan-200">
            <span className="font-bold block">ملاحظات الإدارة وفريق التنفيذ:</span>
            <p>{order.adminNotes}</p>
          </div>
        )}
      </div>

      {/* Delivered Digital Accounts Credentials (If applicable) */}
      {deliveredAccounts.length > 0 && isCompleted && (
        <div className="p-6 rounded-3xl bg-garage-900 border border-purple-500/40 shadow-glow-purple space-y-4">
          <div className="flex items-center gap-2 text-neon-purple font-bold text-base">
            <Key className="w-5 h-5" />
            <span>بيانات الحساب الرقمي المستلمة (تسليم آمن)</span>
          </div>

          <p className="text-xs text-gray-300">
            يرجى نسخ وتخزين بيانات حسابك وتغيير كلمة السر فوراً لضمان الخصوصية التامة:
          </p>

          <div className="space-y-3">
            {deliveredAccounts.map((acc, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-garage-850 border border-purple-500/30 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[11px] text-gray-400 block">{acc.name}</span>
                  <span className="font-mono text-sm font-bold text-neon-green tracking-wider">
                    {acc.data}
                  </span>
                </div>
                <OrderTrackerClient copyText={acc.data || ""} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details & Summary */}
      <div className="p-6 rounded-3xl bg-garage-900/90 border border-gray-800 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-neon-cyan" />
          <span>تفاصيل المنتجات المشتراة</span>
        </h3>

        <div className="divide-y divide-gray-800">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-white">{item.productName}</span>
                <span className="block text-[11px] text-gray-400">الكمية: {item.quantity}</span>
              </div>
              <span className="font-extrabold text-sm text-neon-green">
                {formatCurrency(item.total)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="pt-3 border-t border-gray-800 space-y-1.5 text-xs text-gray-300">
          <div className="flex justify-between">
            <span>المجموع الفرعي:</span>
            <span className="font-bold text-white">{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-neon-green">
              <span>الخصم المطبق:</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-gray-800">
            <span>الإجمالي المدفوع بالمحفظة:</span>
            <span className="text-neon-cyan text-base">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
