import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';

export type AppointmentType = 'MedicalExam' | 'TheoryTest' | 'PracticalTest';

export interface AppointmentDto {
  id: string;
  applicationId: string;
  appointmentType: AppointmentType;
  scheduledDate: string;
  timeSlot: string;
  branchId: string | null;
  branchName: string | null;
  assignedStaffId: string | null;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';
  notes: string | null;
  cancellationReason: string | null;
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
    const response = await apiClient.get('/appointments/available-slots', {
      params: { type, branchId, date }
    });
    return response.data;
  },

  /**
   * Get all appointments for a specific application
   */
  async getByApplication(applicationId: string): Promise<ApiResponse<AppointmentDto[]>> {
    const response = await apiClient.get(`/appointments/application/${applicationId}`);
    return response.data;
  },

  /**
   * Get a single appointment by ID
   */
  async getById(id: string): Promise<ApiResponse<AppointmentDto>> {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  /**
   * Create a new appointment (book a slot)
   */
  async createAppointment(request: CreateAppointmentRequest): Promise<ApiResponse<AppointmentDto>> {
    const response = await apiClient.post('/appointments', request);
    return response.data;
  },

  /**
   * Reschedule an existing appointment
   */
  async rescheduleAppointment(
    id: string,
    request: RescheduleAppointmentRequest
  ): Promise<ApiResponse<AppointmentDto>> {
    const response = await apiClient.patch(`/appointments/${id}/reschedule`, request);
    return response.data;
  },

  /**
   * Cancel an existing appointment
   */
  async cancelAppointment(
    id: string,
    request: CancelAppointmentRequest
  ): Promise<ApiResponse<AppointmentDto>> {
    const response = await apiClient.patch(`/appointments/${id}/cancel`, request);
    return response.data;
  },

  /**
   * Validate a booking request without creating the appointment
   */
  async validateBooking(request: CreateAppointmentRequest): Promise<ApiResponse<AppointmentValidationResult>> {
    const response = await apiClient.post('/appointments/validate', request);
    return response.data;
  }
};

export default AppointmentService;