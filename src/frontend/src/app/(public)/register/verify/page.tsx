import Link from 'next/link';
import OTPForm from '@/components/forms/auth/OTPForm';
import { Suspense } from 'react';
import { Home } from 'lucide-react';

export default function RegisterVerifyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 font-arabic" dir="rtl">
      {/* Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-[#1a3a8f] transition-colors text-xs font-black group">
          <Home className="w-4 h-4" />
          <span className="underline underline-offset-4 decoration-2 decoration-neutral-300 group-hover:decoration-[#1a3a8f] transition-all">الرئيسية</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <Suspense fallback={<div className="text-center text-neutral-500 font-bold p-10">جاري التحميل...</div>}>
          <OTPForm />
        </Suspense>
      </div>

      <div className="mt-8">
        <p className="text-center text-xs font-black text-neutral-300 uppercase tracking-[0.3em] opacity-50">
          الإدارة العامة للمرور - محافظة صنعاء
        </p>
      </div>
    </div>
  );
}
