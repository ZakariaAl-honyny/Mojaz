'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/auth-store';
import { isApplicantRole } from '@/lib/enums';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  // Auth guard - wait for REAL hydration before checking
  useEffect(() => {
    if (!_hasHydrated) return;
    
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isApplicantRole(user?.role)) {
      router.push('/dashboard');
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  // Block rendering until Zustand is rehydrated
  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#1a3a8f]" />
        <p className="font-bold text-neutral-500 tracking-widest uppercase text-xs animate-pulse">
           جاري تأمين بوابة المتقدمين...
        </p>
      </div>
    );
  }

  // If user is authenticated but not an Applicant, show loading (redirect will happen)
  if (!isApplicantRole(user?.role)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#1a3a8f]" />
        <p className="font-bold text-neutral-500 tracking-widest uppercase text-xs animate-pulse">
           جاري تحويلك...
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