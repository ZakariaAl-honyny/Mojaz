'use client';

import { useAuth } from '@/hooks/useAuth';
import ApplicantApplicationsPage from './ApplicantApplicationsPage';
import EmployeeApplicationsPage from './EmployeeApplicationsPage';

export default function ApplicationsPage() {
  const { user } = useAuth();

  const isEmployee = user?.role && (['Receptionist', 'Doctor', 'Examiner', 'Manager', 'Security'] as string[]).includes(String(user.role));

  if (!user) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return isEmployee ? <EmployeeApplicationsPage /> : <ApplicantApplicationsPage />;
}
