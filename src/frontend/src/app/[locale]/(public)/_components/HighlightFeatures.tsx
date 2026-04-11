"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  Cloud, 
  Wallet, 
  Bell, 
  Lock, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function HighlightFeatures() {
  const t = useTranslations("landing.features");

  const features = [
    { 
      id: "f1", 
      icon: Cloud, 
      translationKey: "cloud"
    },
    { 
      id: "f2", 
      icon: Wallet, 
      translationKey: "wallet"
    },
    { 
      id: "f3", 
      icon: Bell, 
      translationKey: "notifications"
    },
    { 
      id: "f4", 
      icon: Lock, 
      translationKey: "security"
    },
  ];

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-12">
            <ScrollReveal>
              <div className="space-y-4">
                <div className="text-secondary-500 font-bold tracking-widest uppercase text-sm">
                  {t("subtitle")}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white font-arabic ltr:font-english leading-tight">
                  {t("title")}
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <ScrollReveal key={feature.id} delay={index * 0.1}>
                  <div className="flex flex-col gap-4 group">
                    <div className="w-12 h-12 bg-white dark:bg-neutral-900 rounded-xl flex items-center justify-center text-primary-500 shadow-sm border border-neutral-100 dark:border-neutral-800 group-hover:bg-primary-500 group-hover:text-white transition-all">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 font-arabic ltr:font-english">
                        {t(`${feature.translationKey}.title`)}
                      </h4>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                        {t(`${feature.translationKey}.description`)}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal direction="right" className="relative group">
            <div className="aspect-square relative rounded-[40px] overflow-hidden bg-gradient-to-br from-[#006C35] via-[#005C2D] to-neutral-900 p-1 shadow-2xl">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')]" />
               
               <div className="relative w-full h-full bg-neutral-900/50 backdrop-blur-3xl rounded-[39px] flex flex-col items-center justify-center p-12 text-center text-white space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-500 blur-[80px] opacity-20" />
                    <ShieldCheck className="w-32 h-32 text-[#D4A017] relative z-10" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold tracking-tight">أعلى معايير الأمان</h3>
                    <p className="text-neutral-400 max-w-sm mx-auto">
                      نستخدم أحدث تقنيات التشفير والربط المباشر مع مركز المعلومات الوطني لضمان خصوصية بياناتكم.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SSL الموثق</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>نفاذ المعتمد</span>
                    </div>
                  </div>
               </div>
            </div>

            <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute -top-6 -right-6 w-24 h-24 bg-[#D4A017] rounded-3xl blur-[40px] opacity-20" 
            />
            <motion.div 
               animate={{ x: [0, 15, 0] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-500 rounded-full blur-[50px] opacity-20" 
            />
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
