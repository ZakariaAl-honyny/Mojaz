import OTPForm from '@/components/forms/auth/OTPForm';
import PublicLayout from '@/components/layout/PublicLayout';
import { Suspense } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function VerifyOtpPage() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 py-24 font-arabic" dir="rtl">
        <div className="w-full max-w-md">
          {/* Navigation */}
          <div className="w-full flex items-center justify-between mb-4 px-2">
            <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-[#1a3a8f] transition-colors text-xs font-black group">
              <Home className="w-4 h-4" />
              <span className="underline underline-offset-4 decoration-2 decoration-neutral-300 group-hover:decoration-[#1a3a8f] transition-all">الرئيسية</span>
            </Link>
          </div>

          <div className="w-full bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-neutral-100">
            <Suspense fallback={<div className="text-center text-neutral-500 font-bold font-arabic pt-10 pb-10">جاري التحميل...</div>}>
              <OTPForm />
            </Suspense>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-neutral-400 font-black mb-1">هل تملك حساب؟</span>
              <Link href="/login" className="text-sm font-black text-[#1a3a8f] underline underline-offset-4 decoration-2 decoration-[#1a3a8f]/15 hover:decoration-[#1a3a8f] transition-all">
                تسجيل الدخول
              </Link>
            </div>
            
            <p className="mt-8 text-center text-xs font-black text-neutral-300 uppercase tracking-[0.3em] opacity-50">
              الإدارة العامة للمرور - محافظة صنعاء
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
