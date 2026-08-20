import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "EGY CPM | متجر كار باركينج الاحترافي لخدمات وتعديل السيارات",
  description:
    "المتجر الأول لبيع وتعديل سيارات لعبة Car Parking Multiplayer، شحن كاش وأموال خضراء 50M، كوينز ذهبي، كينج رانك، وحسابات جاهزة بتسليم فوري وأمان 100%.",
  keywords: [
    "EGY CPM",
    "كار باركينج",
    "شحن كار باركينج",
    "سيارات كار باركينج معدلة",
    "كينج رانك",
    "شحن كاش 50M",
  ],
  openGraph: {
    title: "EGY CPM | متجر كار باركينج الاحترافي",
    description:
      "ورشة تعديل سيارات وخدمات Car Parking Multiplayer مع تسليم فوري وضمان ضد الباند.",
    type: "website",
    locale: "ar_EG",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="bg-[#06070a] text-gray-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-black">
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              background: "#0e121a",
              borderColor: "rgba(0, 240, 255, 0.3)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
