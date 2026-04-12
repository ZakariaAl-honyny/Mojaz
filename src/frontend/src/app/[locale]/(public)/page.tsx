import { setRequestLocale } from 'next-intl/server';
import Hero from "@/components/landing/Hero";
import ServiceGrid from "@/components/landing/ServiceGrid";
import WorkflowTimeline from "@/components/landing/WorkflowTimeline";
import CategorySection from "@/components/landing/CategorySection";
import Features from "@/components/landing/Features";
import StatsSection from "@/components/landing/StatsSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";

export default async function LandingPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-500 overflow-hidden">
      <Hero />
      
      <main>
        <ServiceGrid />
        <WorkflowTimeline />
        <CategorySection />
        <Features />
        <StatsSection />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
}
