import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { 
  CreateMedicalResultRequest, 
  MedicalResultDto,
  createMedicalResultSchema,
  medicalResultDtoSchema
} from '../types/medical.types';

// API base URL - should be configured from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

// Create medical result mutation
export const useCreateMedicalResult = () => {
  const t = useTranslations('medical');
  
  return useMutation({
    mutationFn: async (data: CreateMedicalResultRequest) => {
      // Validate data with Zod schema
      const validationResult = createMedicalResultSchema.safeParse(data);
      if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0].message);
      }
      
      const response = await fetch(`${API_BASE_URL}/medical-exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      return handleApiResponse<MedicalResultDto>(response);
    },
  });
};

// Get medical result query
export const useGetMedicalResult = (applicationId: string | null) => {
  const t = useTranslations('medical');
  
  return useQuery({
    queryKey: ['medical-result', applicationId],
    queryFn: async () => {
      if (!applicationId) {
        throw new Error('Application ID is required');
      }
      
      const response = await fetch(`${API_BASE_URL}/medical-exams/${applicationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.status === 404) {
        return null; // No medical result found
      }
      
      return handleApiResponse<MedicalResultDto>(response);
    },
    enabled: !!applicationId,
  });
};

// Update medical result mutation
export const useUpdateMedicalResult = () => {
  const t = useTranslations('medical');
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateMedicalResultRequest> }) => {
      // Validate data with Zod schema (partial)
      const validationResult = medicalResultDtoSchema.partial().safeParse(data);
      if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0].message);
      }
      
      const response = await fetch(`${API_BASE_URL}/medical-exams/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      return handleApiResponse<MedicalResultDto>(response);
    },
  });
};