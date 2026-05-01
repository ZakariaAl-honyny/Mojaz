import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';
import { AppointmentType } from '@/lib/enums';

export interface AppointmentDto {
  id: number;
  applicationId: number;
  applicationNumber?: string;
  applicantName?: string;
  nationalId?: string;
  phoneNumber?: string;
  appointmentType: AppointmentType;
  scheduledDate: string;
  timeSlot: string;
  branchId: number | null;
  branchName: string | null;
  assignedStaffId: number | null;
  status: string;
  notes: string | null;
  cancellationReason: string | null;
  checkInTime?: string | null;
  rescheduleCount: number;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AvailableSlotDto {
  date: string;
  time: string;
  durationMinutes: number;
  availableCapacity: number;
  isAvailable: boolean;
}

export interface DaySlotsDto {
  date: string;
  slots: AvailableSlotDto[];
}

export interface CreateAppointmentRequest {
  applicationId: string;
  type: AppointmentType;
  branchId: string;
  scheduledDate: string;
  timeSlot: string;
  notes?: string;
}

export interface RescheduleAppointmentRequest {
  newScheduledDate: string;
  newTimeSlot: string;
  newBranchId?: string;
}

export interface CancelAppointmentRequest {
  reason: string;
}

export interface AppointmentValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Appointment Service - handles all appointment-related API calls
 */
const AppointmentService = {
  /**
   * Get available slots for a specific date and branch
   */
  async getAvailableSlots(
    type: AppointmentType,
    branchId: string,
    date: string
  ): Promise<ApiResponse<DaySlotsDto[]>> {
    const response = await apiClient.get('appointments/available-slots', {
      params: { type, branchId, date }
    });
    return response.data;
  },

  /**
   * Get all appointments for a specific application
   */
  async getByApplication(idOrNumber: string): Promise<ApiResponse<AppointmentDto[]>> {
    const response = await apiClient.get(`appointments/application/${idOrNumber}`);
    return response.data;
  },

  /**
   * Get a single appointment by ID
   */
  async getById(id: string): Promise<ApiResponse<AppointmentDto>> {
    const response = await apiClient.get(`appointments/${id}`);
    return response.data;
  },

  /**
   * Create a new appointment (book a slot)
   */
  async createAppointment(idOrNumber: string, request: CreateAppointmentRequest): Promise<ApiResponse<AppointmentDto>> {
    const response = await apiClient.post(`appointments/application/${idOrNumber}`, request);
    return response.data;
  },

  /**
   * Reschedule an existing appointment
   */
  async rescheduleAppointment(
    id: string,
    request: RescheduleAppointmentRequest
  ): Promise<ApiResponse<AppointmentDto>> {
    const response = await apiClient.patch(`appointments/${id}/reschedule`, request);
    return response.data;
  },

  /**
   * Cancel an existing appointment
   */
  async cancelAppointment(
    id: string,
    request: CancelAppointmentRequest
  ): Promise<ApiResponse<AppointmentDto>> {
    const response = await apiClient.patch(`appointments/${id}/cancel`, request);
    return response.data;
  },

  /**
   * Get all appointments for the current logged-in user (applicant)
   * Note: validateBooking was removed - backend doesn't have /appointments/validate endpoint
   */
  async getMyAppointments(): Promise<ApiResponse<AppointmentDto[]>> {
    const response = await apiClient.get('appointments/my-appointments');
    return response.data;
  },

  /**
   * Get appointments for employee attendance tracking
   */
  async getAttendance(date: string): Promise<ApiResponse<AppointmentDto[]>> {
    const response = await apiClient.get('appointments/attendance', { params: { date } });
    return response.data;
  },

  /**
   * Check-in an applicant for their appointment
   */
  async checkIn(appointmentId: string): Promise<ApiResponse<AppointmentDto>> {
    const response = await apiClient.patch(`appointments/${appointmentId}/check-in`);
    return response.data;
  },

  /**
   * Get default branch ID from settings
   * Returns the default branch for appointments
   */
  async getDefaultBranch(): Promise<string | null> {
    try {
      const response = await apiClient.get('settings/DEFAULT_BRANCH_ID');
      return response.data?.data?.value || null;
    } catch {
      // If setting not found, return a default placeholder
      return null;
    }
  }
};

export default AppointmentService;