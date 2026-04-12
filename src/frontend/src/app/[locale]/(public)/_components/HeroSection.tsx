"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StaggeredFade, StaggeredItem } from "@/components/ui/StaggeredFade";

export function HeroSection() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#006C35] pt-16">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated Gradient Mesh Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#006C35] via-[#005C2D] to-[#004C25]" />
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

        {/* Abstract road/motion lines - SVG pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M-10,50 C20,40 40,60 70,50 C100,40 120,60 150,50"
            stroke="#D4A017"
            strokeWidth="0.2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M-10,60 C20,50 40,70 70,60 C100,50 120,70 150,60"
            stroke="#D4A017"
            strokeWidth="0.1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Radial glow for focus */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4A017]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center lg:text-start flex flex-col lg:flex-row items-center gap-12">
          
          <StaggeredFade className="flex-1 space-y-8">
            <StaggeredItem>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-secondary-500 text-sm font-medium mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>المملكة العربية السعودية • منصة مُجاز</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15] font-arabic ltr:font-english">
                {t("title")}
              </h1>
            </StaggeredItem>

            <StaggeredItem>
              <p className="text-lg md:text-xl text-neutral-100/80 max-w-2xl leading-relaxed">
                {t("subtitle")}
              </p>
            </StaggeredItem>

            <StaggeredItem className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-[#D4A017] hover:bg-[#C49000] text-neutral-900 font-bold px-8 h-14 rounded-gov transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(212,160,23,0.3)]"
                >
                  <span className="flex items-center gap-2">
                    {t("cta.start")}
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </span>
                </Button>
              </Link>
              
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 h-14 px-8 rounded-gov transition-all"
                >
                  {t("cta.login")}
                </Button>
              </Link>
            </StaggeredItem>

            {/* Micro-badges */}
            <StaggeredItem className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>دعم كامل للغتين</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>موثق عبر نفاذ</span>
              </div>
            </StaggeredItem>
          </StaggeredFade>

          {/* Abstract License Preview or Illustration */}
          <ScrollReveal direction="right" className="hidden lg:block flex-1 relative h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4A017]/20 to-transparent rounded-3xl blur-3xl" />
            
            {/* Mock License Card / Floating Identity */}
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div 
                animate={{ 
                  y: [0, -20, 0],
                  rotateZ: [2, -2, 2]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-[420px] aspect-[1.6/1] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017]/10 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex justify-between items-start mb-12">
                   <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
                   <div className="space-y-2 text-right">
                     <div className="h-4 w-32 bg-white/20 rounded ml-auto" />
                     <div className="h-3 w-20 bg-white/10 rounded ml-auto" />
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/10 rounded" />
                  <div className="h-2 w-3/4 bg-white/10 rounded" />
                  <div className="h-8 w-48 bg-secondary-500/20 rounded border border-secondary-500/30 flex items-center px-3">
                    <div className="h-2 w-full bg-secondary-500/40 rounded shadow-[0_0_8px_rgba(212,160,23,0.5)]" />
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 text-white/20 font-bold text-4xl select-none group-hover:text-secondary-500/30 transition-colors">
                  MOJAZ
                </div>
              </motion.div>

              {/* Smaller floating element */}
              <motion.div 
                animate={{ 
                  y: [-10, 10, -10],
                  x: [10, -10, 10]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute top-20 right-0 w-24 h-24 bg-[#D4A017]/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg flex items-center justify-center"
              >
                 <ShieldCheck className="w-10 h-10 text-secondary-500" />
              </motion.div>
            </div>
          </ScrollReveal>

        </div>
      </div>

      {/* Hero Bottom Slope */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-neutral-50 dark:fill-neutral-950">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,34.74V0Z" opacity="0.5"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"></path>
        </svg>
      </div>
    </section>
  );
}
