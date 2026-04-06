'use client';

import Link from 'next/link';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import ThemeToggler from '../shared/ThemeToggler';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

export default function PublicHeader() {
  const t = useTranslations('auth.login');

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-primary-900 dark:text-primary-50">
              Mojaz <span className="text-primary-600">.</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
             {/* Add simple links here if needed */}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-full">
            <LanguageSwitcher />
            <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />
            <ThemeToggler />
          </div>
          
          <Link href="/login">
            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-5 transition-all duration-300 hover-lift">
              {t('submit')}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
