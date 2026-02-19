import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "أرزاق | حسّن سيرتك الذاتية مجاناً",
  description: "موقع مجاني لتحليل وتحسين السيرة الذاتية باستخدام الذكاء الاصطناعي - مخصص للسوق السعودي",
  keywords: ["سيرة ذاتية", "CV", "وظائف", "السعودية", "تحسين السيرة الذاتية"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${ibmPlexArabic.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
