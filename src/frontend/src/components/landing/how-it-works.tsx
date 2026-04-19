"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  UserPlus,
  FileText,
  FileCheck,
  Stethoscope,
  ClipboardCheck,
  Award,
} from "lucide-react";

const steps = [
  { icon: UserPlus, titleKey: "step1Title", descKey: "step1Desc" },
  { icon: FileText, titleKey: "step2Title", descKey: "step2Desc" },
  { icon: FileCheck, titleKey: "step3Title", descKey: "step3Desc" },
  { icon: Stethoscope, titleKey: "step4Title", descKey: "step4Desc" },
  { icon: ClipboardCheck, titleKey: "step5Title", descKey: "step5Desc" },
  { icon: Award, titleKey: "step6Title", descKey: "step6Desc" },
];

export function HowItWorks() {
  const t = useTranslations("landing");
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            {t("howItWorksTitle")}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t("howItWorksSubtitle")}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary/20 -translate-x-1/2 hidden lg:block" />

          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`relative flex flex-col lg:flex-row items-center gap-4 lg:gap-8 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <div
                    className={`flex-1 ${
                      isEven ? "lg:text-end" : "lg:text-start"
                    }`}
                  >
                    <div
                      className={`inline-block p-6 bg-card rounded-xl border border-border shadow-sm ${
                        isEven ? "lg:mr-4" : "lg:ml-4"
                      }`}
                    >
                      <div className={`flex items-center gap-3 mb-2 ${isEven ? "lg:justify-end" : ""}`}>
                        <div className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {t(step.titleKey)}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        {t(step.descKey)}
                      </p>
                    </div>
                  </div>

                  {/* Center Icon (Desktop) */}
                  <div className="hidden lg:flex items-center justify-center z-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
