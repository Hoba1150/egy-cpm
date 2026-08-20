"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import {
  Car,
  ShoppingCart,
  User,
  Wallet,
  LogOut,
  Flame,
  Menu,
  X,
  Search,
  ChevronDown,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import NotificationsDropdown from "@/components/shared/NotificationsDropdown";
import AuthModal from "@/components/shared/AuthModal";
import Logo from "@/components/shared/Logo";
import { toast } from "sonner";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount, setIsOpen: setCartOpen } = useCartStore();
  const itemCount = getItemCount();

  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdown, setUserDropdown] = useState(false);

  const [settings, setSettings] = useState<Record<string, string>>({});

  // Fetch session & settings data
  const fetchSession = async () => {
    try {
      const [resAuth, resSettings] = await Promise.all([
        fetch("/api/auth/me", { cache: "no-store" }),
        fetch("/api/settings", { cache: "no-store" }),
      ]);
      if (resAuth.ok) {
        const data = await resAuth.json();
        setUser(data.user);
      }
      if (resSettings.ok) {
        const data = await resSettings.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchSession();

    const handleAuthEvent = () => {
      fetchSession();
    };

    window.addEventListener("cpm_auth_changed", handleAuthEvent);
    window.addEventListener("focus", handleAuthEvent);

    return () => {
      window.removeEventListener("cpm_auth_changed", handleAuthEvent);
      window.removeEventListener("focus", handleAuthEvent);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUserDropdown(false);
      toast.success("تم تسجيل الخروج بنجاح.");
      router.refresh();
    } catch {
      toast.error("فشل تسجيل الخروج.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "متجر السيارات", href: "/cars" },
    { name: "خدمات الحساب", href: "/services" },
    { name: "حسابات جاهزة", href: "/accounts" },
    { name: "شحن المحفظة", href: "/deposit" },
    { name: "تتبع طلبك", href: "/orders" },
    { name: "الدعم الفني", href: "/support" },
  ];

  const isAdmin = user && ["SUPER_ADMIN", "ADMIN", "SUPPORT", "ORDER_MANAGER"].includes(user.role);
  const isAnnouncementVisible = settings.announcement_visible !== "false";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#07090e]/95 backdrop-blur-md">
        {/* Top Announcement Bar */}
        {isAnnouncementVisible && (
          <div className="bg-gradient-to-r from-cyan-950 via-garage-900 to-purple-950 px-4 py-1.5 text-center text-xs font-semibold border-b border-cyan-500/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-gray-300">
              <span className="hidden sm:inline-block text-[11px] text-cyan-400">
                {settings.announcement_right || "⚡ تسليم فوري لجميع الخدمات والسيارات خلال 5-15 دقيقة"}
              </span>
              <span className="mx-auto sm:mx-0 flex items-center gap-1.5 text-neon-green">
                <Flame className="w-3.5 h-3.5 animate-bounce" />
                <span>{settings.announcement_center || "كود خصم حصري: CPM2026 خصم 15% على جميع الأقسام!"}</span>
              </span>
              <span className="hidden md:inline-block text-[11px] text-gray-400 font-mono">
                {settings.announcement_left || `رقم الإيداع المعتمد: ${settings.vodafone_cash || "01288212101"}`}
              </span>
            </div>
          </div>
        )}

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "text-neon-cyan bg-cyan-500/10 border border-cyan-500/30 shadow-glow-cyan-sm"
                        : "text-gray-300 hover:text-white hover:bg-garage-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Search Bar & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Form (Desktop) */}
              <form onSubmit={handleSearch} className="hidden md:flex relative items-center">
                <input
                  type="text"
                  placeholder="ابحث عن سيارة أو خدمة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 lg:w-56 pl-3 pr-9 py-2 rounded-xl bg-garage-900 border border-gray-800 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs text-gray-200 placeholder-gray-500 transition-all text-right"
                />
                <button type="submit" className="absolute right-2.5 text-gray-400 hover:text-neon-cyan">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-garage-850 border border-gray-800 hover:border-cyan-500/50 hover:bg-garage-800 text-gray-300 hover:text-neon-cyan transition duration-200 group"
                aria-label="سلة المشتريات"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition duration-200" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue text-black text-[10px] font-extrabold shadow-glow-cyan-sm animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {user && <NotificationsDropdown />}

              {/* User Account / Login State */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-garage-850 border border-cyan-500/30 hover:border-cyan-500/60 transition"
                  >
                    <img
                      src={user.image || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.email}`}
                      alt={user.name || "User"}
                      className="w-7 h-7 rounded-lg bg-garage-750 object-cover border border-cyan-500/20"
                    />
                    <div className="hidden sm:flex flex-col text-right leading-tight">
                      <span className="text-xs font-bold text-gray-100 max-w-[90px] truncate">
                        {user.name || "العميل"}
                      </span>
                      <span className="text-[10px] text-neon-green font-mono font-bold">
                        {formatCurrency(user.wallet?.totalAvailable || 0)}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdown && (
                    <div
                      className="absolute left-0 mt-2 w-56 rounded-2xl bg-garage-900 border border-cyan-500/30 shadow-2xl p-2 z-50 text-right space-y-1"
                      onClick={() => setUserDropdown(false)}
                    >
                      <div className="p-2 border-b border-gray-800 mb-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-400 truncate dir-ltr">{user.email}</p>
                        <div className="mt-2 p-2 rounded-lg bg-garage-950 border border-cyan-500/20 flex items-center justify-between">
                          <span className="text-[10px] text-gray-400">الرصيد المتاح:</span>
                          <span className="text-xs font-bold text-neon-green font-mono">
                            {formatCurrency(user.wallet?.totalAvailable || 0)}
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/wallet"
                        className="flex items-center gap-2 p-2 rounded-xl text-xs text-gray-300 hover:bg-garage-800 hover:text-neon-cyan transition"
                      >
                        <Wallet className="w-4 h-4 text-neon-cyan" />
                        <span>محفظتي وشحن الرصيد</span>
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 p-2 rounded-xl text-xs text-gray-300 hover:bg-garage-800 hover:text-neon-cyan transition"
                      >
                        <Car className="w-4 h-4 text-neon-purple" />
                        <span>طلباتي ومشترياتي</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin/login"
                          className="flex items-center gap-2 p-2 rounded-xl text-xs text-neon-green bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 transition"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>لوحة التحكم الإدارية</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-extrabold text-xs sm:text-sm shadow-glow-cyan-sm hover:scale-105 active:scale-95 transition"
                >
                  <User className="w-4 h-4" />
                  <span>دخول / تسجيل</span>
                </button>
              )}

              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-garage-850 border border-gray-800 text-gray-300 hover:text-neon-cyan"
                aria-label="القائمة الرئيسية"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-800 bg-[#07090e] p-4 space-y-3">
            {/* Search Input for Mobile */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="ابحث عن سيارة أو خدمة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2.5 rounded-xl bg-garage-900 border border-gray-800 text-xs text-white text-right"
              />
              <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
            </form>

            <nav className="flex flex-col space-y-1 text-right">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-neon-cyan hover:bg-garage-800"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modal (Login / Register) */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
