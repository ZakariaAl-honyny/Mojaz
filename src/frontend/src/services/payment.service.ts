import api from "@/lib/api-client";
import { ApiResponse, PaginatedResult } from "@/types/api.types";

export interface PaymentInitiateRequest {
  feeType: number;
  licenseCategoryId?: string;
}

export interface PaymentConfirmRequest {
  paymentId: string;
  isSuccessful: boolean;
}

export interface PaymentDto {
  id: string;
  applicationId: string;
  feeType: number;
  amount: number;
  status: number;
  transactionReference: string;
  createdAt: string;
  paidAt?: string;
  receiptNumber?: string;
}

export const paymentService = {
  /**
   * Initiate a new payment for an application
   */
  initiatePayment: async (applicationId: string, data: PaymentInitiateRequest) => {
    const response = await api.post<ApiResponse<PaymentDto>>(
      `/api/v1/payments/initiate`,
      { ...data, applicationId }
    );
    return response.data;
  },

  /**
   * List all payment transactions for an application
   */
  getPaymentsByApplication: async (applicationId: string) => {
    const response = await api.get<ApiResponse<PaymentDto[]>>(
      `/api/v1/payments/application/${applicationId}`
    );
    return response.data;
  },

  /**
   * Confirm a payment success or failure (simulated)
   */
  confirmPayment: async (data: PaymentConfirmRequest) => {
    const response = await api.post<ApiResponse<PaymentDto>>(
      `/api/v1/payments/confirm`,
      data
    );
    return response.data;
  },

  /**
   * Download payment receipt as PDF
   */
  downloadReceipt: async (paymentId: string) => {
    const response = await api.get(`/api/v1/payments/${paymentId}/receipt`, {
      responseType: "blob",
    });
    
    // Create a URL for the blob and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `receipt-${paymentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};