using Mojaz.Application.DTOs.Appointments;
using Mojaz.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IAppointmentService
{
    Task<List<DaySlotsDto>> GetAvailableSlotsAsync(AppointmentType type, Guid branchId, DateOnly date, CancellationToken ct = default);
    Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentRequest request, CancellationToken ct = default);
    Task<AppointmentDto?> GetAppointmentByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<AppointmentDto>> GetAppointmentsByApplicationAsync(Guid applicationId, CancellationToken ct = default);
    Task<AppointmentDto> RescheduleAppointmentAsync(Guid appointmentId, RescheduleAppointmentRequest request, CancellationToken ct = default);
    Task<AppointmentDto> CancelAppointmentAsync(Guid appointmentId, CancelAppointmentRequest request, CancellationToken ct = default);
    Task<AppointmentValidationResult> ValidateBookingAsync(CreateAppointmentRequest request, CancellationToken ct = default);
}