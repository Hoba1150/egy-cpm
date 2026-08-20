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
      {/* Premium Fixed Mobile Bottom Bar - Fixed at bottom of screen */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090c12]/95 backdrop-blur-xl border-t border-cyan-500/30 px-1.5 py-1.5 shadow-[0_-5px_25px_rgba(0,0,0,0.9)]">
        <div className="grid grid-cols-5 gap-1">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.href ? pathname === item.href : false;

            if (item.onClick) {
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center py-1 relative text-gray-400 hover:text-neon-cyan transition active:scale-95"
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {Boolean(item.badge && item.badge > 0) && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue text-[9px] font-extrabold text-black shadow-glow-cyan-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-1 font-bold">{item.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={idx}
                href={item.href!}
                className={`flex flex-col items-center justify-center py-1 relative transition active:scale-95 ${
                  isActive
                    ? "text-neon-cyan font-bold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? "text-neon-cyan scale-110 drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]" : ""}`} />
                </div>
                <span className="text-[10px] mt-1 font-bold">{item.name}</span>
                {isActive && (
                  <span className="absolute -bottom-1 w-6 h-0.5 bg-neon-cyan rounded-full shadow-glow-cyan" />
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
