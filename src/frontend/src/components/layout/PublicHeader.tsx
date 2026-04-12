'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import ThemeToggler from '../shared/ThemeToggler';
import { Button } from '../ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function PublicHeader() {
  const t = useTranslations('auth.login');
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.8)']
  );

  const paddingY = useTransform(
    scrollY,
    [0, 50],
    ['2rem', '1rem']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      style={{ backgroundColor: isScrolled ? undefined : backgroundColor, paddingTop: paddingY, paddingBottom: paddingY }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center justify-center",
        isScrolled ? "h-20 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" : "h-28"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary-900/40 group-hover:rotate-6 transition-transform">
              M
            </div>
            <div className="leading-tight">
              <span className="text-2xl font-black text-white tracking-tighter">
                مُجاز
              </span>
              <div className="flex items-center gap-1 opacity-50">
                <Sparkles className="w-2.5 h-2.5 text-primary-400" />
                <span className="text-[9px] text-white font-black uppercase tracking-[0.2em]">Mojaz Digital</span>
              </div>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm font-black uppercase tracking-widest text-neutral-400">
            <Link href="/" className="hover:text-primary-400 transition-colors">الرئيسية</Link>
            <Link href="/about" className="hover:text-primary-400 transition-colors">عن المنصة</Link>
            <Link href="/services" className="hover:text-primary-400 transition-colors">الخدمات</Link>
            <Link href="/centers" className="hover:text-primary-400 transition-colors">المراكز</Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center p-1.5 bg-white/5 dark:bg-black/20 rounded-2xl border border-white/5 backdrop-blur-md">
            <LanguageSwitcher />
            <div className="w-px h-4 bg-white/10 mx-2" />
            <ThemeToggler />
          </div>
          
          <Link href="/login">
            <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-8 text-sm font-black shadow-lg shadow-primary-900/40 transition-all duration-300 hover:scale-105 active:scale-95">
              {t('submit')}
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

import { cn } from '@/lib/utils';
