import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Bell, Gift, ShoppingBag, ShieldAlert, Sparkles, ExternalLink, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT_APPROVED":
      case "GIFT_RECEIVED":
        return <Gift className="w-5 h-5 text-neon-green" />;
      case "ORDER_STATUS":
        return <ShoppingBag className="w-5 h-5 text-neon-cyan" />;
      case "DEPOSIT_REJECTED":
        return <ShieldAlert className="w-5 h-5 text-neon-red" />;
      default:
        return <Sparkles className="w-5 h-5 text-neon-purple" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-gray-800 pb-4">
        <span className="text-xs font-mono font-bold text-neon-cyan uppercase">
          Notification Center
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          مركز الإشعارات والتنبيهات
        </h1>
      </div>

      {notifications.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-garage-900 border border-gray-800 space-y-3">
          <Bell className="w-10 h-10 mx-auto text-gray-600" />
          <h3 className="text-base font-bold text-white">لا توجد إشعارات حالياً</h3>
          <p className="text-xs text-gray-400">ستصلك هنا إشعارات فورية عند تأكيد الإيداعات أو تغير حالة طلباتك.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 rounded-2xl border transition flex items-start gap-4 ${
                !n.isRead
                  ? "bg-garage-900 border-cyan-500/40 shadow-glow-cyan-sm"
                  : "bg-garage-900/60 border-gray-800"
              }`}
            >
              <div className="p-2.5 rounded-xl bg-garage-850 border border-gray-700 shrink-0">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {formatDate(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>

                {n.link && (
                  <div className="pt-2">
                    <Link
                      href={n.link}
                      className="text-xs text-neon-cyan hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      <span>عرض التفاصيل</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
