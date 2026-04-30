import axios from '@/lib/api-client';

// Fee Types
export enum FeeType {
  ApplicationFee = 'ApplicationFee',
  MedicalExamFee = 'MedicalExamFee',
  TheoryTestFee = 'TheoryTestFee',
  PracticalTestFee = 'PracticalTestFee',
  IssuanceFee = 'IssuanceFee',
  RetakeFee = 'RetakeFee'
}

// License Categories
export enum LicenseCategory {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F'
}

export interface FeeDto {
  id: string;
  feeType: FeeType;
  licenseCategory: LicenseCategory;
  amount: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFeeRequest {
  feeType: FeeType;
  licenseCategory: LicenseCategory;
  amount: number;
  currency?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  description?: string;
}

export interface UpdateFeeRequest {
  feeType?: FeeType;
  licenseCategory?: LicenseCategory;
  amount?: number;
  currency?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  description?: string;
  isActive?: boolean;
}

export const feeService = {
  async getAllFees(): Promise<FeeDto[]> {
    const response = await axios.get<{ data: FeeDto[] }>('fees');
    return response.data.data;
  },

  async getFeeById(id: string): Promise<FeeDto> {
    const response = await axios.get<{ data: FeeDto }>(`fees/${id}`);
    return response.data.data;
  },

  async createFee(request: CreateFeeRequest): Promise<FeeDto> {
    const response = await axios.post<{ data: FeeDto }>('fees', request);
    return response.data.data;
  },

  async updateFee(id: string, request: UpdateFeeRequest): Promise<FeeDto> {
    const response = await axios.put<{ data: FeeDto }>(`fees/${id}`, request);
    return response.data.data;
  },

  async deleteFee(id: string): Promise<void> {
    await axios.delete(`fees/${id}`);
  },

  async activateFee(id: string): Promise<FeeDto> {
    const response = await axios.put<{ data: FeeDto }>(`fees/${id}`, { isActive: true });
    return response.data.data;
  },

  async deactivateFee(id: string): Promise<FeeDto> {
    const response = await axios.put<{ data: FeeDto }>(`fees/${id}`, { isActive: false });
    return response.data.data;
  }
};

export default feeService;