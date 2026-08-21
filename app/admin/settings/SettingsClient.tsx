"use client";

import React, { useState } from "react";
import { updateStoreSettings } from "@/lib/actions/settings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Save,
  Download,
  Database,
  Loader2,
  Megaphone,
  Type,
  CreditCard,
  Sliders,
  PhoneCall,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState<"ANNOUNCEMENT" | "TEXTS" | "PAYMENT" | "BACKUP">("ANNOUNCEMENT");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateStoreSettings(settings);
      toast.success("تم حفظ التعديلات وتطبيقها فوراً على كامل الموقع!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "فشل حفظ الإعدادات.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBackup = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/backup");
      if (!res.ok) throw new Error("فشل توليد النسخة الاحتياطية.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `egy_cpm_backup_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("تم تنزيل النسخة الاحتياطية لقاعدة البيانات بنجاح 💾");
    } catch (err: any) {
      toast.error(err.message || "فشل تنزيل النسخة الاحتياطية.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-garage-900 border border-gray-800 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab("ANNOUNCEMENT")}
          className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === "ANNOUNCEMENT"
              ? "bg-gradient-to-r from-neon-cyan to-neon-blue text-black shadow-glow-cyan-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>بار الإعلان العلوي</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("TEXTS")}
          className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === "TEXTS"
              ? "bg-gradient-to-r from-neon-cyan to-neon-blue text-black shadow-glow-cyan-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Type className="w-4 h-4" />
          <span>نصوص وهوية المتجر</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PAYMENT")}
          className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === "PAYMENT"
              ? "bg-gradient-to-r from-neon-cyan to-neon-blue text-black shadow-glow-cyan-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>أرقام الدفع والكاش</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("BACKUP")}
          className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === "BACKUP"
              ? "bg-gradient-to-r from-neon-cyan to-neon-blue text-black shadow-glow-cyan-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>النسخ الاحتياطي</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: TOP ANNOUNCEMENT BAR */}
        {activeTab === "ANNOUNCEMENT" && (
          <div className="p-6 rounded-3xl bg-garage-900 border border-cyan-500/30 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-neon-cyan" />
                  <span>تعديل بار الإعلان العلوي (Top Announcement Bar)</span>
                </h3>
                <p className="text-xs text-gray-400">
                  التحكم الكامل بالنصوص المعروضة في الشريط الملون أعلى الموقع
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-garage-850 px-3 py-1.5 rounded-xl border border-gray-700">
                <input
                  type="checkbox"
                  checked={settings.announcement_visible !== "false"}
                  onChange={(e) => handleChange("announcement_visible", e.target.checked ? "true" : "false")}
                  className="rounded accent-cyan-400"
                />
                <span className="text-xs text-gray-300 font-bold">تفعيل وإظهار الشريط</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  نص شريط الأخبار المتحرك (News Ticker)
                </label>
                <input
                  type="text"
                  value={settings.announcement_center || "تسليم فوري لجميع الخدمات والسيارات | كود خصم: CPM2026 خصم 15% على جميع الأقسام | رقم الإيداع: 01288212101"}
                  onChange={(e) => handleChange("announcement_center", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right"
                  placeholder="اكتب الإعلان الكامل الذي يتحرك كسطر أخبار..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STORE TEXTS & HERO */}
        {activeTab === "TEXTS" && (
          <div className="p-6 rounded-3xl bg-garage-900 border border-cyan-500/30 space-y-5">
            <div className="border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Type className="w-5 h-5 text-neon-cyan" />
                <span>نصوص وهوية المتجر والشاشة الرئيسية (CMS)</span>
              </h3>
              <p className="text-xs text-gray-400">
                تعديل اسم المتجر، الشعار، رابط اللوجو، والبيانات التعريفية
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">اسم المتجر الأساسي</label>
                  <input
                    type="text"
                    value={settings.store_name || "EGY CPM"}
                    onChange={(e) => handleChange("store_name", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">الشعار اللفظي (Slogan)</label>
                  <input
                    type="text"
                    value={settings.store_slogan || "Car Parking Marketplace"}
                    onChange={(e) => handleChange("store_slogan", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">رابط صورة اللوجو (اختياري)</label>
                <input
                  type="url"
                  placeholder="https://... (اتركه فارغاً لاستخدام أيقونة السيارة الافتراضية)"
                  value={settings.store_logo_url || ""}
                  onChange={(e) => handleChange("store_logo_url", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right dir-ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">شارة الهيدر المميزة (Hero Badge)</label>
                <input
                  type="text"
                  value={settings.hero_badge || "متجر كار باركينج الرسمي #1"}
                  onChange={(e) => handleChange("hero_badge", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">العنوان الرئيسي الملون (Hero Title)</label>
                <input
                  type="text"
                  value={settings.hero_title || "خدمات وسيارات وتعديلات احترافية"}
                  onChange={(e) => handleChange("hero_title", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">الوصف الترويجي في الشاشة الرئيسية</label>
                <textarea
                  rows={3}
                  value={settings.hero_description || "المتجر الأقوى لشراء سيارات دريفت وسرعة معدلة 1695HP، سيارات رسم وتصميمات نادرة، شحن أموال خضراء 50M وكوينز ذهبي وتفعيل الكينج رانك الملكي وحسابات جاهزة بتسليم فوري وضمان ضد الباند 100%."}
                  onChange={(e) => handleChange("hero_description", e.target.value)}
                  className="w-full p-3 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">الوصف التعريفي في الفوتر (Footer Bio)</label>
                <textarea
                  rows={2}
                  value={settings.footer_bio || "المتجر الأول والمتخصص في خدمات لعبة Car Parking Multiplayer على الهواتف. سيارات مرسومة، تعديل محركات 1695HP، كينج رانك، شحن كاش وكوينز بأمان 100%."}
                  onChange={(e) => handleChange("footer_bio", e.target.value)}
                  className="w-full p-3 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">نص شارة الضمان في الفوتر</label>
                  <input
                    type="text"
                    value={settings.footer_guarantee || "ضمان ضد الباند 100% وتسليم فوري"}
                    onChange={(e) => handleChange("footer_guarantee", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">حقوق الملكية (Copyright)</label>
                  <input
                    type="text"
                    value={settings.footer_copyright || "© 2026 EGY CPM. جميع الحقوق محفوظة لمتجر كار باركينج."}
                    onChange={(e) => handleChange("footer_copyright", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT & CASH NUMBERS */}
        {activeTab === "PAYMENT" && (
          <div className="p-6 rounded-3xl bg-garage-900 border border-cyan-500/30 space-y-5">
            <div className="border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-neon-cyan" />
                <span>أرقام التحويل وطرق الدفع والاتصال</span>
              </h3>
              <p className="text-xs text-gray-400">
                تعديل أرقام فودافون كاش، اتصالات، أورنج، وي باي، وقنوات الدعم
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">رقم فودافون كاش</label>
                <input
                  type="text"
                  value={settings.vodafone_cash || "01288212101"}
                  onChange={(e) => handleChange("vodafone_cash", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right dir-ltr font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">رقم أورنج كاش</label>
                <input
                  type="text"
                  value={settings.orange_cash || "01288212101"}
                  onChange={(e) => handleChange("orange_cash", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right dir-ltr font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">رقم اتصالات كاش</label>
                <input
                  type="text"
                  value={settings.etisalat_cash || "01288212101"}
                  onChange={(e) => handleChange("etisalat_cash", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right dir-ltr font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">رقم وي باي (WE Pay)</label>
                <input
                  type="text"
                  value={settings.we_pay || "01288212101"}
                  onChange={(e) => handleChange("we_pay", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right dir-ltr font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">الحد الأدنى للشحن (ج.م)</label>
                <input
                  type="number"
                  value={settings.min_deposit || "50"}
                  onChange={(e) => handleChange("min_deposit", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">الحد الأقصى للشحن (ج.م)</label>
                <input
                  type="number"
                  value={settings.max_deposit || "20000"}
                  onChange={(e) => handleChange("max_deposit", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-garage-850 border border-gray-700 rounded-xl text-xs text-white focus:border-neon-cyan text-right font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BACKUP */}
        {activeTab === "BACKUP" && (
          <div className="p-6 rounded-3xl bg-garage-900 border border-purple-500/30 space-y-4">
            <div className="flex items-center gap-2 text-neon-purple font-bold text-sm">
              <Database className="w-5 h-5" />
              <span>النسخ الاحتياطي لقاعدة البيانات (Database Backup)</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              تحميل نسخة احتياطية كاملة بصيغة JSON تحتوي على كافة بيانات المستخدمين، المحافظ، المعاملات، السيارات، والطلبات لحمايتها من أي فقدان.
            </p>

            <button
              type="button"
              onClick={handleDownloadBackup}
              disabled={isExporting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold text-xs shadow-glow-purple flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>تنزيل نسخة احتياطية كاملة الآن 💾</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Submit Save Button */}
        {activeTab !== "BACKUP" && (
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-black text-sm shadow-glow-cyan hover:scale-[1.01] active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>حفظ التعديلات وتطبيقها فوراً على الموقع 🚀</span>
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
}
