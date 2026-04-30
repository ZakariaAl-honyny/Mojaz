import type { Metadata } from 'next';


// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: 'مُجاز - منصة رخص القيادة الإلكترونية',
    template: '%s | منصة مُجاز',
  },
  description: 'النظام الرسمي الموحد لإصدار وتجديد رخص القيادة في الجمهورية اليمنية. أنجز معاملتك إلكترونياً بأمان تام وسرعة سيادية.',
  keywords: ['رخص قيادة', 'مرور', 'إلكتروني', 'اليمن', 'نظام المرور', 'وزارة الداخلية'],
  authors: [{ name: 'الإدارة العامة للمرور' }],
  creator: 'الإدارة العامة للمرور - الجمهورية اليمنية',
  publisher: 'الإدارة العامة للمرور',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mojaz.traffic.gov.ye'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_YE',
    siteName: 'منصة مُجاز',
    title: 'مُجاز - منصة رخص القيادة الإلكترونية',
    description: 'أنجز معاملتك إلكترونياً بأمان تام وسرعة سيادية.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'منصة مُجاز',
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
    url: 'https://traffic.gov.ye',
  },
  areaServed: {
    '@type': 'Country',
    name: 'الجمهورية اليمنية',
  },
  serviceType: ['إصدار رخص القيادة', 'تجديد الرخص', 'رخص دولية'],
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="flex-1">
        {children}
      </main>
  );
}