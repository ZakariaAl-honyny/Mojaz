import apiClient from "@/lib/api-client";
import {
  Gate4ValidationResult,
  FinalizeApplicationRequest,
  ApplicationDecision,
} from "@/types/finalApproval.types";

const API_BASE = "/api/v1/applications";

export const finalApprovalService = {
  async getGate4Status(applicationId: string): Promise<Gate4ValidationResult> {
    const response = await apiClient.get<Gate4ValidationResult>(
      `${API_BASE}/${applicationId}/gate4`
    );
    return response.data as Gate4ValidationResult;
  },

  async finalize(
    applicationId: string,
    request: FinalizeApplicationRequest
  ): Promise<ApplicationDecision> {
    const response = await apiClient.post<ApplicationDecision>(
      `${API_BASE}/${applicationId}/finalize`,
      request
    );
    return response.data as ApplicationDecision;
  },
};