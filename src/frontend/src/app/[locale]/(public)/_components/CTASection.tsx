"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function CTASection() {
  const t = useTranslations("landing.cta");

  return (
    <section className="py-24 relative overflow-hidden bg-neutral-900 dark:bg-[#002C15]">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500 rounded-full blur-[160px] opacity-20" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500 rounded-full blur-[160px] opacity-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto rounded-[32px] overflow-hidden bg-gradient-to-br from-[#006C35] to-[#004C25] p-8 md:p-16 text-center space-y-10 shadow-3xl border border-white/10">
          <ScrollReveal>
             <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#D4A017] text-sm font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>انضم لأكثر من 4 مليون مستخدم</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight font-arabic ltr:font-english leading-[1.2]">
                  {t("title")}
                </h2>
                <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  {t("subtitle")}
                </p>
             </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-[#D4A017] hover:bg-[#C49000] text-neutral-900 font-bold px-12 h-16 rounded-2xl text-xl shadow-[0_0_30px_rgba(212,160,23,0.3)] transition-all hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center gap-3">
                    {t("button")}
                    <ArrowRight className="w-6 h-6 rtl:rotate-180" />
                  </span>
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <div className="pt-10 flex flex-wrap justify-center gap-8 text-white/40 text-sm">
             <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                <span>إصدار فوري</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                <span>دفع آمن</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                <span>متاح 24/7</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
