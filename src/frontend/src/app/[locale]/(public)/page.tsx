import { HeroSection } from "./_components/HeroSection";
import { ServiceGrid } from "./_components/ServiceGrid";
import { WorkflowSection } from "./_components/WorkflowSection";
import { CategoryCards } from "./_components/CategoryCards";
import { HighlightFeatures } from "./_components/HighlightFeatures";
import { PlatformStats } from "./_components/PlatformStats";
import { FAQSection } from "./_components/FAQSection";
import { CTASection } from "./_components/CTASection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500 overflow-hidden">
      <HeroSection />
      
      <main>
        <ServiceGrid />
        <WorkflowSection />
        <CategoryCards />
        <HighlightFeatures />
        <PlatformStats />
        <FAQSection />
        <CTASection />
      </main>
      
      {/* Footer is usually part of the global layout, but if we need a custom one it would go here */}
    </div>
  );
}
