'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const stats = [
  { key: 'activeUsers', value: '2.4M+' },
  { key: 'issuedLicenses', value: '1.8M+' },
  { key: 'satisfactionRate', value: '98%' },
  { key: 'centers', value: '45+' }
];

export default function StatsSection() {
  const t = useTranslations('landing.stats');

  return (
    <section className="py-24 bg-primary-900 overflow-hidden relative">
      {/* Texture/Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white text-3xl md:text-4xl font-bold"
          >
            {t('title')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
              className="text-center space-y-2"
            >
              <div className="text-5xl md:text-6xl font-black text-white bg-clip-text">
                {stat.value}
              </div>
              <div className="text-secondary-400 font-medium uppercase tracking-[0.2em] text-xs">
                {t(stat.key)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
