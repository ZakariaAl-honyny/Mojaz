'use client';

import { useState } from 'react';
import ForgotPasswordForm from '@/components/forms/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/forms/auth/ResetPasswordForm';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');

  const handleIdentitySuccess = (id: string) => {
    setIdentifier(id);
    setStep(2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 px-4 py-20">
      <div className="w-full max-w-xl">
        {step === 1 ? (
          <ForgotPasswordForm onSuccess={handleIdentitySuccess} />
        ) : (
          <ResetPasswordForm identifier={identifier} />
        )}
      </div>
    </div>
  );
}
