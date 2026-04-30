import { PaymentStatus, FeeType } from '@/lib/enums';

// Re-export from single source
export { PaymentStatus, FeeType } from '@/lib/enums';

// ============================================================
// PaymentMethod - matches backend numeric values
// ============================================================
export enum PaymentMethod {
  Mada = 0,
  Visa = 1,
  MasterCard = 2,
  ApplePay = 3,
  BankTransfer = 4,
  Jeeb = 5
}

export interface PaymentDto {
  id: string;
  applicationId: string;
  applicationNumber: string;
  applicantFullName: string;
  feeType: FeeType;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
}

export interface PaymentDetailDto extends PaymentDto {
  paymentUrl?: string;
}

export interface InitiatePaymentRequest {
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardHolderName?: string;
}

export interface PaymentReceiptDto {
  id: string;
  applicationNumber: string;
  applicantFullName: string;
  feeType: FeeType;
  feeTypeName: string;
  amount: number;
  status: PaymentStatus;
  paidAt: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
}