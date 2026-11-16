import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080b11",
};

export const metadata: Metadata = {
  title: "نکسوس (NEXUS) | پلتفرم گفتگوی صوتی، متنی و کامیونیتی‌های ایرانی",
  description: "به پلتفرم نسل جدید گیمرها و کامیونیتی‌های ایرانی بپیوندید. اتصال صوتی با پینگ پایین، رادار سیگنال برای تشکیل اسکواد، مومنت‌های موقت و سیارات موضوعی بدون فیلترینگ.",
  keywords: ["نکسوس", "دیسکورد فارسی", "گیمینگ ایران", "ویس چت بازی", "کامیونیتی گیمرها", "اسکواد گیمینگ", "NEXUS"],
  authors: [{ name: "تیم نکسوس" }],
  openGraph: {
    title: "نکسوس (NEXUS) | پلتفرم ارتباطی و دورهمی گیمرهای ایرانی",
    description: "مکالمات صوتی کم‌تاخیر، سیگنال رادار برای پیدا کردن هم‌بازی و کهکشان کامیونیتی‌ها.",
    url: "https://nexus-app.ir",
    siteName: "NEXUS Iran",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "نکسوس (NEXUS) | پلتفرم گفتگوی گیمرهای ایرانی",
    description: "مکالمات صوتی و متنی، رادار سیگنال و دورهمی‌های اختصاصی بدون قطعی.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-[#1e1f22] text-[#dbdee1] font-vazir select-none">
        {children}
      </body>
    </html>
  );
}
