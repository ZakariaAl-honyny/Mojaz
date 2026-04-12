using Hangfire;
using Microsoft.Extensions.Logging;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Infrastructure.Jobs;

/// <summary>
/// Hangfire recurring job that processes appointment reminders.
/// Runs every hour to check for appointments 12-24 hours ahead and send reminders via Push, Email, SMS.
/// </summary>
public class ProcessAppointmentRemindersJob
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly INotificationService _notificationService;
    private readonly ISystemSettingsService _systemSettingsService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ProcessAppointmentRemindersJob> _logger;

    public ProcessAppointmentRemindersJob(
        IAppointmentRepository appointmentRepository,
        INotificationService notificationService,
        ISystemSettingsService systemSettingsService,
        IUnitOfWork unitOfWork,
        ILogger<ProcessAppointmentRemindersJob> logger)
    {
        _appointmentRepository = appointmentRepository;
        _notificationService = notificationService;
        _systemSettingsService = systemSettingsService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Executes the job to process and send reminders for upcoming appointments.
    /// Looks for appointments 12-24 hours ahead that haven't received reminders yet.
    /// </summary>
    public async Task ExecuteAsync()
    {
        var now = DateTime.UtcNow;
        var reminderHours = await _systemSettingsService.GetIntAsync("REMINDER_HOURS_BEFORE") ?? 24;
        var hoursWindow = 12; // Check 12-24 hours window
        
        _logger.LogInformation("Starting appointment reminders processing job at {Time}", now);

        // Get appointments that need reminders (12-24 hours ahead and no reminder sent)
        var appointments = await _appointmentRepository.GetUpcomingWithRemindersAsync(reminderHours, hoursWindow);

        var processedCount = 0;
        var failedCount = 0;

        _logger.LogInformation("Found {Count} appointments requiring reminders", appointments.Count);

        foreach (var appointment in appointments)
        {
            try
            {
                // Skip cancelled or completed appointments
                if (appointment.Status == "Cancelled" || appointment.Status == "Completed")
                {
                    appointment.ReminderSent = true;
                    _appointmentRepository.Update(appointment);
                    continue;
                }

                // Get the application to find the applicant user
                var application = appointment.Application;
                if (application == null)
                {
                    _logger.LogWarning("Application not found for appointment {AppointmentId}", appointment.Id);
                    appointment.ReminderSent = true;
                    _appointmentRepository.Update(appointment);
                    continue;
                }

                // Build reminder notification (multilingual)
                var titleAr = "تذكير بموعدك";
                var titleEn = "Appointment Reminder";
                var messageAr = $"لديك موعد في فرع {GetBranchName(appointment.BranchId)} يوم {appointment.ScheduledDate:yyyy-MM-dd} الساعة {appointment.TimeSlot}";
                var messageEn = $"Your appointment is scheduled at {GetBranchName(appointment.BranchId)} on {appointment.ScheduledDate:yyyy-MM-dd} at {appointment.TimeSlot}";

                // Send notification via all channels
                var notificationRequest = new NotificationRequest
                {
                    UserId = application.ApplicantId,
                    ApplicationId = application.Id,
                    EventType = NotificationEventType.AppointmentReminder,
                    TitleAr = titleAr,
                    TitleEn = titleEn,
                    MessageAr = messageAr,
                    MessageEn = messageEn,
                    InApp = true,
                    Push = true,
                    Email = true,
                    Sms = true
                };

                await _notificationService.SendAsync(notificationRequest);

                // Mark reminder as sent
                appointment.ReminderSent = true;
                _appointmentRepository.Update(appointment);
                
                processedCount++;

                _logger.LogDebug("Reminder sent for appointment {AppointmentId} to user {UserId}",
                    appointment.Id, application.ApplicantId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send reminder for appointment {AppointmentId}. Continuing with next.",
                    appointment.Id);
                failedCount++;
            }
        }

        // Save all changes
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Completed appointment reminders job. Sent {SentCount} reminders, {FailedCount} failed out of {TotalCount}",
            processedCount, failedCount, appointments.Count);
    }

    private string GetBranchName(Guid? branchId)
    {
        // In a real implementation, this would fetch from a Branches table or SystemSettings
        // For now, return a generic name
        return branchId.HasValue ? "فرعTest Branch" : "المركز";
    }
}