'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';

export default function ApplicantPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
    
    // Auth Guard
    if (!isAuthenticated) {
       router.push('/login');
       return;
    }

    // Role Guard
    if (user && user.role !== 'Applicant') {
       // redirect to appropriate portal if roles don't match
       // For now, let's just let it be or redirect to profile
    }
  }, [isAuthenticated, user, router]);

  if (isMounting || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
        <p className="font-bold text-neutral-500 tracking-widest uppercase text-xs animate-pulse">
           Authenticating Mojaz Session...
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
