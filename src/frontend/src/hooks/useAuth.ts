'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useMemo } from 'react';
import { isAdminRole, isEmployeeRole, isApplicantRole } from '@/lib/enums';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, setTokens, logout, locale } = useAuthStore();

  const isAdmin = useMemo(() => isAdminRole(user?.role), [user]);
  const isEmployee = useMemo(() => isEmployeeRole(user?.role), [user]);
  const isApplicant = useMemo(() => isApplicantRole(user?.role), [user]);

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
