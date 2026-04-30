import api from "@/lib/api-client";
import { ApiResponse, PaginatedResult } from "@/types/api.types";
import { FeeType, PaymentStatus, PaymentMethod } from "@/types/payment.types";
import type { PaymentDto } from "@/types/payment.types";

// Re-export for convenience
export { FeeType, PaymentStatus, PaymentMethod };
export type { PaymentDto };

export interface PaymentInitiateRequest {
  feeType: FeeType;
  licenseCategoryId?: string;
}

export interface PaymentConfirmRequest {
  paymentId: number;
  paymentMethod?: string;
  isSuccessful: boolean;
}

// Internal lock for payment confirmations
const _activeConfirmations = new Set<number>();

const getBaseUrl = (idOrNumber: string) => `payments/application/${idOrNumber}`;

export const paymentService = {
  /**
   * Get current applicant's payments
   */
  getMyPayments: async (): Promise<ApiResponse<PaymentDto[]>> => {
    const response = await api.get<ApiResponse<PaymentDto[]>>(`payments/my-payments`);
    return response.data;
  },

  /**
   * Get all payments (for employees/managers)
   */
  getAllPayments: async (page = 1, pageSize = 20, status?: string, search?: string): Promise<ApiResponse<PaginatedResult<PaymentDto>>> => {
    const response = await api.get<ApiResponse<PaginatedResult<PaymentDto>>>(`payments`, {
      params: { page, pageSize, status, search }
    });
    return response.data;
  },

  /**
   * Initiate a new payment for an application
   */
  initiatePayment: async (idOrNumber: string, data: PaymentInitiateRequest) => {
    const response = await api.post<ApiResponse<PaymentDto>>(
      `${getBaseUrl(idOrNumber)}/initiate`,
      data
    );
    return response.data;
  },

  /**
   * List all payment transactions for an application
   */
  getPaymentsByApplication: async (idOrNumber: string) => {
    const response = await api.get<ApiResponse<PaymentDto[]>>(getBaseUrl(idOrNumber));
    return response.data;
  },

  /**
   * Get a single payment by ID and its receipt info
   */
  getPaymentById: async (paymentId: number): Promise<ApiResponse<PaymentDto>> => {
    const response = await api.get<ApiResponse<PaymentDto>>(`payments/receipt/${paymentId}`);
    return response.data;
  },

/**
    * Confirm a payment success or failure
    */
  confirmPayment: async (data: PaymentConfirmRequest): Promise<ApiResponse<PaymentDto>> => {
    if (_activeConfirmations.has(data.paymentId)) {
      return { 
        success: false, 
        message: "عملية الدفع قيد المعالجة حالياً", 
        statusCode: 429 
      } as any;
    }

    try {
      _activeConfirmations.add(data.paymentId);
      const response = await api.post<ApiResponse<PaymentDto>>(`payments/confirm`, data);
      return response.data;
    } finally {
      _activeConfirmations.delete(data.paymentId);
    }
  },

  /**
   * Process payment (simulate success) - for demo
   */
  processPayment: async (paymentId: number): Promise<ApiResponse<PaymentDto>> => {
    try {
      const response = await api.post<ApiResponse<PaymentDto>>(`payments/${paymentId}/process`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'فشل في معالجة الدفع',
        statusCode: error.response?.statusCode || 500,
        data: null
      };
    }
  },

  /**
   * Get pending payment for an application
   */
  getPendingPayment: async (applicationId: number): Promise<ApiResponse<PaymentDto>> => {
    try {
      const response = await api.get<ApiResponse<PaymentDto>>(`applications/${applicationId}/pending-payment`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'لم يتم العثور على دفع معلقة',
        statusCode: 404,
        data: null
      };
    }
  },

  /**
   * Download payment receipt as PDF
   */
  downloadReceipt: async (paymentId: number) => {
    const response = await api.get(`payments/${paymentId}/receipt`, {
      responseType: "blob",
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `receipt-${paymentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};