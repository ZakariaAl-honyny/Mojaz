'use client';

import {Link, usePathname} from '@/i18n/routing';
import {useTranslations, useLocale} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Globe, User, LogOut, LayoutDashboard} from 'lucide-react';
import {useAuthStore} from '@/stores/auth-store';

export default function Navbar() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const {isAuthenticated, user, logout} = useAuthStore();

  const toggleLocale = locale === 'ar' ? 'en' : 'ar';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            M
          </div>
          <span className="text-2xl font-bold tracking-tight text-neutral-900 hidden sm:block">
            {t('title').split(' - ')[0]}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={pathname}
            locale={toggleLocale}
            className="flex items-center gap-2 px-3 py-2 rounded-gov text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{t('toggleLanguage')}</span>
          </Link>

          <div className="h-6 w-px bg-neutral-200 mx-2 hidden sm:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
               <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('auth.dashboard') || 'Dashboard'}</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="gap-2 text-error hover:text-error hover:bg-error/10 border-error/20"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('auth.logout') || 'Logout'}</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t('auth.login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary-500 hover:bg-primary-600">
                  {t('auth.register')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
