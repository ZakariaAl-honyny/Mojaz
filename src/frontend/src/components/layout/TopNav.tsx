'use client';

import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { 
  Menu,
  Globe,
  User,
  Sun,
  Moon,
  Settings,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../shared/LanguageSwitcher';

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const isRTL = locale === 'ar';
  const currentLanguage = locale;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Get role label key
  const role = user?.role || 'Applicant';
  const roleLabelKey = `roles.${role.toLowerCase()}`;

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page Title / Breadcrumb */}
        <div className="hidden lg:block">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">{t("dashboard")}</h1>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <LanguageSwitcher />
          
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="hidden sm:block text-start">
                  <p className="text-sm font-medium">
                    {user?.fullName || t("user.default")}
                  </p>
                  <p className="text-xs text-muted-foreground">{t(roleLabelKey)}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {t("user.myAccount")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="me-2 h-4 w-4" />
                {t("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="me-2 h-4 w-4" />
                {t("settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="me-2 h-4 w-4" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}