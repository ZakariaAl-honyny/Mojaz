'use client';

import { useAuth } from '@/hooks/useAuth';
import ApplicantApplicationsPage from './ApplicantApplicationsPage';
import EmployeeApplicationsPage from './EmployeeApplicationsPage';
import { useTranslations } from 'next-intl';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const t = useTranslations('common');

  // Determine which view to render based on user role
  const isEmployee = user?.role && ['Receptionist', 'Doctor', 'Examiner', 'Manager', 'Security'].includes(user.role);

  if (!user) {
    return <div className="p-8 text-center">{t('loading')}</div>;
  }

  return isEmployee ? <EmployeeApplicationsPage /> : <ApplicantApplicationsPage />;
}
