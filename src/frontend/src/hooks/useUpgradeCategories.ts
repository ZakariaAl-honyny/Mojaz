'use client';

import { useQuery } from '@tanstack/react-query';
import LicenseService, { LicenseDto, UpgradeTargetCategory } from '@/services/license.service';
import { wizardQueryKeys } from '@/lib/constants';

/**
 * Hook to get user's active licenses (needed for upgrade service)
 */
export function useUserLicenses() {
  return useQuery<LicenseDto[]>({
    queryKey: wizardQueryKeys.userLicenses,
    queryFn: async () => {
      const response = await LicenseService.getUserLicenses();
      if (!response.success) {
        throw new Error(response.message || 'فشل في استرجاع قائمة الرخص الفعلية للمستخدم.');
      }
      return response.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Always fetch when this hook is used
  });
}

/**
 * Hook to get upgrade targets for a specific license
 */
export function useUpgradeTargets(licenseId: number | null) {
  return useQuery<UpgradeTargetCategory[]>({
    queryKey: [...wizardQueryKeys.upgradeTargets, licenseId] as const,
    queryFn: async () => {
      if (!licenseId) return [];
      const response = await LicenseService.getUpgradeTargets(licenseId);
      if (!response.success) {
        throw new Error(response.message || 'فشل في تحميل فئات الترقية المتاحة لهذه الرخصة.');
      }
      return response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!licenseId, // Only fetch when licenseId is provided
  });
}