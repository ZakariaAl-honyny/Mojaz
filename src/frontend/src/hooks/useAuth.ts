'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useMemo } from 'react';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, setTokens, logout, locale } = useAuthStore();

  const isAdmin = useMemo(() => user?.role === 'Admin', [user]);
  const isEmployee = useMemo(() => ['Receptionist', 'Doctor', 'Examiner', 'Manager'].includes(user?.role || ''), [user]);
  const isApplicant = useMemo(() => user?.role === 'Applicant', [user]);

  return {
    user,
    isAuthenticated,
    isAdmin,
    isEmployee,
    isApplicant,
    setAuth,
    setTokens,
    logout,
    locale,
  };
};
