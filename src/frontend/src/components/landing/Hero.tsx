'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('landing.hero');

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-neutral-950">
      {/* Background with Parallax Effect */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/hero-bg.png"
          alt="Government Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-neutral-950" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-6 h-full">
        <div className="max-w-4xl space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
              {t('badge')}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight"
          >
            {t('title')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-lg font-semibold group transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,108,53,0.3)]">
                {t('cta')}
                <ChevronRight className="ms-2 w-5 h-5 group-hover:translate-x-1 group-rtl:rotate-180 transition-transform" />
              </Button>
            </Link>
            
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 text-white rounded-full text-lg font-medium backdrop-blur-sm transition-all duration-300">
                {t('howItWorks')}
              </Button>
            </Link>
          </motion.div>

          {/* Stats Bar (Subtle) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5"
          >
            {[
              { label: 'Active Users', value: '2.4M+' },
              { label: 'Issued Licenses', value: '1.8M+' },
              { label: 'Processing Speed', value: '99.9%' },
              { label: 'Daily Service', value: '24/7' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary-500 to-transparent" />
      </motion.div>
    </section>
  );
}
