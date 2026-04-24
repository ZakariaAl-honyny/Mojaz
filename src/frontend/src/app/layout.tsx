import QueryProvider from '@/providers/query-provider';
import { Cairo, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Metadata, Viewport } from 'next';
import "./globals.css";
import { PRIMARY_COLOR } from '@/lib/constants';
import { Toaster } from '@/components/ui/toaster';

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-english",
  display: 'swap',
});
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic-plex",
});

export const metadata: Metadata = {
  title: 'منصة مُجاز | نظام إصدار رخص القيادة الإلكتروني',
  description: 'المنصة الرسمية الموحدة لإصدار وتجديد رخص القيادة - الإدارة العامة للمرور',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a3a8f', // King Blue
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable} ${ibmPlexArabic.variable} h-full antialiased`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 font-arabic">
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}