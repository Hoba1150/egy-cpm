"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ShoppingBag,
  Car,
  FolderTree,
  Users,
  Tag,
  Headphones,
  Star,
  Shield,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const userRole = user?.role || "CUSTOMER";

  // Role permissions map
  const rolePermissions: Record<string, string[]> = {
    SUPER_ADMIN: ["/admin", "/admin/deposits", "/admin/orders", "/admin/products", "/admin/categories", "/admin/customers", "/admin/coupons", "/admin/tickets", "/admin/reviews", "/admin/audit-logs", "/admin/settings"],
    ADMIN: ["/admin", "/admin/deposits", "/admin/orders", "/admin/products", "/admin/categories", "/admin/customers", "/admin/coupons", "/admin/tickets", "/admin/reviews", "/admin/audit-logs"],
    ORDER_MANAGER: ["/admin", "/admin/orders", "/admin/products", "/admin/tickets"],
    SUPPORT: ["/admin", "/admin/tickets", "/admin/reviews", "/admin/orders"],
  };

  const allowedHrefs = rolePermissions[userRole] || ["/admin"];

  const allLinks = [
    { name: "مركز القيادة والإحصائيات", href: "/admin", icon: LayoutDashboard },
    { name: "مراجعة طلبات الإيداع", href: "/admin/deposits", icon: Wallet },
    { name: "إدارة وتنفيذ الطلبات", href: "/admin/orders", icon: ShoppingBag },
    { name: "إدارة المنتجات والسيارات", href: "/admin/products", icon: Car },
    { name: "الأقسام والتصنيفات", href: "/admin/categories", icon: FolderTree },
    { name: "إدارة العملاء والمحافظ", href: "/admin/customers", icon: Users },
    { name: "كوبونات الخصم", href: "/admin/coupons", icon: Tag },
    { name: "تذاكر الدعم الفني", href: "/admin/tickets", icon: Headphones },
    { name: "مراجعة التقييمات", href: "/admin/reviews", icon: Star },
    { name: "سجل العمليات (Audit Logs)", href: "/admin/audit-logs", icon: Shield },
    { name: "إعدادات المتجر والنسخ", href: "/admin/settings", icon: Settings },
  ];

  const links = allLinks.filter((l) => allowedHrefs.includes(l.href));

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-[#090c12] border-b md:border-b-0 md:border-l border-cyan-500/20 flex flex-col justify-between shrink-0">
      {/* Top Brand */}
      <div className="p-5 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-neon-cyan flex items-center justify-center shadow-glow-cyan-sm">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">EGY CPM COMMAND</h2>
            <span className="text-[10px] text-neon-cyan font-mono uppercase font-bold">
              لوحة التحكم والإدارة
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? "bg-gradient-to-l from-cyan-500/20 to-transparent text-neon-cyan border-r-2 border-neon-cyan font-extrabold shadow-glow-cyan-sm"
                  : "text-gray-400 hover:text-white hover:bg-garage-850"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-neon-cyan" : ""}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Bar */}
      <div className="p-4 border-t border-gray-800 bg-garage-950/60 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
            alt={user?.name}
            className="w-9 h-9 rounded-xl object-cover border border-cyan-500/40"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
            <span className="text-[10px] text-neon-green font-mono">{user?.role}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link
            href="/"
            target="_blank"
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-garage-850 hover:bg-garage-750 text-gray-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 border border-gray-800 transition"
          >
            <span>زيارة المتجر</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
