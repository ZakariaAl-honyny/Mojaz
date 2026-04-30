'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/auth-store';
import { isAdminRole, isManagerRole } from '@/lib/enums';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  // FIX BUG-09: Match middleware RBAC — Admin + Manager both get admin access
  const hasAdminAccess = useMemo(
    () => isAdminRole(user?.role) || isManagerRole(user?.role),
    [user?.role]
  );

  // Auth guard - wait for REAL hydration before checking
  useEffect(() => {
    if (!_hasHydrated) return;
    
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!hasAdminAccess) {
      router.push('/dashboard');
    }
  }, [_hasHydrated, isAuthenticated, hasAdminAccess, router]);

  if (!_hasHydrated || !isAuthenticated || !hasAdminAccess) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#1a3a8f]" />
        <p className="font-bold text-neutral-500 tracking-widest uppercase text-xs animate-pulse">
           جاري تأمين بوابة الإدارة...
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
