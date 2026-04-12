"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  Bike, 
  Car, 
  Bus, 
  Truck, 
  HardHat, 
  Tractor 
} from "lucide-react";
import { StaggeredFade, StaggeredItem } from "@/components/ui/StaggeredFade";

export function CategoryCards() {
  const t = useTranslations("landing.categories");

  const categories = [
    { code: "A", icon: Bike, age: 16, translationKey: "a" },
    { code: "B", icon: Car, age: 18, translationKey: "b" },
    { code: "C", icon: Bus, age: 21, translationKey: "c" },
    { code: "D", icon: Truck, age: 21, translationKey: "d" },
    { code: "E", icon: HardHat, age: 21, translationKey: "e" },
    { code: "F", icon: Tractor, age: 18, translationKey: "f" },
  ];

  return (
    <section className="py-24 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-baseline gap-4 mb-16 border-b border-neutral-100 dark:border-neutral-800 pb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-arabic ltr:font-english">
            {t("title")}
          </h2>
          <div className="h-1 w-24 bg-primary-500 rounded-full" />
        </div>

        <StaggeredFade className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <StaggeredItem key={category.code}>
              <div className="group relative p-8 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-gov hover:border-primary-500/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                    <category.icon className="w-8 h-8" />
                  </div>
                  <span className="text-5xl font-black text-neutral-200 dark:text-neutral-800 group-hover:text-primary-500/10 transition-colors">
                    {category.code}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white font-arabic ltr:font-english">
                    {t(category.translationKey)}
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary-500/10 text-secondary-600 text-sm font-bold">
                    <span>{t("age_requirement", { age: category.age })}</span>
                  </div>
                </div>

                {/* Decorative sharp borders */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-primary-500/20 transition-all rounded-tr-gov" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-primary-500/20 transition-all rounded-bl-gov" />
              </div>
            </StaggeredItem>
          ))}
        </StaggeredFade>
      </div>
    </section>
  );
}
