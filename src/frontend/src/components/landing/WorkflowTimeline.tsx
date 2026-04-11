'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Circle } from 'lucide-react';

export default function WorkflowTimeline() {
  const t = useTranslations('landing.timeline');
  // In next-intl, arrays are usually handled with keys or raw
  // For simplicity here, we'll map through the 10 stages
  const stages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
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

        <div className="relative max-w-5xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800 hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {stages.map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className="flex-1 text-center md:text-start">
                  <div className={`space-y-3 ${index % 2 === 0 ? 'md:text-end' : 'md:text-start'}`}>
                    <div className="text-primary-600 font-mono text-sm font-bold">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
                      {t(`stages.${index}`)}
                    </h3>
                  </div>
                </div>

                {/* Point */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border-2 border-primary-500 shadow-xl shadow-primary-500/20">
                  <div className="w-4 h-4 rounded-full bg-primary-500 animate-pulse" />
                </div>

                {/* Spacer for reverse row */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
