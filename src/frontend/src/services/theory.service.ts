import api from '@/lib/api-client';
import { 
  TheoryHistoryResponse, 
  SubmitTheoryResultRequest, 
  SubmitTheoryResultResponse 
} from '@/types/theory.types';

export const theoryService = {
  /**
 * Submit a theory test result (Examiner only) - uses GUID-based appId
 * Note: Backend does NOT have a by-number endpoint for submit, only history
 */
submitResult: async (appId: string, request: SubmitTheoryResultRequest): Promise<SubmitTheoryResultResponse> => {
  const response = await api.post<SubmitTheoryResultResponse>(`/theory-tests/${appId}/result`, request);
  return response.data;
},

/**
 * Get theory test history for an application by application number
 * Uses new by-number endpoint: GET /api/v1/theory-tests/by-number/{applicationNumber}/history
 */
getHistory: async (applicationNumber: string, page = 1, pageSize = 20): Promise<TheoryHistoryResponse> => {
  const response = await api.get<TheoryHistoryResponse>(`/theory-tests/by-number/${applicationNumber}/history`, {
    params: { page, pageSize }
  });
  return response.data;
}
};

export default theoryService;
