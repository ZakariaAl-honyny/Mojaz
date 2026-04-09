import api from '@/lib/api-client';
import { 
  TheoryHistoryResponse, 
  SubmitTheoryResultRequest, 
  SubmitTheoryResultResponse 
} from '@/types/theory.types';

export const theoryService = {
  /**
   * Submit a theory test result (Examiner only)
   */
  submitResult: async (appId: string, request: SubmitTheoryResultRequest): Promise<SubmitTheoryResultResponse> => {
    const response = await api.post<SubmitTheoryResultResponse>(`/theory-tests/${appId}/result`, request);
    return response.data;
  },

  /**
   * Get theory test history for an application
   */
  getHistory: async (appId: string, page = 1, pageSize = 20): Promise<TheoryHistoryResponse> => {
    const response = await api.get<TheoryHistoryResponse>(`/theory-tests/${appId}/history`, {
      params: { page, pageSize }
    });
    return response.data;
  }
};

export default theoryService;
