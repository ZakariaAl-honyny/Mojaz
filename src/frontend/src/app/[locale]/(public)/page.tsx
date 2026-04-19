import { setRequestLocale } from 'next-intl/server';
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LicenseCategories } from "@/components/landing/license-categories";
import { Features } from "@/components/landing/features";
import { Stats } from "@/components/landing/stats";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default async function LandingPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <HowItWorks />
      <LicenseCategories />
      <Features />
      <Stats />
      <FAQ />
      <Footer />
    </main>
  );
}