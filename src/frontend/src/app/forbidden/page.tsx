import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 font-arabic" dir="rtl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-lg mx-auto text-center px-4 md:px-0 animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8 w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-2xl flex items-center justify-center">
          <ShieldX className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
          <div className="absolute inset-0 rounded-2xl border-4 border-red-500/5 animate-ping" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-100 leading-none">
            403
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            غير مصرح لك بالوصول
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed font-bold">
            You don&apos;t have permission to access this page
          </p>
        </div>

        <div className="pt-10 w-full max-w-xs scale-90 md:scale-100">
          <Link href="/">
            <Button className="w-full h-11 md:h-12 bg-[#1a3a8f] hover:bg-[#002868] text-white rounded-xl text-sm md:text-base font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
              <Home className="w-4 h-4 md:w-5 md:h-5" />
              <span>العودة للصفحة الرئيسية</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}