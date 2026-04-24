'use client';

import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations, useDirection, LocaleProvider, Locale } from '@/lib/translations';

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>('ar');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations('landing');
  const dir = useDirection();

  // Handle client-side locale restoration
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('mojaz-locale') as Locale | null;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLocale(saved);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
    localStorage.setItem('mojaz-locale', newLocale);
    // Update document direction
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  const languages = [
    { code: 'ar' as Locale, label: 'العربية', nativeLabel: 'العربية', dir: 'rtl' as const },
    { code: 'en' as Locale, label: 'English', nativeLabel: 'English', dir: 'ltr' as const },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  if (!mounted) {
    return (
      <div className="fixed top-4 end-4 z-[100] w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200" />
    );
  }

  return (
    <div ref={ref} className="fixed top-4 end-4 z-[100]">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300",
          "bg-white/80 backdrop-blur-md border border-neutral-200",
          "hover:bg-white hover:border-neutral-300 hover:shadow-lg",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={currentLang.label}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4 text-primary-600 shrink-0" />
        <span className="text-sm font-bold text-neutral-700">{currentLang.nativeLabel}</span>
        <ChevronDown className={cn(
          "w-3.5 h-3.5 text-neutral-400 transition-transform duration-200",
          isOpen ? "rotate-180" : ""
        )} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute top-full mt-2 end-0 min-w-[160px] rounded-xl overflow-hidden",
              "bg-white border border-neutral-200 shadow-xl shadow-neutral-900/10",
              "divide-y divide-neutral-100"
            )}
            role="listbox"
            aria-label="Select language"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => handleLocaleChange(lang.code)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-start transition-colors",
                  "hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none",
                  locale === lang.code ? "bg-primary-50" : ""
                )}
                role="option"
                aria-selected={locale === lang.code}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                  locale === lang.code 
                    ? "bg-primary-500 text-white" 
                    : "bg-neutral-100 text-neutral-500"
                )}>
                  {lang.code.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-neutral-900">{lang.nativeLabel}</div>
                  <div className="text-xs text-neutral-400">{lang.label}</div>
                </div>
                {locale === lang.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-primary-500 shrink-0"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// RTL/LTR Support Utilities
// ============================================

/**
 * Hook to get RTL-aware class names
 * Automatically adds RTL-aware variants based on current direction
 */
export function useRTLSafe() {
  const dir = useDirection();
  const isRTL = dir === 'rtl';
  
  return {
    dir,
    isRTL,
    isLTR: !isRTL,
    textAlign: isRTL ? 'text-right' : 'text-left',
    textAlignStart: isRTL ? 'text-end' : 'text-start',
    flexDirection: isRTL ? 'flex-row-reverse' : 'flex-row',
    justifyContent: isRTL ? 'flex-end' : 'flex-start',
    marginStart: isRTL ? 'me-' : 'ms-',
    marginEnd: isRTL ? 'ms-' : 'me-',
    paddingStart: isRTL ? 'pe-' : 'ps-',
    paddingEnd: isRTL ? 'ps-' : 'pe-',
    borderStart: isRTL ? 'border-s-' : 'border-e-',
    borderEnd: isRTL ? 'border-e-' : 'border-s-',
    roundedStart: isRTL ? 'rounded-e-' : 'rounded-s-',
    roundedEnd: isRTL ? 'rounded-s-' : 'rounded-e-',
    // Icons that need flipping in RTL
    iconFlipRTL: isRTL ? 'rtl:rotate-180' : '',
  };
}

/**
 * Format date based on current locale
 */
export function useFormattedDate() {
  const locale = useLocale();
  
  return (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    return d.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', defaultOptions);
  };
}

/**
 * Format number based on current locale (with Arabic-Indic numerals for Arabic)
 */
export function useFormatNumber() {
  const locale = useLocale();
  
  return (num: number, options?: Intl.NumberFormatOptions) => {
    return num.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
  };
}