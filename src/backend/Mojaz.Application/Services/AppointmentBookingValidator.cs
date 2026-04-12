using Mojaz.Application.DTOs.Appointments;
using Mojaz.Application.Interfaces;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class AppointmentBookingValidator
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly ISystemSettingsService _systemSettingsService;
    private readonly ITrainingService _trainingService;
    private readonly ITheoryService _theoryService;
    private readonly IPracticalService _practicalService;

    public AppointmentBookingValidator(
        IAppointmentRepository appointmentRepository,
        IRepository<ApplicationEntity> applicationRepository,
        ISystemSettingsService systemSettingsService,
        ITrainingService trainingService,
        ITheoryService theoryService,
        IPracticalService practicalService)
    {
        _appointmentRepository = appointmentRepository;
        _applicationRepository = applicationRepository;
        _systemSettingsService = systemSettingsService;
        _trainingService = trainingService;
        _theoryService = theoryService;
        _practicalService = practicalService;
    }

    public async Task<AppointmentValidationResult> ValidateBookingAsync(CreateAppointmentRequest request, CancellationToken ct = default)
    {
        var result = new AppointmentValidationResult { IsValid = true };

        // Gate 1: Check if Application exists
        var application = await _applicationRepository.GetByIdAsync(request.ApplicationId, ct);
        if (application == null)
        {
            result.IsValid = false;
            result.Errors.Add("Application not found");
            return result;
        }

        // Gate 1: Check if Application is in correct status for booking
        // Only allow applications that have passed document verification and paid
        var allowedStatuses = new[] 
        { 
            ApplicationStatus.Submitted.ToString(), 
            ApplicationStatus.InReview.ToString(),
            "MedicalPending",
            "TheoryPending",
            "PracticalPending"
        };
        
        if (!allowedStatuses.Contains(application.Status.ToString()))
        {
            result.IsValid = false;
            result.Errors.Add($"Application status '{application.Status}' does not allow booking. Application must be submitted and paid.");
            return result;
        }

        // Gate 2: Check if no existing active appointment for same type
        var existingAppointment = await _appointmentRepository.GetByApplicationIdAsync(request.ApplicationId, request.Type, ct);
        if (existingAppointment != null)
        {
            if (existingAppointment.Status == "Scheduled")
            {
                result.IsValid = false;
                result.Errors.Add($"An active {request.Type} appointment already exists. Please reschedule or cancel it first.");
                return result;
            }
        }

        // Gate 3: Check date is not in the past
        if (request.ScheduledDate < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            result.IsValid = false;
            result.Errors.Add("Cannot book an appointment for a past date");
            return result;
        }

        // Gate 4: Check date is within booking window
        var minDaysAhead = await _systemSettingsService.GetIntAsync("MIN_BOOKING_DAYS_AHEAD") ?? 1;
        var maxDaysAhead = await _systemSettingsService.GetIntAsync("MAX_BOOKING_DAYS_AHEAD") ?? 30;
        
        var minDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(minDaysAhead));
        var maxDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(maxDaysAhead));
        
        if (request.ScheduledDate < minDate || request.ScheduledDate > maxDate)
        {
            result.IsValid = false;
            result.Errors.Add($"Appointments must be booked between {minDate} and {maxDate}");
            return result;
        }

        // Gate 5: Check slot capacity
        var maxCapacity = await _systemSettingsService.GetIntAsync("MAX_APPOINTMENTS_PER_SLOT") ?? 2;
        var bookedCount = await _appointmentRepository.GetBookedSlotCountAsync(request.BranchId, request.ScheduledDate, request.TimeSlot, ct);
        
        if (bookedCount >= maxCapacity)
        {
            result.IsValid = false;
            result.Errors.Add("This time slot is fully booked. Please select another slot.");
            return result;
        }

        // Gate 6: Verify working hours
        var workingStart = await _systemSettingsService.GetAsync("WORKING_HOURS_START") ?? "08:00";
        var workingEnd = await _systemSettingsService.GetAsync("WORKING_HOURS_END") ?? "16:00";
        
        if (string.Compare(request.TimeSlot, workingStart) < 0 || string.Compare(request.TimeSlot, workingEnd) > 0)
        {
            result.IsValid = false;
            result.Errors.Add($"Time slot must be within working hours ({workingStart} - {workingEnd})");
            return result;
        }

        // Gate 3 (Training): Check if training is complete for Theory/Practical appointments
        if (request.Type == AppointmentType.TheoryTest || request.Type == AppointmentType.PracticalTest)
        {
            var trainingComplete = await _trainingService.IsTrainingCompleteAsync(request.ApplicationId);
            if (!trainingComplete.Data)
            {
                result.IsValid = false;
                result.Errors.Add("Training requirement not fulfilled (Gate 3). Training status must be Completed or Exempted before booking tests.");
                return result;
            }
        }

        // Gate 4 (Theory Test Limits): Check cooling period and max attempts
        if (request.Type == AppointmentType.TheoryTest)
        {
            // Check max attempts
            if (await _theoryService.HasReachedMaxAttemptsAsync(request.ApplicationId))
            {
                result.IsValid = false;
                result.Errors.Add("Maximum theory test attempts have been reached. You cannot book further attempts for this application.");
                return result;
            }

            // Check cooling period
            if (await _theoryService.IsInCoolingPeriodAsync(request.ApplicationId))
            {
                result.IsValid = false;
                
                // Get history to find the eligible date for a better error message
                var history = await _theoryService.GetHistoryAsync(request.ApplicationId, Guid.Empty, "Manager", 1, 1);
                var latestResult = history.Data?.Items.FirstOrDefault();
                var eligibleDate = latestResult?.RetakeEligibleAfter?.ToString("yyyy-MM-dd") ?? "the required cooling period has passed";

                result.Errors.Add($"You are currently in a cooling period after a failed attempt. You will be eligible to book after {eligibleDate}.");
                return result;
            }
        }

        // Gate 5 (Practical Test Limits): Check cooling period and max attempts
        if (request.Type == AppointmentType.PracticalTest)
        {
            // Check max attempts
            if (await _practicalService.HasReachedMaxAttemptsAsync(request.ApplicationId))
            {
                result.IsValid = false;
                result.Errors.Add("Maximum practical test attempts have been reached. You cannot book further attempts for this application.");
                return result;
            }

            // Check additional training
            if (await _practicalService.HasAdditionalTrainingRequiredAsync(request.ApplicationId))
            {
                result.IsValid = false;
                result.Errors.Add("Additional training is required before booking another practical test.");
                return result;
            }

            // Check cooling period
            if (await _practicalService.IsInCoolingPeriodAsync(request.ApplicationId))
            {
                result.IsValid = false;
                
                // Get history to find the eligible date for a better error message
                var history = await _practicalService.GetHistoryAsync(request.ApplicationId, Guid.Empty, "Manager", 1, 1);
                var latestResult = history.Data?.Items.FirstOrDefault();
                var eligibleDate = latestResult?.RetakeEligibleAfter?.ToString("yyyy-MM-dd") ?? "the required cooling period has passed";

                result.Errors.Add($"You are currently in a cooling period after a failed attempt. You will be eligible to book after {eligibleDate}.");
                return result;
            }
        }

        return result;
    }

    public async Task<AppointmentValidationResult> ValidateRescheduleAsync(Guid appointmentId, RescheduleAppointmentRequest request, CancellationToken ct = default)
    {
        var result = new AppointmentValidationResult { IsValid = true };

        // Get existing appointment
        var appointment = await _appointmentRepository.GetByIdForRescheduleAsync(appointmentId, ct);
        if (appointment == null)
        {
            result.IsValid = false;
            result.Errors.Add("Appointment not found");
            return result;
        }

        // Check reschedule count limit
        var maxReschedule = await _systemSettingsService.GetIntAsync("MAX_RESCHEDULE_COUNT") ?? 3;
        if (appointment.RescheduleCount >= maxReschedule)
        {
            result.IsValid = false;
            result.Errors.Add($"Maximum reschedule limit ({maxReschedule}) reached");
            return result;
        }

        // Check appointment is not already cancelled or completed
        if (appointment.Status == "Cancelled" || appointment.Status == "Completed")
        {
            result.IsValid = false;
            result.Errors.Add("Cannot reschedule a cancelled or completed appointment");
            return result;
        }

        // Validate new date is not in the past
        if (request.NewScheduledDate < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            result.IsValid = false;
            result.Errors.Add("Cannot reschedule to a past date");
            return result;
        }

        // Validate new date is within booking window
        var minDaysAhead = await _systemSettingsService.GetIntAsync("MIN_BOOKING_DAYS_AHEAD") ?? 1;
        var maxDaysAhead = await _systemSettingsService.GetIntAsync("MAX_BOOKING_DAYS_AHEAD") ?? 30;
        
        var minDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(minDaysAhead));
        var maxDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(maxDaysAhead));
        
        if (request.NewScheduledDate < minDate || request.NewScheduledDate > maxDate)
        {
            result.IsValid = false;
            result.Errors.Add($"Rescheduled date must be between {minDate} and {maxDate}");
            return result;
        }

        // Check slot capacity for new slot (if changing branch or time)
        var branchId = request.NewBranchId ?? appointment.BranchId ?? Guid.Empty;
        var newTimeSlot = request.NewTimeSlot;
        
        if (branchId != Guid.Empty && !string.IsNullOrEmpty(newTimeSlot))
        {
            var maxCapacity = await _systemSettingsService.GetIntAsync("MAX_APPOINTMENTS_PER_SLOT") ?? 2;
            var bookedCount = await _appointmentRepository.GetBookedSlotCountAsync(branchId, request.NewScheduledDate, newTimeSlot, ct);
            
            // Allow if it's the same appointment (rescheduling to same slot)
            if (bookedCount >= maxCapacity)
            {
                result.IsValid = false;
                result.Errors.Add("The new time slot is fully booked. Please select another slot.");
                return result;
            }
        }

        return result;
    }
}