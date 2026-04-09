using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Mojaz.Application.DTOs.Appointments;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly ISystemSettingsService _systemSettingsService;
    private readonly INotificationService _notificationService;
    private readonly IMapper _mapper;
    private readonly ITrainingService _trainingService;

    public AppointmentService(
        IAppointmentRepository appointmentRepository,
        IRepository<ApplicationEntity> applicationRepository,
        ISystemSettingsService systemSettingsService,
        INotificationService notificationService,
        IMapper mapper,
        ITrainingService trainingService)
    {
        _appointmentRepository = appointmentRepository;
        _applicationRepository = applicationRepository;
        _systemSettingsService = systemSettingsService;
        _notificationService = notificationService;
        _mapper = mapper;
        _trainingService = trainingService;
    }

    public async Task<List<DaySlotsDto>> GetAvailableSlotsAsync(AppointmentType type, Guid branchId, DateOnly date, CancellationToken ct = default)
    {
        var result = new List<DaySlotsDto>();
        var daySlots = new DaySlotsDto { Date = date };

        // Get working hours and capacity settings
        var workingStart = await _systemSettingsService.GetAsync("WORKING_HOURS_START") ?? "08:00";
        var workingEnd = await _systemSettingsService.GetAsync("WORKING_HOURS_END") ?? "16:00";
        var slotDuration = await _systemSettingsService.GetIntAsync("DEFAULT_APPOINTMENT_DURATION_MINUTES") ?? 30;
        var maxCapacity = await _systemSettingsService.GetIntAsync("MAX_APPOINTMENTS_PER_SLOT") ?? 2;
        var bufferMinutes = await _systemSettingsService.GetIntAsync("SLOT_BUFFER_MINUTES") ?? 15;

        // Get booked slots for the date
        var bookedAppointments = await _appointmentRepository.GetByBranchAndDateAsync(branchId, date, ct);
        var bookedSlots = bookedAppointments
            .Where(a => a.AppointmentType == type && a.Status != "Cancelled")
            .GroupBy(a => a.TimeSlot)
            .ToDictionary(g => g.Key, g => g.Count());

        // Generate time slots
        var startTime = TimeOnly.Parse(workingStart);
        var endTime = TimeOnly.Parse(workingEnd);
        
        while (startTime.AddMinutes(slotDuration) <= endTime)
        {
            var slotTime = startTime.ToString("HH:mm");
            var bookedCount = bookedSlots.GetValueOrDefault(slotTime, 0);
            var availableCapacity = maxCapacity - bookedCount;

            daySlots.Slots.Add(new AvailableSlotDto
            {
                Date = date,
                Time = slotTime,
                DurationMinutes = slotDuration,
                AvailableCapacity = availableCapacity,
                IsAvailable = availableCapacity > 0
            });

            startTime = startTime.AddMinutes(slotDuration + bufferMinutes);
        }

        if (daySlots.Slots.Any())
        {
            result.Add(daySlots);
        }

        return result;
    }

    public async Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentRequest request, CancellationToken ct = default)
    {
        // Validate booking first
        var validator = new AppointmentBookingValidator(
            _appointmentRepository, 
            _applicationRepository, 
            _systemSettingsService,
            _trainingService);
        
        var validation = await validator.ValidateBookingAsync(request, ct);
        if (!validation.IsValid)
        {
            throw new InvalidOperationException(string.Join("; ", validation.Errors));
        }

        // Create the appointment
        var appointment = new Appointment
        {
            ApplicationId = request.ApplicationId,
            AppointmentType = request.Type,
            ScheduledDate = request.ScheduledDate,
            TimeSlot = request.TimeSlot,
            BranchId = request.BranchId,
            Status = "Scheduled",
            Notes = request.Notes,
            RescheduleCount = 0,
            ReminderSent = false
        };

        await _appointmentRepository.AddAsync(appointment, ct);
        
        // Return the created appointment as DTO
        var createdAppointment = await _appointmentRepository.GetByIdWithApplicationAsync(appointment.Id, ct);
        return _mapper.Map<AppointmentDto>(createdAppointment);
    }

    public async Task<AppointmentDto?> GetAppointmentByIdAsync(Guid id, CancellationToken ct = default)
    {
        var appointment = await _appointmentRepository.GetByIdWithApplicationAsync(id, ct);
        return appointment != null ? _mapper.Map<AppointmentDto>(appointment) : null;
    }

    public async Task<List<AppointmentDto>> GetAppointmentsByApplicationAsync(Guid applicationId, CancellationToken ct = default)
    {
        var appointments = await _appointmentRepository.GetByApplicationIdAsync(applicationId, ct);
        return _mapper.Map<List<AppointmentDto>>(appointments);
    }

    public async Task<AppointmentDto> RescheduleAppointmentAsync(Guid appointmentId, RescheduleAppointmentRequest request, CancellationToken ct = default)
    {
        // Validate reschedule first
        var validator = new AppointmentBookingValidator(
            _appointmentRepository, 
            _applicationRepository, 
            _systemSettingsService,
            _trainingService);
        
        var validation = await validator.ValidateRescheduleAsync(appointmentId, request, ct);
        if (!validation.IsValid)
        {
            throw new InvalidOperationException(string.Join("; ", validation.Errors));
        }

        var appointment = await _appointmentRepository.GetByIdForRescheduleAsync(appointmentId, ct);
        if (appointment == null)
        {
            throw new InvalidOperationException("Appointment not found");
        }

        // Update appointment with new values
        appointment.ScheduledDate = request.NewScheduledDate;
        appointment.TimeSlot = request.NewTimeSlot;
        if (request.NewBranchId.HasValue)
        {
            appointment.BranchId = request.NewBranchId;
        }
        appointment.RescheduleCount++;

        _appointmentRepository.Update(appointment);

        var updatedAppointment = await _appointmentRepository.GetByIdWithApplicationAsync(appointmentId, ct);
        return _mapper.Map<AppointmentDto>(updatedAppointment);
    }

    public async Task<AppointmentDto> CancelAppointmentAsync(Guid appointmentId, CancelAppointmentRequest request, CancellationToken ct = default)
    {
        var appointment = await _appointmentRepository.GetByIdForRescheduleAsync(appointmentId, ct);
        if (appointment == null)
        {
            throw new InvalidOperationException("Appointment not found");
        }

        if (appointment.Status == "Cancelled" || appointment.Status == "Completed")
        {
            throw new InvalidOperationException("Cannot cancel an already cancelled or completed appointment");
        }

        appointment.Status = "Cancelled";
        appointment.CancelledAt = DateTime.UtcNow;
        appointment.CancellationReason = request.Reason;

        _appointmentRepository.Update(appointment);

        var cancelledAppointment = await _appointmentRepository.GetByIdWithApplicationAsync(appointmentId, ct);
        return _mapper.Map<AppointmentDto>(cancelledAppointment);
    }

    public async Task<AppointmentValidationResult> ValidateBookingAsync(CreateAppointmentRequest request, CancellationToken ct = default)
    {
        var validator = new AppointmentBookingValidator(
            _appointmentRepository, 
            _applicationRepository, 
            _systemSettingsService,
            _trainingService);
        
        return await validator.ValidateBookingAsync(request, ct);
    }
}