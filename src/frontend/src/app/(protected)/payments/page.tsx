'use client';

import { useAuthStore } from '@/stores/auth-store';
import ApplicantPaymentsPage from './ApplicantPaymentsPage';
import EmployeePaymentsPage from './EmployeePaymentsPage';
import { useTranslations } from '@/lib/static-translations';
import { Loader2 } from 'lucide-react';

export default function PaymentsPage() {
  const { user } = useAuthStore();
  const t = useTranslations('common');

  // Show loading if user is not loaded yet
  if (!user) {
    // Try to show something while loading
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a3a8f] mx-auto mb-4" />
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Determine which view to render based on user role
  const isEmployee = user?.role && (['Receptionist', 'Doctor', 'Examiner', 'Manager', 'Security'] as string[]).includes(String(user.role));

  return isEmployee ? <EmployeePaymentsPage /> : <ApplicantPaymentsPage />;
}