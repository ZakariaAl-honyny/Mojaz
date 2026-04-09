import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TrainingService from '@/services/training.service';
import { 
  CreateTrainingRecordRequest, 
  UpdateTrainingHoursRequest, 
  CreateExemptionRequest,
  ExemptionActionRequest
} from '@/types/training.types';

// Query keys
export const trainingKeys = {
  all: ['training'] as const,
  records: () => [...trainingKeys.all, 'records'] as const,
  record: (applicationId: string) => [...trainingKeys.records(), { applicationId }] as const,
  exemptions: () => [...trainingKeys.all, 'exemptions'] as const,
  pendingExemptions: (params?: any) => [...trainingKeys.exemptions(), 'pending', { ...params }] as const,
  status: (applicationId: string) => [...trainingKeys.all, 'status', applicationId] as const,
};

/**
 * Hook to fetch training record for an application
 */
export const useTrainingRecord = (applicationId: string) => {
  return useQuery({
    queryKey: trainingKeys.record(applicationId),
    queryFn: () => TrainingService.getRecordByApplicationId(applicationId),
    enabled: !!applicationId,
  });
};

/**
 * Hook to update training hours (or create if missing)
 */
export const useUpdateTrainingHours = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: { id?: string; data: any }) => {
      if (request.id) {
        return TrainingService.addHours(request.id, request.data as UpdateTrainingHoursRequest);
      } else {
        return TrainingService.createRecord(request.data as CreateTrainingRecordRequest);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.record(applicationId) });
      queryClient.invalidateQueries({ queryKey: trainingKeys.status(applicationId) });
    },
  });
};

/**
 * Hook to submit an exemption request
 */
export const useSubmitExemption = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateExemptionRequest) => TrainingService.submitExemption(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.record(applicationId) });
      queryClient.invalidateQueries({ queryKey: trainingKeys.status(applicationId) });
    },
  });
};

/**
 * Hook to approve an exemption (Manager only)
 */
export const useApproveExemption = (applicationId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: string; data: ExemptionActionRequest }) => 
      TrainingService.approveExemption(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.records() });
      queryClient.invalidateQueries({ queryKey: trainingKeys.exemptions() });
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: trainingKeys.status(applicationId) });
      }
    },
  });
};

/**
 * Hook to reject an exemption (Manager only)
 */
export const useRejectExemption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: { id: string; data: ExemptionActionRequest }) => 
      TrainingService.rejectExemption(request.id, request.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.records() });
      queryClient.invalidateQueries({ queryKey: trainingKeys.exemptions() });
    },
  });
};

/**
 * Hook to fetch training completion status
 */
export const useTrainingStatus = (applicationId: string) => {
  return useQuery({
    queryKey: trainingKeys.status(applicationId),
    queryFn: () => TrainingService.getStatus(applicationId),
    enabled: !!applicationId,
  });
};

/**
 * Hook to fetch all pending exemptions (Manager only)
 */
export const usePendingExemptions = () => {
  return useQuery({
    queryKey: trainingKeys.pendingExemptions(),
    queryFn: () => TrainingService.getPendingExemptions(),
  });
};
