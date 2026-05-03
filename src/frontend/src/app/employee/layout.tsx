'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/auth-store';
import { isEmployeeRole } from '@/lib/enums';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 as LoaderIcon } from 'lucide-react';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  const hasEmployeeAccess = isEmployeeRole(user?.role);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
    } else if (!hasEmployeeAccess) {
      router.push('/dashboard');
    }
  }, [_hasHydrated, isAuthenticated, hasEmployeeAccess, router]);

  if (!_hasHydrated || !isAuthenticated || !hasEmployeeAccess) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <LoaderIcon className="w-12 h-12 animate-spin text-[#1a3a8f]" />
        <p className="font-bold text-neutral-500 tracking-widest uppercase text-xs animate-pulse">
          جاري التحقق من الصلاحيات...
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
