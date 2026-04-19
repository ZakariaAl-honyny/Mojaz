import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';

export default async function NotFound(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await props.params) || { locale: 'ar' };
  setRequestLocale(locale);
  const t = await getTranslations('common');

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900 grain-overlay">
      <div className="max-w-md w-full text-center space-y-8 glass-card p-12 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center animate-bounce">
          <AlertCircle className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 animate-ping" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-foreground">{t('notfound.title')}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t('notfound.description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full bg-primary hover:bg-primary/90 font-bold">
              <Home className="w-5 h-5 me-2" />
              {t('notfound.backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}