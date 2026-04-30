using Mojaz.Application.DTOs.Appointments;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IAppointmentService
{
    Task<PagedResult<AppointmentDto>> GetAppointmentsAsync(int page, int pageSize, AppointmentStatus? status, AppointmentType? type, DateOnly? from, DateOnly? to, string? search, CancellationToken ct = default);
    Task<List<DaySlotsDto>> GetAvailableSlotsAsync(AppointmentType type, int branchId, DateOnly date, CancellationToken ct = default);
    Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentRequest request, CancellationToken ct = default);
    Task<AppointmentDto?> GetAppointmentByIdAsync(int id, int userId, string role, CancellationToken ct = default);
    Task<List<AppointmentDto>> GetAppointmentsByApplicationAsync(int applicationId, int userId, string role, CancellationToken ct = default);
    Task<List<AppointmentDto>> GetMyAppointmentsAsync(int userId, CancellationToken ct = default);
    Task<List<AppointmentDto>> GetAttendanceAsync(DateOnly date, int branchId, CancellationToken ct = default);
    Task<AppointmentDto> CheckInAsync(int appointmentId, CancellationToken ct = default);
    Task<AppointmentDto> RescheduleAppointmentAsync(int appointmentId, RescheduleAppointmentRequest request, int userId, string role, CancellationToken ct = default);
    Task<AppointmentDto> CancelAppointmentAsync(int appointmentId, CancelAppointmentRequest request, int userId, string role, CancellationToken ct = default);
    Task<AppointmentValidationResult> ValidateBookingAsync(CreateAppointmentRequest request, CancellationToken ct = default);
}