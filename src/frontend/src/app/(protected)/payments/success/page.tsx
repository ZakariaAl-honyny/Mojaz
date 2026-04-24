'use client';

import { Suspense } from 'react';
import PaymentSuccessPage from '../PaymentSuccessPage';

function PaymentSuccessLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

export default function PaymentSuccessWrapper() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessPage />
    </Suspense>
  );
}