import OTPForm from '@/components/forms/auth/OTPForm';
import PublicLayout from '@/components/layout/PublicLayout';
import {Suspense} from 'react';

export default function VerifyOtpPage() {
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-neutral-50 px-6 py-24">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="text-center text-neutral-500">جاري التحميل... / Loading...</div>}>
            <OTPForm />
          </Suspense>
        </div>
      </div>
    </PublicLayout>
  );
}
