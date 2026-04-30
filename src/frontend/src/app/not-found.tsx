import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 font-arabic" dir="rtl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-lg mx-auto text-center px-4 md:px-0 animate-in fade-in zoom-in duration-500">
        {/* Institutional Red Badge */}
        <div className="relative mb-8 w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-[1.5rem] flex items-center justify-center border border-red-100">
          <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
          <div className="absolute inset-0 rounded-[1.5rem] border-4 border-red-500/5 animate-ping" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-neutral-200/50 leading-none">
            ٤٠٤
          </h1>
          <h2 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
            الصفحة غير موجودة
          </h2>
          <p className="text-sm md:text-base text-neutral-500 max-w-sm mx-auto leading-relaxed font-medium">
            عذراً، المعلمة التي تحاول الوصول إليها غير حية حالياً أو قد تم تحديث مسارها في النظام السيادي.
          </p>
        </div>

        <div className="pt-12 w-full max-w-xs scale-90 md:scale-100">
          <Link href="/">
            <Button className="w-full h-12 md:h-14 bg-[#1a3a8f] hover:bg-[#1a3a8f]/90 text-white rounded-xl text-base font-bold shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group px-8">
              <Home className="w-5 h-5" />
              <span>العودة للرئيسية</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}