import type { Metadata } from 'next';
import { LocaleProvider } from '@/lib/translations';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: 'مُجاز - منصة رخص القيادة الإلكترونية | Mojaz - Electronic Driving License Platform',
    template: '%s | منصة مُجاز',
  },
  description: 'النظام الرسمي الموحد لإصدار وتجديد رخص القيادة في الجمهورية اليمنية. أنجز معاملتك إلكترونياً بأمان تام وسرعة سيادية. The official unified system for issuing and renewing driving licenses.',
  keywords: ['رخص قيادة', 'مرور', 'إلكتروني', ' Yemen', 'driving license', 'traffic', 'electronic', 'government'],
  authors: [{ name: 'الإدارة العامة للمرور' }],
  creator: 'الإدارة العامة للمرور - Republic of Yemen',
  publisher: 'الإدارة العامة للمرور',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mojaz.traffic.gov.ye'),
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/ar',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    siteName: 'منصة مُجاز - Mojaz Platform',
    title: 'مُجاز - منصة رخص القيادة الإلكترونية',
    description: 'النظام الرسمي الموحد لإصدار وتجديد رخص القيادة. أنجز معاملتك إلكترونياً.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'منصة مُجاز - Mojaz Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مُجاز - منصة رخص القيادة الإلكترونية',
    description: 'أنجز معاملتك إلكترونياً بأمان تام وسرعة سيادية.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

// Structured Data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentService',
  name: 'مُجاز - منصة رخص القيادة الإلكترونية',
  description: 'النظام الرسمي الموحد لإصدار وتجديد رخص القيادة في الجمهورية اليمنية',
  url: 'https://mojaz.traffic.gov.ye',
  provider: {
    '@type': 'GovernmentOrganization',
    name: 'الإدارة العامة للمرور',
    alternateName: 'General Traffic Department',
    url: 'https://traffic.gov.ye',
  },
  areaServed: {
    '@type': 'Country',
    name: 'الجمهورية اليمنية',
    alternateName: 'Republic of Yemen',
  },
  serviceType: ['إصدار رخص القيادة', 'تجديد الرخص', 'رخص دولية', 'Driving License Services'],
};

import PublicHeader from '@/components/layout/PublicHeader';
import Footer from '@/components/layout/Footer';

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider initialLocale="ar">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="flex flex-col min-h-screen">
        <PublicHeader />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </div>
    </LocaleProvider>
  );
}