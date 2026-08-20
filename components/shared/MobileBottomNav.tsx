"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Wallet, User as UserIcon } from "lucide-react";
import { useCartStore } from "@/lib/store";
import AuthModal from "@/components/shared/AuthModal";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { getItemCount, setIsOpen: setCartOpen } = useCartStore();
  const itemCount = getItemCount();
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const fetchUser = () => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
  };

  useEffect(() => {
    fetchUser();

    window.addEventListener("cpm_auth_changed", fetchUser);
    window.addEventListener("focus", fetchUser);

    return () => {
      window.removeEventListener("cpm_auth_changed", fetchUser);
      window.removeEventListener("focus", fetchUser);
    };
  }, [pathname]);

  const items = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "المتجر", href: "/shop", icon: ShoppingBag },
    {
      name: "السلة",
      onClick: () => setCartOpen(true),
      icon: ShoppingCart,
      badge: itemCount,
    },
    { name: "المحفظة", href: "/wallet", icon: Wallet },
    {
      name: user ? "حسابي" : "دخول",
      href: user ? "/profile" : undefined,
      onClick: user ? undefined : () => setIsAuthOpen(true),
      icon: UserIcon,
    },
  ];

  return (
    <>
      {/* Top Mobile Quick Navigation Bar - Positioned right under the header */}
      <nav className="md:hidden sticky top-[48px] z-30 bg-[#090c12]/95 backdrop-blur-md border-b border-cyan-500/20 px-2 py-1 shadow-md">
        <div className="grid grid-cols-5 gap-1">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.href ? pathname === item.href : false;

            if (item.onClick) {
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center py-1 relative text-gray-400 hover:text-neon-cyan transition"
                >
                  <div className="relative">
                    <Icon className="w-4 h-4" />
                    {Boolean(item.badge && item.badge > 0) && (
                      <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-neon-cyan text-[8px] font-extrabold text-black">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] mt-0.5 font-medium">{item.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={idx}
                href={item.href!}
                className={`flex flex-col items-center justify-center py-1 relative transition ${
                  isActive
                    ? "text-neon-cyan font-bold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${isActive ? "text-neon-cyan scale-105 drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]" : ""}`} />
                </div>
                <span className="text-[9px] mt-0.5 font-medium">{item.name}</span>
                {isActive && (
                  <span className="absolute -bottom-1 w-5 h-0.5 bg-neon-cyan rounded-full shadow-glow-cyan" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
