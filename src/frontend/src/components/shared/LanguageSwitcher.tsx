'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  
  const handleToggle = () => {
    startTransition(() => {
      router.replace(pathname, { locale: otherLocale });
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className={`px-3 flex gap-2 items-center text-sm font-medium transition-all duration-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 ${isPending ? 'opacity-50 cursor-wait' : ''}`}
      aria-label={locale === 'ar' ? 'Switch to English' : 'تغيير إلى العربية'}
    >
      <Globe className={`w-4 h-4 text-primary-600 dark:text-primary-400 ${isPending ? 'animate-spin' : ''}`} />
      <span className="hidden sm:inline">
        {locale === 'ar' ? 'English' : 'العربية'}
      </span>
      <span className="inline sm:hidden uppercase">
        {otherLocale}
      </span>
    </Button>
  );
}
