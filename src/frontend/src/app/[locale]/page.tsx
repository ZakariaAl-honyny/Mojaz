import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/routing';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = useTranslations('common');

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-primary-500 sm:text-7xl mb-6">
          {t('welcome')}
        </h1>
        <p className="mt-6 text-xl leading-8 text-neutral-600 mb-10">
          {t('description')}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-gov bg-primary-500 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-600 transition-all hover:scale-105"
          >
            {t('auth.register')}
          </Link>
          <Link
            href="/login"
            className="rounded-gov px-8 py-4 text-lg font-semibold text-primary-500 border-2 border-primary-500 hover:bg-primary-50 transition-all"
          >
            {t('auth.login')}
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link 
            href="/" 
            locale={locale === 'ar' ? 'en' : 'ar'}
            className="text-neutral-500 hover:text-primary-500 font-medium"
          >
            {t('toggleLanguage')}
          </Link>
        </div>
      </div>
    </main>
  );
}
