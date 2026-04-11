import OTPForm from '@/components/forms/auth/OTPForm';
import PublicLayout from '@/components/layout/PublicLayout';
import {Suspense} from 'react';

export default function RegisterVerifyPage() {
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-neutral-50 px-6 py-24 dark:bg-neutral-950">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
            <OTPForm />
          </Suspense>
        </div>
      </div>
    </PublicLayout>
  );
}
