'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';

export default function CTASection() {
  const t = useTranslations('landing.hero');

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-primary-600">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-black/10 backdrop-blur-xl p-12 md:p-20 rounded-[3rem] border border-white/10 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20"
          >
            <Sparkles className="w-10 h-10 text-secondary-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white leading-tight"
          >
            جاهز لبدء رحلتك <br /> الرقمية مع مُجاز؟
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto"
          >
            انضم إلى ملايين المواطنين والمقيمين الذين يستفيدون من الخدمات الحكومية الذكية بكل سهولة وأمان.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link href="/register">
              <Button size="lg" className="h-16 px-12 bg-white text-primary-600 hover:bg-neutral-100 rounded-full text-xl font-bold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                {t('cta')}
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-16 px-12 border-white/20 text-white hover:bg-white/10 rounded-full text-xl font-medium transition-all duration-300">
                تواصل معنا
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
