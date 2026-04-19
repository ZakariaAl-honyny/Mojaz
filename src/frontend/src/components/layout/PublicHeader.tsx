'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import ThemeToggler from '../shared/ThemeToggler';
import ColorThemeSwitcher from '../shared/ColorThemeSwitcher';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Menu, X, UserPlus, LogIn, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicHeader() {
  const t = useTranslations('landing');
  const commonT = useTranslations('common');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', key: 'home' },
    { href: '#services', key: 'services' },
    { href: '/traffic-laws', key: 'traffic_laws' },
    { href: '/violations', key: 'violations' },
    { href: '#faq', key: 'faq' }
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 p-4 lg:p-8",
        isScrolled ? "py-2 lg:py-4" : "py-6 lg:py-8"
      )}
    >
      <div className="container mx-auto max-w-7xl">
        <div className={cn(
          "relative flex items-center justify-between h-20 px-6 lg:px-10 transition-all duration-500 rounded-[2rem] border shadow-2xl overflow-hidden",
          isScrolled 
            ? "bg-white/70 dark:bg-[#020617]/70 backdrop-blur-3xl border-neutral-200/50 dark:border-white/10" 
            : "bg-white/40 dark:bg-white/5 backdrop-blur-xl border-white/20 dark:border-white/10"
        )}>
          {/* Subtle Glow Effect inside the header */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

          {/* Brand — الإدارة العامة للمرور */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex-shrink-0">
              <img
                src="/images/logo.png"
                alt={commonT('brand.name')}
                className="h-12 w-12 object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -inset-1 bg-primary-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <div className="leading-tight hidden sm:block">
              <span className="text-base font-bold text-neutral-900 dark:text-white tracking-tight block">
                {commonT('brand.name')}
              </span>
              <span className="text-[10px] text-primary dark:text-primary/80 font-semibold tracking-[0.1em] block">
                {commonT('brand.subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.key} 
                href={link.href} 
                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-white hover:bg-primary-500/5 transition-all text-center whitespace-nowrap"
              >
                {commonT(`nav.${link.key}`)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-neutral-100 dark:bg-white/5 rounded-2xl p-1 gap-1 border border-neutral-200/50 dark:border-white/10">
              <LanguageSwitcher />
              <ThemeToggler />
              <ColorThemeSwitcher />
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="h-11 px-6 text-neutral-600 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest">
                   {commonT('auth.login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button className="h-11 px-8 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary-600/20">
                  <UserPlus className="w-4 h-4 me-2 rtl:rotate-0" />
                  {commonT('auth.register')}
                </Button>
              </Link>
            </div>

            <button 
              className="xl:hidden w-11 h-11 flex items-center justify-center text-neutral-900 dark:text-white bg-neutral-100 dark:bg-white/10 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 transition-all ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="x" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><X size={20} /></motion.div>
                ) : (
                  <motion.div key="menu" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Menu size={20} /></motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-4 px-4 xl:hidden"
          >
            <div className="bg-white/90 dark:bg-[#020617]/90 backdrop-blur-3xl rounded-[2.5rem] border border-neutral-200 dark:border-white/10 shadow-3xl p-8 space-y-8 overflow-hidden">
              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link, i) => (
                  <Link 
                    key={link.key}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-5 bg-neutral-100 dark:bg-white/5 rounded-2xl hover:bg-primary-500/10 group transition-all"
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest text-neutral-900 dark:text-white">{commonT(`nav.${link.key}`)}</span>
                    <Sparkles size={16} className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-white/10">
                <div className="flex gap-2">
                  <LanguageSwitcher />
                  <ThemeToggler />
                  <ColorThemeSwitcher />
                </div>
                <Link href="/login">
                  <Button className="bg-primary-600 text-white rounded-xl px-6 py-2 font-black text-[10px] uppercase tracking-widest">{commonT("auth.login")}</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
