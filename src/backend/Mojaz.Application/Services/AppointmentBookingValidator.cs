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
    private readonly IRepository<PaymentTransaction> _paymentRepository;
    private readonly ISystemSettingsService _systemSettingsService;
    private readonly ITrainingService _trainingService;
    private readonly ITheoryService _theoryService;
    private readonly IPracticalService _practicalService;

    public AppointmentBookingValidator(
        IAppointmentRepository appointmentRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<PaymentTransaction> paymentRepository,
        ISystemSettingsService systemSettingsService,
        ITrainingService trainingService,
        ITheoryService theoryService,
        IPracticalService practicalService)
    {
        _appointmentRepository = appointmentRepository;
        _applicationRepository = applicationRepository;
        _paymentRepository = paymentRepository;
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
            result.Errors.Add("الطلب غير موجود");
            return result;
        }

        // Gate 1: Check if Application status allows booking based on service type
        // Uses PRD Section 6 service-specific workflows
        
        // Call the method to get correct workflow by service type
        var statusMapping = GetStatusMappingByServiceType(application.ServiceType, request.Type);
        var allowedStatuses = statusMapping.GetValueOrDefault(request.Type, Array.Empty<ApplicationStatus>());
        
        if (!allowedStatuses.Contains(application.Status))
        {
            result.IsValid = false;
            var statusHint = GetStatusHintByServiceType(application.ServiceType, request.Type);
            result.Errors.Add(statusHint);
            return result;
        }
        
        // Gate 2: Check if Application Fee is paid before booking
        var hasApplicationFeePaid = await _paymentRepository.FindAsync(p => 
            p.ApplicationId == request.ApplicationId && 
            p.FeeType == FeeType.ApplicationFee && 
            p.Status == PaymentStatus.Paid);
        if (!hasApplicationFeePaid.Any())
        {
            result.IsValid = false;
            result.Errors.Add("يجب سداد رسوم الطلب أولاً قبل حجز الموعد.");
            return result;
        }

        // Gate 3: Check if no existing active appointment for same type
        var existingAppointment = await _appointmentRepository.GetByApplicationIdAsync(request.ApplicationId, request.Type, ct);
        if (existingAppointment != null)
        {
            if (existingAppointment.Status == AppointmentStatus.Scheduled)
            {
                result.IsValid = false;
                result.Errors.Add($"يوجد موعد {request.Type} نشط بالفعل. يرجى إعادة جدولة الموعد أو إلغاؤه أولاً.");
                return result;
            }
        }

        // Gate 4: Check date is not in the past
        if (request.ScheduledDate < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            result.IsValid = false;
            result.Errors.Add("لا يمكن حجز موعد في تاريخ سابق");
            return result;
        }

        // Gate 5: Check date is within booking window
        var minDaysAhead = await _systemSettingsService.GetIntAsync("MIN_BOOKING_DAYS_AHEAD") ?? 1;
        var maxDaysAhead = await _systemSettingsService.GetIntAsync("MAX_BOOKING_DAYS_AHEAD") ?? 30;
        
        var minDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(minDaysAhead));
        var maxDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(maxDaysAhead));
        
        if (request.ScheduledDate < minDate || request.ScheduledDate > maxDate)
        {
            result.IsValid = false;
            result.Errors.Add($"يجب حجز المواعيد بين {minDate} و {maxDate}");
            return result;
        }

        // Gate 6: Check slot capacity
        var maxCapacity = await _systemSettingsService.GetIntAsync("MAX_APPOINTMENTS_PER_SLOT") ?? 2;
        var bookedCount = await _appointmentRepository.GetBookedSlotCountAsync(request.BranchId, request.ScheduledDate, request.TimeSlot, ct);
        
        if (bookedCount >= maxCapacity)
        {
            result.IsValid = false;
            result.Errors.Add("هذه الفترة محجوزة بالكامل. يرجى اختيار فترة أخرى.");
            return result;
        }

        // Gate 7: Verify working hours
        var workingStart = await _systemSettingsService.GetAsync("WORKING_HOURS_START") ?? "08:00";
        var workingEnd = await _systemSettingsService.GetAsync("WORKING_HOURS_END") ?? "16:00";
        
        if (string.Compare(request.TimeSlot, workingStart) < 0 || string.Compare(request.TimeSlot, workingEnd) > 0)
        {
            result.IsValid = false;
            result.Errors.Add($"يجب أن تكون الفترة الزمنية ضمن ساعات العمل ({workingStart} - {workingEnd})");
            return result;
        }

        // Gate 8 (Training): Check if training is complete for Theory/Practical appointments
        if (request.Type == AppointmentType.TheoryTest || request.Type == AppointmentType.PracticalTest)
        {
            var trainingComplete = await _trainingService.IsTrainingCompleteAsync(request.ApplicationId);
            if (!trainingComplete.Data)
            {
                result.IsValid = false;
                result.Errors.Add("لم يتم استيفاء متطلبات التدريب. يجب أن تكون حالة التدريب 'مكتمل' أو 'معفى' قبل حجز الاختبارات.");
                return result;
            }
        }

        // Gate 9 (Theory Test Limits): Check cooling period and max attempts
        if (request.Type == AppointmentType.TheoryTest)
        {
            // Check max attempts
            if (await _theoryService.HasReachedMaxAttemptsAsync(request.ApplicationId))
            {
                result.IsValid = false;
                result.Errors.Add("تم الوصول إلى الحد الأقصى لمحاولات اختبار النظري. لا يمكنك حجز محاولات إضافية لهذا الطلب.");
                return result;
            }

            // Check cooling period
            if (await _theoryService.IsInCoolingPeriodAsync(request.ApplicationId))
            {
                result.IsValid = false;
                
                // Get history to find the eligible date for a better error message
                var history = await _theoryService.GetHistoryAsync(request.ApplicationId, 0, "Manager", 1, 1);
                var latestResult = history.Data?.Items.FirstOrDefault();
                var eligibleDate = latestResult?.RetakeEligibleAfter?.ToString("yyyy-MM-dd") ?? "the required cooling period has passed";

                result.Errors.Add($"أنت حالياً في فترة انتظار بعد محاولة غير ناجحة. ستتمكن من الحجز بعد {eligibleDate}.");
                return result;
            }
        }

        // Gate 10 (Practical Test Limits): Check cooling period and max attempts
        if (request.Type == AppointmentType.PracticalTest)
        {
            // Check max attempts
            if (await _practicalService.HasReachedMaxAttemptsAsync(request.ApplicationId))
            {
                result.IsValid = false;
                result.Errors.Add("تم الوصول إلى الحد الأقصى لمحاولات الاختبار العملي. لا يمكنك حجز محاولات إضافية لهذا الطلب.");
                return result;
            }

            // Check additional training
            if (await _practicalService.HasAdditionalTrainingRequiredAsync(request.ApplicationId))
            {
                result.IsValid = false;
                result.Errors.Add("مطلوب تدريب إضافي قبل حجز اختبار عملي آخر.");
                return result;
            }

            // Check cooling period
            if (await _practicalService.IsInCoolingPeriodAsync(request.ApplicationId))
            {
                result.IsValid = false;
                
                // Get history to find the eligible date for a better error message
                var history = await _practicalService.GetHistoryAsync(request.ApplicationId, 0, "Manager", 1, 1);
                var latestResult = history.Data?.Items.FirstOrDefault();
                var eligibleDate = latestResult?.RetakeEligibleAfter?.ToString("yyyy-MM-dd") ?? "the required cooling period has passed";

                result.Errors.Add($"أنت حالياً في فترة انتظار بعد محاولة غير ناجحة. ستتمكن من الحجز بعد {eligibleDate}.");
                return result;
            }
        }

        return result;
    }

    public async Task<AppointmentValidationResult> ValidateRescheduleAsync(int appointmentId, RescheduleAppointmentRequest request, CancellationToken ct = default)
    {
        var result = new AppointmentValidationResult { IsValid = true };

        // Get existing appointment
        var appointment = await _appointmentRepository.GetByIdForRescheduleAsync(appointmentId, ct);
        if (appointment == null)
        {
            result.IsValid = false;
            result.Errors.Add("الموعد غير موجود");
            return result;
        }

        // Check reschedule count limit
        var maxReschedule = await _systemSettingsService.GetIntAsync("MAX_RESCHEDULE_COUNT") ?? 3;
        if (appointment.RescheduleCount >= maxReschedule)
        {
            result.IsValid = false;
            result.Errors.Add($"تم الوصول إلى الحد الأقصى لعدد مرات إعادة الجدولة ({maxReschedule})");
            return result;
        }

        // Check appointment is not already cancelled or completed
        if (appointment.Status == AppointmentStatus.Cancelled || appointment.Status == AppointmentStatus.Completed)
        {
            result.IsValid = false;
            result.Errors.Add("لا يمكن إعادة جدولة موعد ملغي أو مكتمل");
            return result;
        }

        // Validate new date is not in the past
        if (request.NewScheduledDate < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            result.IsValid = false;
            result.Errors.Add("لا يمكن إعادة الجدولة إلى تاريخ سابق");
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
            result.Errors.Add($"يجب أن يكون تاريخ إعادة الجدولة بين {minDate} و {maxDate}");
            return result;
        }

        // Check slot capacity for new slot (if changing branch or time)
        var branchId = request.NewBranchId ?? appointment.BranchId ?? 0;
        var newTimeSlot = request.NewTimeSlot;
        
        if (branchId != 0 && !string.IsNullOrEmpty(newTimeSlot))
        {
            var maxCapacity = await _systemSettingsService.GetIntAsync("MAX_APPOINTMENTS_PER_SLOT") ?? 2;
            var bookedCount = await _appointmentRepository.GetBookedSlotCountAsync(branchId, request.NewScheduledDate, newTimeSlot, ct);
            
            // Allow if it's the same appointment (rescheduling to same slot)
            if (bookedCount >= maxCapacity)
            {
                result.IsValid = false;
                result.Errors.Add("الفترة الزمنية الجديدة محجوزة بالكامل. يرجى اختيار فترة أخرى.");
                return result;
            }
        }

        return result;
    }

    /// <summary>
    /// Get allowed application statuses by service type
    /// PRD Section 6: 8 Services Overview
    /// - 01 New License: Full workflow (Medical → Training → Theory → Practical → Approval)
    /// - 02 Renewal: Medical exam only (no training/tests)
    /// - 03 Replacement: Medical exam only (lost/damaged - no training/tests)
    /// - 04 Category Upgrade: Full workflow (same as new license)
    /// - 05 Test Retake: Uses existing application for retake appointments
    /// - 06-08: Not appointment-based services
    /// </summary>
    private Dictionary<AppointmentType, ApplicationStatus[]> GetStatusMappingByServiceType(ServiceType serviceType, AppointmentType appointmentType)
    {
        // New License: Full 10-stage workflow
        if (serviceType == ServiceType.NewLicense)
        {
            return new Dictionary<AppointmentType, ApplicationStatus[]>
            {
                { AppointmentType.MedicalExam, new[] { ApplicationStatus.Submitted, ApplicationStatus.DocumentReview, ApplicationStatus.InReview, ApplicationStatus.MedicalExam } },
                { AppointmentType.TheoryTest, new[] { ApplicationStatus.Training, ApplicationStatus.TheoryTest } },
                { AppointmentType.PracticalTest, new[] { ApplicationStatus.TheoryTest, ApplicationStatus.PracticalTest } }
            };
        }
        
        // Renewal: Only Medical Exam required (PRD Section 6)
        // "Renewal for expiring or recently expired licenses with requirement verification"
        if (serviceType == ServiceType.Renewal)
        {
            return new Dictionary<AppointmentType, ApplicationStatus[]>
            {
                { AppointmentType.MedicalExam, new[] { ApplicationStatus.Submitted, ApplicationStatus.DocumentReview, ApplicationStatus.InReview, ApplicationStatus.MedicalExam } }
            };
        }
        
        // Replacement: Only Medical Exam (lost/damaged)
        // Already has license so no training/tests needed
        if (serviceType == ServiceType.Replacement)
        {
            return new Dictionary<AppointmentType, ApplicationStatus[]>
            {
                { AppointmentType.MedicalExam, new[] { ApplicationStatus.Submitted, ApplicationStatus.DocumentReview, ApplicationStatus.InReview, ApplicationStatus.MedicalExam } }
            };
        }
        
        // Category Upgrade: Same as New License (full workflow)
        if (serviceType == ServiceType.CategoryUpgrade)
        {
            return new Dictionary<AppointmentType, ApplicationStatus[]>
            {
                { AppointmentType.MedicalExam, new[] { ApplicationStatus.Submitted, ApplicationStatus.DocumentReview, ApplicationStatus.InReview, ApplicationStatus.MedicalExam } },
                { AppointmentType.TheoryTest, new[] { ApplicationStatus.Training, ApplicationStatus.TheoryTest } },
                { AppointmentType.PracticalTest, new[] { ApplicationStatus.TheoryTest, ApplicationStatus.PracticalTest } }
            };
        }
        
        // International License (Phase 2 - deferred)
        if (serviceType == ServiceType.InternationalLicense)
        {
            return new Dictionary<AppointmentType, ApplicationStatus[]>
            {
                { AppointmentType.MedicalExam, new[] { ApplicationStatus.Submitted, ApplicationStatus.DocumentReview, ApplicationStatus.InReview, ApplicationStatus.MedicalExam } }
            };
        }
        
        // Status Change, Medical Extension, Temporary License (Phase 2 - minimal workflow)
        if (serviceType == ServiceType.StatusChange || 
            serviceType == ServiceType.MedicalExtension || 
            serviceType == ServiceType.TemporaryLicense)
        {
            return new Dictionary<AppointmentType, ApplicationStatus[]>
            {
                { AppointmentType.MedicalExam, new[] { ApplicationStatus.Submitted, ApplicationStatus.DocumentReview, ApplicationStatus.InReview, ApplicationStatus.MedicalExam } }
            };
        }
        
        // Default: New License workflow (fallback)
        return new Dictionary<AppointmentType, ApplicationStatus[]>
        {
            { AppointmentType.MedicalExam, new[] { ApplicationStatus.Submitted, ApplicationStatus.DocumentReview, ApplicationStatus.InReview, ApplicationStatus.MedicalExam } },
            { AppointmentType.TheoryTest, new[] { ApplicationStatus.Training, ApplicationStatus.TheoryTest } },
            { AppointmentType.PracticalTest, new[] { ApplicationStatus.TheoryTest, ApplicationStatus.PracticalTest } }
        };
    }

    /// <summary>
    /// Get status hint message by service type
    /// </summary>
    private string GetStatusHintByServiceType(ServiceType serviceType, AppointmentType appointmentType)
    {
        // Renewal: Simplified
        if (serviceType == ServiceType.Renewal)
        {
            return "خدمة التجديد لا تتطلب سوى فحص طبي.";
        }
        
        // Replacement: Simplified
        if (serviceType == ServiceType.Replacement)
        {
            return "خدمة بدل الفاقد/التالف لا تتطلب سوى فحص طبي.";
        }
        
        // Other services with simplified workflow
        if (serviceType == ServiceType.StatusChange || 
            serviceType == ServiceType.MedicalExtension || 
            serviceType == ServiceType.TemporaryLicense ||
            serviceType == ServiceType.InternationalLicense)
        {
            return "هذه الخدمة لا تتطلب سوى فحص طبي.";
        }
        
        return appointmentType switch
        {
            AppointmentType.MedicalExam => "يجب استكمال مرحلة المستندات وسداد الرسوم أولاً",
            AppointmentType.TheoryTest => "يجب استكمال الفحص الطبي والتدريب بنجاح",
            AppointmentType.PracticalTest => "يجب اجتياز الاختبار النظري بنجاح",
            _ => "يجب استكمال المراحل السابقة"
        };
    }
}