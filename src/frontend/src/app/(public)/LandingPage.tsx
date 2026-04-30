'use client';

import { HeroSection } from './_components/HeroSection';
import { ServiceGrid } from './_components/ServiceGrid';
import { WorkflowSection } from './_components/WorkflowSection';
import { CategoryCards } from './_components/CategoryCards';
import { HighlightFeatures } from './_components/HighlightFeatures';
import { PlatformStats } from './_components/PlatformStats';
import { FAQSection } from './_components/FAQSection';
import { CTASection } from './_components/CTASection';

import type { FC } from 'react';


import PublicHeader from '@/components/layout/PublicHeader';
import Footer from '@/components/layout/Footer';


/**
 * Mojaz Landing Page - Refactored into modular components
 * Consistent with institutional design system (King Blue & Government Gold)
 */
export default function LandingPage() {
  return (<div className="flex flex-col min-h-screen">
    <PublicHeader />
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section - Headline, Main CTA, Institutional Badge */}
      <HeroSection />

      {/* 2. Services Grid - The 8 core electronic services */}
      <ServiceGrid />

      {/* 3. Platform Stats - Counter animations for social proof/trust */}
      <PlatformStats />

      {/* 4. Workflow Timeline - Step-by-step application process */}
      <WorkflowSection />

      {/* 5. License Categories - Visual display of available categories (A-F) */}
      <CategoryCards />

      {/* 6. Highlight Features - Secure, Digital, Fast highlights */}
      <HighlightFeatures />

      {/* 7. FAQ Section - Common queries (Legal/Procedural) */}
      <FAQSection />

      {/* 8. Call to Action - Final conversion section */}
      <CTASection />
    </main>

    <Footer />
  </div>
  );
}