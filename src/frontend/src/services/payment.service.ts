import api from "@/lib/api-client";
import { ApiResponse, PaginatedResult, FeeType, PaymentStatus } from "@/types/api.types";

// Re-export for convenience
export { FeeType, PaymentStatus };

export interface PaymentInitiateRequest {
  feeType: FeeType;
  licenseCategoryId?: string;
}

export interface PaymentConfirmRequest {
  paymentId: string;
  paymentMethod?: string;
  isSuccessful: boolean;
}

export interface PaymentDto {
  id: string;
  applicationId: string;
  applicationNumber: string;
  applicantFullName: string;
  feeType: string; // Using string for flexibility (e.g., 'ApplicationFee')
  amount: number;
  status: string; // Using string for flexibility (e.g., 'Pending')
  dueDate?: string;
  transactionReference?: string;
  paidAt?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  createdAt: string;
}

export const paymentService = {
  /**
   * Get current applicant's payments
   */
  getMyPayments: async (): Promise<ApiResponse<PaymentDto[]>> => {
    const response = await api.get<ApiResponse<PaymentDto[]>>(`/payments/my-payments`);
    return response.data;
  },

  /**
   * Get all payments (for employees/managers)
   */
  getAllPayments: async (page = 1, pageSize = 20, status?: string, search?: string): Promise<ApiResponse<PaginatedResult<PaymentDto>>> => {
    const response = await api.get<ApiResponse<PaginatedResult<PaymentDto>>>(`/payments`, {
      params: { page, pageSize, status, search }
    });
    return response.data;
  },

  /**
   * Initiate a new payment for an application by application number
   */
  initiatePayment: async (applicationNumber: string, data: PaymentInitiateRequest) => {
    const response = await api.post<ApiResponse<PaymentDto>>(
      `/payments/initiate-by-number/${applicationNumber}`,
      data
    );
    return response.data;
  },

  /**
   * List all payment transactions for an application by application number
   * @param applicationNumber - The application number (e.g., MOJ-2025-XXXXXXXX)
   */
  getPaymentsByApplication: async (applicationNumber: string) => {
    const response = await api.get<ApiResponse<PaymentDto[]>>(
      `/payments/by-number/${applicationNumber}`
    );
    return response.data;
  },

  /**
   * Get a single payment by ID
   * @param paymentId - The payment ID
   */
  getPaymentById: async (paymentId: string): Promise<ApiResponse<PaymentDto>> => {
    const response = await api.get<ApiResponse<PaymentDto>>(
      `/payments/${paymentId}`
    );
    return response.data;
  },

  /**
   * Confirm a payment success or failure (simulated)
   */
  confirmPayment: async (data: PaymentConfirmRequest) => {
    const response = await api.post<ApiResponse<PaymentDto>>(
      `/payments/confirm`,
      data
    );
    return response.data;
  },

  /**
   * Download payment receipt as PDF
   */
  downloadReceipt: async (paymentId: string) => {
    const response = await api.get(`/payments/${paymentId}/receipt`, {
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