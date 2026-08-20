"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, UserPlus, LogIn, Lock, Mail, User, Phone, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "فشل تسجيل الدخول");
      }

      toast.success(`مرحباً بك مجدداً ${data.user.name || "يا بطل"}! 🏎️`);
      resetForm();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cpm_auth_changed"));
      }
      onClose();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    if (password.length < 5) {
      toast.error("كلمة المرور يجب ألا تقل عن 5 أحرف أو أرقام.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || email.split("@")[0],
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "فشل إنشاء الحساب.");
      }

      toast.success(`تم إنشاء حسابك بنجاح! مرحباً بك ${data.user.name} 🚀`);
      resetForm();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cpm_auth_changed"));
      }
      onClose();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء إنشاء الحساب.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoGamer = () => {
    setEmail("gamer@gmail.com");
    setPassword("gamer123456");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0e121a] border border-cyan-500/40 rounded-3xl p-6 shadow-glow-cyan overflow-hidden z-10 text-right"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-xl bg-garage-800 text-gray-400 hover:text-white hover:bg-garage-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center pt-2 pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-neon-cyan mb-2 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white tracking-wide">
                حسابك في CPM GARAGE
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                سجل الدخول أو أنشئ حسابك للاستفادة من المحفظة وشراء السيارات والخدمات
              </p>
            </div>

            {/* Tabs (Login / Register) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-garage-900 border border-gray-800 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setActiveTab("LOGIN")}
                className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "LOGIN"
                    ? "bg-neon-cyan text-black shadow-glow-cyan-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("REGISTER")}
                className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "REGISTER"
                    ? "bg-neon-cyan text-black shadow-glow-cyan-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>إنشاء حساب جديد</span>
              </button>
            </div>

            {/* LOGIN FORM */}
            {activeTab === "LOGIN" && (
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition text-right dir-ltr"
                    />
                    <Mail className="w-4 h-4 absolute right-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition text-right dir-ltr"
                    />
                    <Lock className="w-4 h-4 absolute right-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center justify-end text-[11px] pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("REGISTER")}
                    className="text-gray-400 hover:text-white"
                  >
                    ليس لديك حساب؟ <span className="text-neon-cyan font-bold">سجل الآن</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-extrabold text-xs shadow-glow-cyan hover:scale-[1.01] active:scale-[0.98] transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>تسجيل الدخول للمتجر</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === "REGISTER" && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    الاسم أو اسم الجيمر *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد الدوسري أو CPM_King"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition text-right"
                    />
                    <User className="w-4 h-4 absolute right-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    البريد الإلكتروني *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition text-right dir-ltr"
                    />
                    <Mail className="w-4 h-4 absolute right-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    رقم الهاتف / الواتساب (اختياري)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="01234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition text-right dir-ltr font-mono"
                    />
                    <Phone className="w-4 h-4 absolute right-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      كلمة المرور *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        minLength={5}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-2 pr-8 py-2.5 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition text-right dir-ltr"
                      />
                      <Lock className="w-3.5 h-3.5 absolute right-2.5 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      تأكيد كلمة المرور *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        minLength={5}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-2 pr-8 py-2.5 bg-garage-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition text-right dir-ltr"
                      />
                      <Lock className="w-3.5 h-3.5 absolute right-2.5 top-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-extrabold text-xs shadow-glow-cyan hover:scale-[1.01] active:scale-[0.98] transition flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>إنشاء الحساب والبدء 🚀</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security Notice */}
            <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
              <span>بياناتك ومحفظتك مشفرة ومحمية بالكامل داخل المتجر</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
