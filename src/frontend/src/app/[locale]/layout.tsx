import {NextIntlClientProvider} from 'next-intl';
import QueryProvider from '@/providers/query-provider';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { Inter, Cairo } from "next/font/google";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Cairo replaces IBM Plex Sans Arabic — matches reference design
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    icons: {
      icon: '/images/logo.png',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className={`${inter.variable} ${cairo.variable} h-full antialiased`} suppressHydrationWarning>
      <body className={cn("min-h-full flex flex-col", locale === 'ar' ? 'font-cairo' : 'font-inter')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
