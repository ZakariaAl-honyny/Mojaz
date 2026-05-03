'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [_hasHydrated, isAuthenticated, router]);

  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white font-arabic" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1a3a8f]" />
        <p className="font-black text-neutral-400 tracking-widest uppercase text-[10px] animate-pulse">
           جاري تأمين بوابة الدخول...
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