"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Gift, ShoppingBag, ShieldAlert, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/mark-read", { method: "POST" });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT_APPROVED":
      case "GIFT_RECEIVED":
        return <Gift className="w-4 h-4 text-neon-green" />;
      case "ORDER_STATUS":
        return <ShoppingBag className="w-4 h-4 text-neon-cyan" />;
      case "DEPOSIT_REJECTED":
        return <ShieldAlert className="w-4 h-4 text-neon-red" />;
      default:
        return <Sparkles className="w-4 h-4 text-neon-purple" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-garage-850 hover:bg-garage-750 border border-gray-800 hover:border-cyan-500/40 text-gray-300 hover:text-neon-cyan transition shadow-inner"
        aria-label="الإشعارات"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-neon-cyan text-[10px] font-bold text-black shadow-glow-cyan animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 mt-3 w-80 sm:w-96 bg-[#0e121a] border border-cyan-500/30 rounded-2xl shadow-glow-cyan overflow-hidden z-50 text-right"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-garage-900/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-neon-cyan" />
                  <span className="font-bold text-sm text-white">مركز الإشعارات</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-neon-cyan hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>تحديد الكل كمقروء</span>
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-800/60">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 text-sm">
                    لا توجد إشعارات جديدة حالياً
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-garage-800/50 transition ${
                        !n.isRead ? "bg-cyan-500/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 rounded-lg bg-garage-800 border border-gray-700">
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white mb-0.5">{n.title}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                            {n.message}
                          </p>
                          <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-500">
                            <span>{formatDate(n.createdAt)}</span>
                            {n.link && (
                              <Link
                                href={n.link}
                                onClick={() => setIsOpen(false)}
                                className="text-neon-cyan hover:underline flex items-center gap-0.5"
                              >
                                <span>عرض</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 text-center border-t border-gray-800 bg-garage-900/40">
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-gray-400 hover:text-neon-cyan transition font-medium"
                >
                  مشاهدة جميع الإشعارات
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
