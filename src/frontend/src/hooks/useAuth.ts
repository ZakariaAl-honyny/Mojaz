'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useMemo, useCallback } from 'react';
import { isAdminRole, isEmployeeRole, isApplicantRole } from '@/lib/enums';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, setTokens, logout, locale, refreshToken, updateUser, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isAdmin = useMemo(() => isAdminRole(user?.role), [user]);
  const isEmployee = useMemo(() => isEmployeeRole(user?.role), [user]);
  const isApplicant = useMemo(() => isApplicantRole(user?.role), [user]);

  // FIX BUG-06: Full logout — revoke server-side refresh token + clear client state
  const performLogout = useCallback(async () => {
    try {
      if (refreshToken) {
        await authService.logout({ refreshToken });
      }
    } catch {
      // Even if server call fails, still clear client state
    } finally {
      // CLEAR ALL CACHES to prevent data leakage
      queryClient.clear();
      logout();
      router.push('/login');
    }
  }, [refreshToken, logout, router, queryClient]);

  return {
    user,
    isAuthenticated,
    isAdmin,
    isEmployee,
    isApplicant,
    setAuth,
    setTokens,
    logout: performLogout, // Server-aware logout replaces raw store logout
    updateUser,
    isLoading: !_hasHydrated,
    locale,
  };
};
