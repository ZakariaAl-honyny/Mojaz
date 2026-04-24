'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/auth-store';
import { isEmployeeRole } from '@/lib/enums';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function EmployeePortalLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration to complete before checking auth
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Auth guard - redirect if not authenticated
  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isAuthenticated) {
       router.push('/login');
    } else if (!isEmployeeRole(user?.role)) {
       router.push('/dashboard');
    }
  }, [isHydrated, isAuthenticated, user, router]);

  // Show loading only when not authenticated or hydrating
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
        <p className="font-bold text-neutral-500 tracking-widest uppercase text-xs animate-pulse">
           جاري تأمين بوابة الموظفين...
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
