export type PaymentStatus = 
  | 'Pending' 
  | 'Paid' 
  | 'Overdue' 
  | 'Failed' 
  | 'Refunded';

export type PaymentMethod = 
  | 'Mada' 
  | 'Visa' 
  | 'MasterCard' 
  | 'ApplePay';

export type FeeType = 
  | 'ApplicationFee' 
  | 'MedicalFee' 
  | 'TheoryFee' 
  | 'PracticalFee' 
  | 'IssuanceFee' 
  | 'RetakeFee';

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