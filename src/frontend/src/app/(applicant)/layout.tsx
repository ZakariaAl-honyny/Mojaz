'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/auth-store';
import { isApplicantRole } from '@/lib/enums';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration to complete before checking auth
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Auth guard - redirect if not authenticated or if user is not an Applicant
  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isApplicantRole(user?.role)) {
      router.push('/dashboard');
    }
  }, [isHydrated, isAuthenticated, user, router]);

  // Show loading while hydrating OR not authenticated
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
        <p className="font-bold text-neutral-500 tracking-widest uppercase text-xs animate-pulse">
           جاري تأمين بوابة المتقدمين...
        </p>
      </div>
    );
  }

  // If user is authenticated but not an Applicant, still show loading (redirect will happen)
  if (!isApplicantRole(user?.role)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
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