"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  FilePlus, 
  RotateCcw, 
  Copy, 
  ArrowUpCircle, 
  Globe, 
  Tractor, 
  Clock, 
  GraduationCap 
} from "lucide-react";
import Link from "next/link";
import { StaggeredFade, StaggeredItem } from "@/components/ui/StaggeredFade";

export function ServiceGrid() {
  const t = useTranslations("landing.services");

  const services = [
    { id: "new", icon: FilePlus, translationKey: "new_license", href: "/applications/new" },
    { id: "renewal", icon: RotateCcw, translationKey: "renewal", href: "/applications/new?service=renewal" },
    { id: "replacement", icon: Copy, translationKey: "replacement", href: "/applications/new?service=replacement" },
    { id: "upgrade", icon: ArrowUpCircle, translationKey: "upgrade", href: "/applications/new?service=upgrade" },
    { id: "international", icon: Globe, translationKey: "international", href: "/applications/new?service=international" },
    { id: "agricultural", icon: Tractor, translationKey: "agricultural", href: "/applications/new?service=agricultural" },
    { id: "probationary", icon: Clock, translationKey: "probationary", href: "/applications/new?service=probationary" },
    { id: "learner", icon: GraduationCap, translationKey: "learner", href: "/applications/new?service=learner" },
  ];

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-arabic ltr:font-english">
            {t("title")}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {t("description")}
          </p>
        </div>

        <StaggeredFade className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <StaggeredItem key={service.id}>
              <Link 
                href={service.href}
                className="group relative block h-full p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-gov transition-all hover:border-secondary-500/50 hover:shadow-xl hover:shadow-secondary-500/5 overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <div className="absolute -inset-px bg-gradient-to-br from-secondary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 group-hover:scale-110 group-hover:bg-secondary-50 dark:group-hover:bg-secondary-900/20 group-hover:text-secondary-500 transition-all duration-300">
                    <service.icon className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white font-arabic ltr:font-english">
                      {t(`items.${service.translationKey}.title`)}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-2">
                      {t(`items.${service.translationKey}.description`)}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center text-sm font-semibold text-primary-500 group-hover:text-secondary-500 transition-colors">
                    <span className="ltr:mr-2 rtl:ml-2">استكشف الخدمة</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                       →
                    </motion.span>
                  </div>
                </div>
              </Link>
            </StaggeredItem>
          ))}
        </StaggeredFade>
      </div>
    </section>
  );
}
