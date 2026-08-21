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
  Menu,
  X,
  Search,
  ChevronDown,
  ShieldAlert,
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
    const handleAuthEvent = () => fetchSession();
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
    { name: "السيارات", href: "/cars" },
    { name: "الخدمات والشحن", href: "/services" },
    { name: "الحسابات", href: "/accounts" },
    { name: "شحن المحفظة", href: "/deposit" },
    { name: "تتبع طلبك", href: "/orders" },
    { name: "الدعم الفني", href: "/support" },
  ];

  const isAdmin = user && ["SUPER_ADMIN", "ADMIN", "SUPPORT", "ORDER_MANAGER"].includes(user.role);
  const isAnnouncementVisible = settings.announcement_visible !== "false";

  // Build single line ticker message
  const tickerText =
    settings.announcement_center ||
    settings.announcement_right ||
    "تسليم فوري لجميع الخدمات والسيارات | كود الخصم: CPM2026 خصم 15% | رقم الإيداع: " +
      (settings.vodafone_cash || "01288212101");

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#0a0c10]/95 backdrop-blur-md">
        {/* News Ticker Top Bar - TV News Style */}
        {isAnnouncementVisible && (
          <div className="bg-[#12161f] border-b border-gray-800 overflow-hidden py-1 px-2 text-xs flex items-center">
            <span className="bg-orange-500 text-black px-2 py-0.5 rounded font-black text-[10px] shrink-0 z-10 ml-2">
              تنبيه
            </span>
            <div className="overflow-hidden whitespace-nowrap w-full relative">
              <div className="news-ticker-content text-gray-300 font-medium text-[11px]">
                {tickerText} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp; {tickerText} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp; {tickerText}
              </div>
            </div>
          </div>
        )}

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isActive
                        ? "text-orange-500 bg-orange-500/10 border border-orange-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Search Bar & Actions */}
            <div className="flex items-center gap-2">
              {/* Search Form (Desktop) */}
              <form onSubmit={handleSearch} className="hidden md:flex relative items-center">
                <input
                  type="text"
                  placeholder="ابحث عن سيارة أو خدمة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 lg:w-52 pl-3 pr-8 py-1.5 rounded-lg bg-[#12161f] border border-gray-800 focus:border-orange-500 text-xs text-white placeholder-gray-500 text-right"
                />
                <button type="submit" className="absolute right-2.5 text-gray-400 hover:text-orange-500">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-lg bg-[#12161f] border border-gray-800 hover:border-orange-500 text-gray-300 hover:text-orange-500 transition"
                aria-label="سلة المشتريات"
              >
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-orange-500 text-black text-[9px] font-black">
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
                    className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#12161f] border border-orange-500/30 text-right"
                  >
                    <div className="flex flex-col text-right leading-tight">
                      <span className="text-xs font-bold text-white max-w-[80px] truncate">
                        {user.name || "الحساب"}
                      </span>
                      <span className="text-[10px] text-orange-500 font-mono font-bold">
                        {formatCurrency(user.wallet?.totalAvailable || 0)}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdown && (
                    <div
                      className="absolute left-0 mt-1.5 w-52 rounded-xl bg-[#12161f] border border-gray-700 shadow-xl p-2 z-50 text-right space-y-1"
                      onClick={() => setUserDropdown(false)}
                    >
                      <div className="p-1.5 border-b border-gray-800 mb-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-orange-500 font-mono">
                          {formatCurrency(user.wallet?.totalAvailable || 0)}
                        </p>
                      </div>

                      <Link
                        href="/wallet"
                        className="flex items-center gap-2 p-1.5 rounded-lg text-xs text-gray-300 hover:bg-gray-800 hover:text-orange-500 transition"
                      >
                        <Wallet className="w-3.5 h-3.5 text-orange-500" />
                        <span>محفظتي وشحن الرصيد</span>
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 p-1.5 rounded-lg text-xs text-gray-300 hover:bg-gray-800 hover:text-orange-500 transition"
                      >
                        <Car className="w-3.5 h-3.5 text-orange-500" />
                        <span>طلباتي ومشترياتي</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin/login"
                          className="flex items-center gap-2 p-1.5 rounded-lg text-xs text-orange-400 bg-orange-500/10 border border-orange-500/30 transition"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>لوحة التحكم الإدارية</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>دخول / تسجيل</span>
                </button>
              )}

              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg bg-[#12161f] border border-gray-800 text-gray-300 hover:text-orange-500"
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-800 bg-[#0a0c10] p-3 space-y-2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="ابحث عن سيارة أو خدمة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg bg-[#12161f] border border-gray-800 text-xs text-white text-right"
              />
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-gray-400" />
            </form>

            <nav className="grid grid-cols-2 gap-1.5 pt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-[#12161f] text-gray-300 hover:text-orange-500 text-xs font-bold text-center"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
