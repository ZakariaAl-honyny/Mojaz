'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  PlusCircle, 
  RefreshCw, 
  FileText, 
  ArrowUpCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../ui/card';

const icons = {
  new: PlusCircle,
  renewal: RefreshCw,
  replacement: FileText,
  upgrade: ArrowUpCircle
};

export default function ServiceGrid() {
  const t = useTranslations('landing.services');
  const serviceKeys = ['new', 'renewal', 'replacement', 'upgrade'];

  return (
    <section className="py-24 bg-white dark:bg-neutral-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceKeys.map((key, i) => {
            const Icon = icons[key as keyof typeof icons];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group h-full p-8 border-neutral-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm hover:border-primary-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2">
                  <div className="space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {t(`items.${key}.title`)}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                        {t(`items.${key}.desc`)}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center gap-2 text-xs font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="uppercase tracking-wider">ابدأ الخدمة</span>
                      <ChevronRight className="w-4 h-4 group-rtl:rotate-180" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { ChevronRight } from 'lucide-react';
