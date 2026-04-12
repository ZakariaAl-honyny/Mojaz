'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const t = useTranslations('landing.faq');
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  // Since we have an array in translation, we need to map through indices
  // For the MVP we only have 2 in the translation file I created
  const items = [0, 1];

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Header Area */}
          <div className="lg:w-1/3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-sm"
            >
              <HelpCircle className="w-5 h-5" />
              {t('title')}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight"
            >
              كل ما تحتاج <br className="hidden md:block" /> معرفته عن المنصة
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-neutral-500 dark:text-neutral-400"
            >
              إليك إجابات على أكثر الأسئلة شيوعاً حول خدمات مُجاز وكيفية الاستفادة منها.
            </motion.p>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:w-2/3 space-y-4">
            {items.map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl border transition-all duration-300 ${
                  activeIndex === index 
                    ? 'border-primary-500 bg-white dark:bg-neutral-900 shadow-xl shadow-primary-500/5' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-primary-500/50'
                }`}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-start"
                >
                  <span className={`text-lg font-bold transition-colors ${
                    activeIndex === index ? 'text-primary-600' : 'text-neutral-900 dark:text-white'
                  }`}>
                    {t(`items.${index}.q`)}
                  </span>
                  <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    activeIndex === index 
                      ? 'bg-primary-600 border-primary-600 text-white rotate-180' 
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-500'
                  }`}>
                    {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800 pt-6">
                        {t(`items.${index}.a`)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
