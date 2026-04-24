'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCw, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 font-arabic" dir="rtl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-lg mx-auto text-center px-4 md:px-0">
        <div className="relative mb-8 w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-800">
            حدث خطأ غير متوقع
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed font-bold">
            عذراً، واجه النظام مشكلة تقنية. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
          </p>
        </div>

        <div className="pt-10 flex flex-col sm:flex-row gap-3 w-full max-w-xs scale-90 md:scale-100">
          <Button 
            onClick={reset}
            className="flex-1 h-11 md:h-12 bg-[#1a3a8f] hover:bg-[#002868] text-white rounded-xl text-sm md:text-base font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </Button>
          
          <Link href="/" className="flex-1">
            <Button 
              variant="outline"
              className="w-full h-11 md:h-12 border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 rounded-xl text-sm md:text-base font-bold shadow-sm transition-all flex items-center justify-center gap-3 group"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}