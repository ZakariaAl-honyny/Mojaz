'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Runtime Error:', error);
  }, [error]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-md w-full text-center space-y-8 glass-card p-12 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-500 border border-red-500/10">
        <div className="relative mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
          <div className="absolute inset-0 rounded-full border-4 border-red-500/20 animate-pulse" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">
            {t('error.title') || 'Something went wrong'}
          </h1>
          <p className="text-muted-foreground text-lg font-bold leading-relaxed">
            {t('error.description') || 'An unexpected error occurred while processing your request.'}
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 py-1 px-2 rounded-md inline-block">
              ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={reset}
            size="lg" 
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest shadow-xl shadow-primary-500/20"
          >
            <RefreshCcw className="w-5 h-5 me-2" />
            {t('error.tryAgain') || 'Try Again'}
          </Button>
          
          <Link href="/" className="w-full">
            <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase tracking-widest">
              <Home className="w-5 h-5 me-2" />
              {t('error.backHome') || 'Go Home'}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
