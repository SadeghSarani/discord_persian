import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "دیسکافه | پلتفرم گیمینگ و دورهمی گیمرهای ایرانی (Discord IR)",
  description: "چت متنی، ویس‌روم، ویدیو کال و اشتراک صفحه با رابط کاربری دیسکورد فارسی و سرورهای ایرانی",
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
