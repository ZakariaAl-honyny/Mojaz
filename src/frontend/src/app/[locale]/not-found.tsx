import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {Button} from '@/components/ui/button';
import {Home, AlertCircle} from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('common.notfound');

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900 grain-overlay">
      <div className="max-w-md w-full text-center space-y-8 glass-card p-12 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center animate-bounce">
          <AlertCircle className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 animate-ping" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 uppercase">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            {t('title')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button size="lg" className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-6 text-lg font-medium transition-all duration-300 hover-lift flex items-center justify-center gap-2">
              <Home className="w-5 h-5 rtl:mirror" />
              {t('backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
