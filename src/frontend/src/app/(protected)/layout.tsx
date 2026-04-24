'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout just provides the DashboardLayout wrapper
  // Auth is handled by specific route group layouts (applicant, employee, admin)
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
