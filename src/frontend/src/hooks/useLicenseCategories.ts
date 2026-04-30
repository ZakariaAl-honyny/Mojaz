import { useQuery } from '@tanstack/react-query';
import ApplicationService from '@/services/application.service';
import { wizardQueryKeys } from '@/lib/constants';

export function useLicenseCategories() {
  return useQuery({
    queryKey: wizardQueryKeys.licenseCategories,
    queryFn: async () => {
      const response = await ApplicationService.getLicenseCategories();
      if (!response.success) {
        throw new Error(response.message || 'فشل في تحميل فئات الرخص.');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
