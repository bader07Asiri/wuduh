import type { Metadata } from "next";
import { Tajawal, Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { clerkArabic } from "@/lib/clerk-ar";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://wuduh-app.vercel.app";

export const metadata: Metadata = {
  title: "وضوح | Wuduh - إدارة مشاريع باحترافية PMP",
  description: "منصة ذكاء اصطناعي متخصصة في إدارة المشاريع وفق معايير PMI/PMBOK. ابنِ خطة مشروعك الكاملة في دقائق.",
  keywords: ["إدارة مشاريع", "PMP", "PMI", "PMBOK", "ذكاء اصطناعي", "project management"],
  authors: [{ name: "Wuduh" }],
  metadataBase: new URL(APP_URL),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "وضوح | Wuduh - إدارة مشاريع باحترافية PMP",
    description: "إدارة مشاريعك باحترافية PMP - بدون مدير مشاريع",
    locale: "ar_SA",
    type: "website",
    url: APP_URL,
    siteName: "وضوح | Wuduh",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wuduh - منصة إدارة المشاريع",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "وضوح | Wuduh",
    description: "إدارة مشاريعك باحترافية PMP - بدون مدير مشاريع",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={clerkArabic}>
      <html lang="ar" dir="rtl" className={`${tajawal.variable} ${montserrat.variable}`}>
        <body className="font-arabic bg-slate-50 text-slate-900 antialiased">
          {children}
          <Toaster position="top-center" richColors dir="rtl" />
        </body>
      </html>
    </ClerkProvider>
  );
}
