"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { createOrder } from "@/lib/actions/order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import Link from "next/link";
import {
  Wallet,
  ShieldCheck,
  Zap,
  Lock,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Gamepad2,
  KeyRound,
  FileText,
  Sparkles,
} from "lucide-react";
import AuthModal from "@/components/shared/AuthModal";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, appliedCoupon, getSubtotal, getDiscount, getTotal, clearCart } = useCartStore();

  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Form Fields
  const [gameUsername, setGameUsername] = useState("");
  const [gamePassword, setGamePassword] = useState("");
  const [gamePlayerId, setGamePlayerId] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  // Fetch session & live wallet
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchSession();

    window.addEventListener("cpm_auth_changed", fetchSession);
    window.addEventListener("focus", fetchSession);

    return () => {
      window.removeEventListener("cpm_auth_changed", fetchSession);
      window.removeEventListener("focus", fetchSession);
    };
  }, []);

  const walletBalance = user?.wallet?.totalAvailable || 0;
  const isBalanceSufficient = walletBalance >= total;
  const remainingBalance = Math.max(0, walletBalance - total);

  // Check if any item in cart requires game credentials
  const requiresGameCredentials = items.some(
    (i) => i.productType === "SERVICE" || i.productType === "MODIFIED_CAR" || i.serviceRequirements
  );

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (items.length === 0) {
      toast.error("سلة التسوق فارغة.");
      router.push("/shop");
      return;
    }

    if (!isBalanceSufficient) {
      toast.error("رصيد المحفظة غير كافٍ لإتمام عملية الشراء. يرجى شحن محفظتك أولاً.");
      return;
    }

    if (requiresGameCredentials && !gameUsername.trim()) {
      toast.error("يرجى إدخال اسم الحساب أو البريد الخاص بلعبة كار باركينج.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        couponCode: appliedCoupon?.code || null,
        gameUsername: gameUsername.trim() || null,
        gamePassword: gamePassword || null,
        gamePlayerId: gamePlayerId.trim() || null,
        customerNotes: customerNotes.trim() || null,
      });

      if (res.success && res.order) {
        // Fire celebration confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }

        toast.success(`تم إنشاء الطلب رقم ${res.order.orderNumber} بنجاح! 🚀`);
        clearCart();
        router.push(`/orders/${res.order.orderNumber}`);
      }
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء معالجة الطلب.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">لا توجد منتجات للدفع</h2>
        <p className="text-xs text-gray-400">سلتك فارغة، أضف بعض المنتجات أولاً للمتابعة.</p>
        <Link href="/shop" className="px-6 py-2.5 rounded-xl bg-neon-cyan text-black font-bold text-xs inline-block">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-right space-y-8">
        {/* Header */}
        <div className="space-y-1 border-b border-gray-800 pb-4">
          <span className="text-xs font-mono font-bold text-neon-cyan uppercase">
            Safe Gaming Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            تأكيد الدفع وإنشاء الطلب
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Column: Game Credentials & Notes */}
          <div className="lg:col-span-7 space-y-6">
            {/* User Identification Notice */}
            {!user ? (
              <div className="p-5 rounded-2xl bg-garage-900 border border-cyan-500/30 flex items-center justify-between shadow-glow-cyan-sm">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">يجب تسجيل الدخول أو إنشاء حساب أولاً</h4>
                  <p className="text-xs text-gray-400">لحفظ طلباتك وإتمام الدفع من رصيد محفظتك</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold text-xs hover:scale-105 transition"
                >
                  تسجيل الدخول / حساب جديد
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-garage-900 border border-gray-800 flex items-center gap-3">
                <img
                  src={user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40"
                />
                <div>
                  <span className="text-[10px] text-gray-400">حساب المشتري:</span>
                  <h4 className="text-xs font-bold text-white">{user.name} ({user.email})</h4>
                </div>
              </div>
            )}

            {/* Game Account Credentials Form (If required) */}
            <div className="p-6 rounded-3xl bg-garage-900/90 border border-gray-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Gamepad2 className="w-5 h-5 text-neon-cyan" />
                <span>بيانات حساب لعبة Car Parking Multiplayer</span>
              </div>

              {requiresGameCredentials ? (
                <p className="text-xs text-gray-400 leading-relaxed">
                  المنتجات المحددة تتطلب الوصول لحسابك لإجراء التعديل أو شحن الأموال.
                </p>
              ) : (
                <p className="text-xs text-gray-400 leading-relaxed">
                  (اختياري) يمكنك كتابة ID اللاعب داخل اللعبة لتسهيل التواصل والتسليم.
                </p>
              )}

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    بريد أو اسم حساب اللعبة (Game Email / ID) *
                  </label>
                  <input
                    type="text"
                    required={requiresGameCredentials}
                    placeholder="مثال: your_cpm_email@gmail.com أو Player ID"
                    value={gameUsername}
                    onChange={(e) => setGameUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:border-neon-cyan text-right dir-ltr"
                  />
                </div>

                {requiresGameCredentials && (
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      كلمة مرور حساب اللعبة (Game Password) *
                    </label>
                    <input
                      type="password"
                      required={requiresGameCredentials}
                      placeholder="••••••••"
                      value={gamePassword}
                      onChange={(e) => setGamePassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:border-neon-cyan text-right dir-ltr"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    ملاحظات أو طلبات خاصة لفريق التنفيذ (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="اكتب أي تعليمات إضافية مثل نوع ولون الدخان المفضل..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full p-3 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:border-neon-cyan text-right"
                  />
                </div>
              </div>

              {/* Security Pledge Banner */}
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2.5 text-xs text-cyan-200 mt-4">
                <Lock className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>تعهد الخصوصية والأمان:</strong> بيانات حسابك مشفرة بالكامل بنظام AES-256 وتستخدم فقط من قِبل المتخصص لتنفيذ طلبك ولا يتم مشاركتها أو حفظها في أي سجلات عامة.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Wallet Deduction & Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Wallet Balance Card */}
            <div className="p-6 rounded-3xl bg-garage-900 border border-cyan-500/40 shadow-glow-cyan-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-neon-green" />
                  <h3 className="font-bold text-sm text-white">الدفع من رصيد المحفظة</h3>
                </div>
                <span className="text-[10px] text-neon-cyan font-mono bg-cyan-500/10 px-2 py-0.5 rounded">
                  الوسيلة المعتمدة الوحيدة
                </span>
              </div>

              {/* Financial Balance Overview */}
              <div className="p-4 rounded-2xl bg-garage-850 border border-gray-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">رصيد محفظتك الحالي:</span>
                  <span className="font-extrabold text-sm text-neon-green">
                    {formatCurrency(walletBalance)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">إجمالي الطلب المطلوب:</span>
                  <span className="font-extrabold text-sm text-neon-cyan">
                    -{formatCurrency(total)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-800 text-sm">
                  <span className="font-bold text-gray-300">الرصيد المتبقي بعد الشراء:</span>
                  <span className={`font-black ${isBalanceSufficient ? "text-white" : "text-neon-red"}`}>
                    {formatCurrency(remainingBalance)}
                  </span>
                </div>
              </div>

              {/* Insufficient Balance Alert */}
              {!isBalanceSufficient && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>رصيد المحفظة غير كافٍ لإتمام عملية الشراء.</span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    المبلغ المتبقي للشحن: <strong>{formatCurrency(total - walletBalance)}</strong>
                  </p>
                  <Link
                    href="/deposit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-neon-green to-emerald-500 text-black font-extrabold text-xs text-center block shadow-glow-green hover:scale-105 transition"
                  >
                    شحن رصيد المحفظة الآن ⚡
                  </Link>
                </div>
              )}

              {/* Products Mini List */}
              <div className="space-y-2 pt-2 border-t border-gray-800 text-xs">
                <span className="text-gray-400 font-bold block mb-2">عناصر الطلب ({items.length}):</span>
                {items.map((it) => (
                  <div key={it.productId} className="flex justify-between text-gray-300">
                    <span className="truncate max-w-[200px]">{it.name} (x{it.quantity})</span>
                    <span className="font-bold text-white">{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Confirm and Pay Button */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isSubmitting || (!isBalanceSufficient && Boolean(user))}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple text-black font-black text-sm shadow-glow-cyan hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>تأكيد الخصم والشراء الفوري ({formatCurrency(total)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
