'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card } from '../ui/card';
import { 
  Bike, 
  Car, 
  Truck, 
  Bus, 
  Dna, // Placeholder for heavy
  Leaf // Placeholder for agricultural
} from 'lucide-react';

const icons = {
  A: Bike,
  B: Car,
  C: Truck,
  D: Bus,
  E: Truck, // Heavy
  F: Leaf // Agricultural
};

export default function CategorySection() {
  const t = useTranslations('landing.categories');
  const catKeys = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <section className="py-24 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-600 font-semibold tracking-wide uppercase text-sm"
          >
            {t('title')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white"
          >
            {t('subtitle')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catKeys.map((key, i) => {
            const Icon = icons[key as keyof typeof icons];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="group relative overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-8 h-full border border-transparent hover:border-primary-500/20 transition-all duration-500">
                  <div className="flex justify-between items-start mb-12">
                     <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black flex items-center justify-center text-primary-600 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="text-4xl font-black text-neutral-200 dark:text-neutral-800 group-hover:text-primary-500/10 transition-colors">
                      {key}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {t(`types.${key}`)}
                    </h3>
                    <div className="flex items-center gap-2">
                       <div className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold">
                        {key === 'A' ? 'Min Age 16' : 'Min Age 18+'}
                      </div>
                    </div>
                  </div>

                  {/* Hover Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 translate-y-1 group-hover:translate-y-0 transition-transform duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
