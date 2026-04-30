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
    Task<List<DaySlotsDto>> GetAvailableSlotsAsync(AppointmentType type, Guid branchId, DateOnly date, CancellationToken ct = default);
    Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentRequest request, CancellationToken ct = default);
    Task<AppointmentDto?> GetAppointmentByIdAsync(Guid id, Guid userId, string role, CancellationToken ct = default);
    Task<List<AppointmentDto>> GetAppointmentsByApplicationAsync(Guid applicationId, Guid userId, string role, CancellationToken ct = default);
    Task<List<AppointmentDto>> GetMyAppointmentsAsync(Guid userId, CancellationToken ct = default);
    Task<List<AppointmentDto>> GetAttendanceAsync(DateOnly date, Guid branchId, CancellationToken ct = default);
    Task<AppointmentDto> CheckInAsync(Guid appointmentId, CancellationToken ct = default);
    Task<AppointmentDto> RescheduleAppointmentAsync(Guid appointmentId, RescheduleAppointmentRequest request, Guid userId, string role, CancellationToken ct = default);
    Task<AppointmentDto> CancelAppointmentAsync(Guid appointmentId, CancelAppointmentRequest request, Guid userId, string role, CancellationToken ct = default);
    Task<AppointmentValidationResult> ValidateBookingAsync(CreateAppointmentRequest request, CancellationToken ct = default);
}