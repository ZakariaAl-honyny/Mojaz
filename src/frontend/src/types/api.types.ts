export type ApplicationStatus = 
  | "Draft"
  | "Submitted"
  | "InReview"
  | "Paid"
  | "MedicalDone"
  | "TheoryDone"
  | "PracticalDone"
  | "Approved"
  | "Issued"
  | "Rejected"
  | "Cancelled";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: string[];
  statusCode: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

