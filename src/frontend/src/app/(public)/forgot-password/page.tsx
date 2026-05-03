'use client';

import { useState } from 'react';
import ForgotPasswordForm from '@/components/forms/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/forms/auth/ResetPasswordForm';

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');

  const handleIdentitySuccess = (id: string) => {
    setIdentifier(id);
    setStep(2);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1a3a8f]/5 via-background to-[#1a3a8f]/5 p-4 font-arabic" dir="rtl">
      {/* Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-[#1a3a8f] transition-colors text-xs font-black group">
          <Home className="w-4 h-4" />
          <span className="underline underline-offset-4 decoration-2 decoration-neutral-300 group-hover:decoration-[#1a3a8f] transition-all">الرئيسية</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        {step === 1 ? (
          <ForgotPasswordForm onSuccess={handleIdentitySuccess} />
        ) : (
          <ResetPasswordForm identifier={identifier} />
        )}
      </div>

      <div className="mt-8">
        <p className="text-center text-xs font-black text-neutral-300 uppercase tracking-[0.3em] opacity-50">
          الإدارة العامة للمرور - محافظة صنعاء
        </p>
      </div>
    </div>
  );
}
