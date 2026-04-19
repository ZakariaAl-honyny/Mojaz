'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';

const ADMIN_ROLES = ['Admin'];

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);

    // Auth Guard
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    // Role Guard - only Admin can access
    if (user && user.role !== 'Admin') {
      router.push(`/${locale}/dashboard`); // Move to applicant dashboard if not admin
    }
  }, [isAuthenticated, user, router, locale]);

  if (isMounting || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
        <p className="font-bold text-neutral-500 tracking-widest uppercase text-xs animate-pulse">
          Securing DrivingLicenseIssuanceSystem Admin Portal...
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}