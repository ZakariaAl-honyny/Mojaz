import { useQuery } from '@tanstack/react-query';
import { wizardQueryKeys } from '@/lib/constants';
import ApplicationService from '@/services/application.service';

export function useNationalities() {
  return useQuery({
    queryKey: wizardQueryKeys.nationalities,
    queryFn: async () => {
      const response = await ApplicationService.getNationalities();
      if (!response.success || !response.data) throw new Error('فشل في تحميل قائمة الجنسيات.');
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useRegions() {
  return useQuery({
    queryKey: wizardQueryKeys.regions,
    queryFn: async () => {
      const response = await ApplicationService.getRegions();
      if (!response.success || !response.data) throw new Error('فشل في تحميل قائمة المحافظات.');
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}
