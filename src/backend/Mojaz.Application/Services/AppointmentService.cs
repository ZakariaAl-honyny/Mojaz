using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Mojaz.Application.DTOs.Appointments;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Exceptions;
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
    private readonly IUnitOfWork _unitOfWork;
    private readonly AppointmentBookingValidator _bookingValidator;

    public AppointmentService(
        IAppointmentRepository appointmentRepository,
        IRepository<ApplicationEntity> applicationRepository,
        ISystemSettingsService systemSettingsService,
        INotificationService notificationService,
        IMapper mapper,
        ITrainingService trainingService,
        IUnitOfWork unitOfWork,
        AppointmentBookingValidator bookingValidator)
    {
        _appointmentRepository = appointmentRepository;
        _applicationRepository = applicationRepository;
        _systemSettingsService = systemSettingsService;
        _notificationService = notificationService;
        _mapper = mapper;
        _trainingService = trainingService;
        _unitOfWork = unitOfWork;
        _bookingValidator = bookingValidator;
    }

    public async Task<PagedResult<AppointmentDto>> GetAppointmentsAsync(
        int page,
        int pageSize,
        AppointmentStatus? status,
        AppointmentType? type,
        DateOnly? from,
        DateOnly? to,
        string? search,
        CancellationToken ct = default)
    {
        var query = _appointmentRepository.Query()
            .Include(a => a.Application)
                .ThenInclude(app => app.Applicant)
            .Include(a => a.Branch)
            .AsNoTracking();

        if (status.HasValue)
            query = query.Where(a => a.Status == status.Value);

        if (type.HasValue)
            query = query.Where(a => a.AppointmentType == type.Value);

        if (from.HasValue)
            query = query.Where(a => a.ScheduledDate >= from.Value);

        if (to.HasValue)
            query = query.Where(a => a.ScheduledDate <= to.Value);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(a => (a.Notes != null && a.Notes.Contains(search)) || 
                                     (a.Application != null && a.Application.ApplicationNumber.Contains(search)));

        var totalCount = await query.CountAsync(ct);
        var items = await query
            .OrderBy(a => a.ScheduledDate)
            .ThenBy(a => a.TimeSlot)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PagedResult<AppointmentDto>
        {
            Items = _mapper.Map<List<AppointmentDto>>(items),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages,
            HasPreviousPage = page > 1,
            HasNextPage = page < totalPages
        };
    }

    public async Task<List<DaySlotsDto>> GetAvailableSlotsAsync(AppointmentType type, int branchId, DateOnly date, CancellationToken ct = default)
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
            .Where(a => a.AppointmentType == type && a.Status != AppointmentStatus.Cancelled)
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
        var validation = await _bookingValidator.ValidateBookingAsync(request, ct);
        if (!validation.IsValid)
        {
            throw new Mojaz.Shared.Exceptions.ValidationException(validation.Errors);
        }

        // Create the appointment
        var appointment = new Appointment
        {
            ApplicationId = request.ApplicationId,
            AppointmentType = request.Type,
            ScheduledDate = request.ScheduledDate,
            TimeSlot = request.TimeSlot,
            BranchId = request.BranchId,
            Status = AppointmentStatus.Scheduled,
            Notes = request.Notes,
            RescheduleCount = 0,
            ReminderSent = false
        };

        Console.WriteLine($"[AppointmentService] Attempting to save appointment: AppId={appointment.ApplicationId}, Type={appointment.AppointmentType}, Date={appointment.ScheduledDate}, Slot={appointment.TimeSlot}");

        await _appointmentRepository.AddAsync(appointment, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        
        Console.WriteLine($"[AppointmentService] Success! Appointment saved with ID: {appointment.Id}");
        
        // Return the created appointment as DTO (Map directly to avoid unnecessary DB fetch and potential null issues)
        var createdAppointment = await _appointmentRepository.GetByIdWithApplicationAsync(appointment.Id, ct);
        return _mapper.Map<AppointmentDto>(createdAppointment ?? appointment);
    }

    public async Task<AppointmentDto?> GetAppointmentByIdAsync(int id, int userId, string role, CancellationToken ct = default)
    {
        var appointment = await _appointmentRepository.GetByIdWithApplicationAsync(id, ct);
        if (appointment == null) return null;

        // Ownership check for Applicants
        if (role == "Applicant" && appointment.Application?.ApplicantId != userId)
            return null;

        return appointment != null ? _mapper.Map<AppointmentDto>(appointment) : null;
    }

    public async Task<List<AppointmentDto>> GetAppointmentsByApplicationAsync(int applicationId, int userId, string role, CancellationToken ct = default)
    {
        // Get application to check ownership
        var application = await _applicationRepository.GetByIdAsync(applicationId, ct);
        if (application == null) return new List<AppointmentDto>();

        // Ownership check for Applicants
        if (role == "Applicant" && application.ApplicantId != userId)
            return new List<AppointmentDto>();

        var appointments = await _appointmentRepository.GetByApplicationIdAsync(applicationId, ct);
        return _mapper.Map<List<AppointmentDto>>(appointments);
    }

    public async Task<AppointmentDto> RescheduleAppointmentAsync(int appointmentId, RescheduleAppointmentRequest request, int userId, string role, CancellationToken ct = default)
    {
        // Validate reschedule first
        var validation = await _bookingValidator.ValidateRescheduleAsync(appointmentId, request, ct);
        if (!validation.IsValid)
        {
            throw new Mojaz.Shared.Exceptions.ValidationException(validation.Errors);
        }

        var appointment = await _appointmentRepository.GetByIdForRescheduleAsync(appointmentId, ct);
        if (appointment == null)
        {
            throw new NotFoundException("Appointment", appointmentId);
        }

        // Ownership check for Applicants - can only reschedule their own appointments
        if (role == "Applicant")
        {
            var application = await _applicationRepository.GetByIdAsync(appointment.ApplicationId, ct);
            if (application == null || application.ApplicantId != userId)
            {
                throw new UnauthorizedAccessException("غير مصرح لك.");
            }
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
        await _unitOfWork.SaveChangesAsync(ct);

        var updatedAppointment = await _appointmentRepository.GetByIdWithApplicationAsync(appointmentId, ct);
        return _mapper.Map<AppointmentDto>(updatedAppointment);
    }

    public async Task<AppointmentDto> CancelAppointmentAsync(int appointmentId, CancelAppointmentRequest request, int userId, string role, CancellationToken ct = default)
    {
        var appointment = await _appointmentRepository.GetByIdForRescheduleAsync(appointmentId, ct);
        if (appointment == null)
        {
            throw new NotFoundException("Appointment", appointmentId);
        }

        // Ownership check for Applicants - can only cancel their own appointments
        if (role == "Applicant")
        {
            var application = await _applicationRepository.GetByIdAsync(appointment.ApplicationId, ct);
            if (application == null || application.ApplicantId != userId)
            {
                throw new UnauthorizedAccessException("غير مصرح لك.");
            }
        }

        if (appointment.Status == AppointmentStatus.Cancelled || appointment.Status == AppointmentStatus.Completed)
        {
            throw new Mojaz.Shared.Exceptions.ValidationException(new[] { "لا يمكن إلغاء موعد ملغى بالفعل أو مكتمل" });
        }

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.CancelledAt = DateTime.UtcNow;
        appointment.CancellationReason = request.Reason;

        _appointmentRepository.Update(appointment);
        await _unitOfWork.SaveChangesAsync(ct);

        var cancelledAppointment = await _appointmentRepository.GetByIdWithApplicationAsync(appointmentId, ct);
        return _mapper.Map<AppointmentDto>(cancelledAppointment);
    }

    public async Task<AppointmentValidationResult> ValidateBookingAsync(CreateAppointmentRequest request, CancellationToken ct = default)
    {
        return await _bookingValidator.ValidateBookingAsync(request, ct);
    }

    public async Task<List<AppointmentDto>> GetMyAppointmentsAsync(int userId, CancellationToken ct = default)
    {
        // Get all appointments for applications submitted by this user
        var appointments = await _appointmentRepository.Query()
            .Include(a => a.Application)
                .ThenInclude(app => app.Applicant)
            .Include(a => a.Branch)
            .Where(a => a.Application.ApplicantId == userId && !a.IsDeleted)
            .OrderByDescending(a => a.ScheduledDate)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync(ct);
        
        return _mapper.Map<List<AppointmentDto>>(appointments);
    }

    public async Task<List<AppointmentDto>> GetAttendanceAsync(DateOnly date, int branchId, CancellationToken ct = default)
    {
        var query = _appointmentRepository.Query()
            .Include(a => a.Application)
                .ThenInclude(app => app.Applicant)
            .Include(a => a.Branch)
            .Where(x => 
                x.ScheduledDate == date &&
                x.Status != AppointmentStatus.Cancelled &&
                !x.IsDeleted);

        if (branchId > 0)
        {
            query = query.Where(a => a.BranchId == branchId);
        }

        var appointments = await query.ToListAsync(ct);
        return _mapper.Map<List<AppointmentDto>>(appointments);
    }

    public async Task<AppointmentDto> CheckInAsync(int appointmentId, CancellationToken ct = default)
    {
        var appointment = await _appointmentRepository.GetByIdForRescheduleAsync(appointmentId, ct);
        if (appointment == null)
        {
            throw new NotFoundException("Appointment", appointmentId);
        }

        if (appointment.Status == AppointmentStatus.Cancelled || appointment.Status == AppointmentStatus.Completed)
        {
            throw new InvalidOperationException("لا يمكن تسجيل الحضور لموعد ملغى بالفعل أو مكتمل");
        }

        appointment.CheckInTime = TimeOnly.FromDateTime(DateTime.UtcNow);
        appointment.Status = AppointmentStatus.Scheduled; // Mark as checked in

        _appointmentRepository.Update(appointment);
        await _unitOfWork.SaveChangesAsync(ct);

        var updatedAppointment = await _appointmentRepository.GetByIdWithApplicationAsync(appointmentId, ct);
        return _mapper.Map<AppointmentDto>(updatedAppointment);
    }
}