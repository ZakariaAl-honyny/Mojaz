'use client';

import { useAuthStore } from '@/stores/auth-store';
import ApplicantPaymentsPage from './ApplicantPaymentsPage';
import EmployeePaymentsPage from './EmployeePaymentsPage';
import { useTranslations } from '@/lib/static-translations';

export default function PaymentsPage() {
  const { user } = useAuthStore();
  const t = useTranslations('common');

  // Determine which view to render based on user role
  const isEmployee = user?.role && (['Receptionist', 'Doctor', 'Examiner', 'Manager', 'Security'] as string[]).includes(String(user.role));

  if (!user) {
    return <div className="p-8 text-center">{t('loading')}</div>;
  }

  return isEmployee ? <EmployeePaymentsPage /> : <ApplicantPaymentsPage />;
}