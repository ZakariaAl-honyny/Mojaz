using Mojaz.Application.DTOs.Medical;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using AutoMapper;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace Mojaz.Application.Services;

/// <summary>
/// Service for medical examination operations
/// </summary>
public class MedicalService : IMedicalService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ISystemSettingsService _systemSettingsService;
    private readonly IAuditService _auditService;
    private readonly INotificationService _notificationService;

    public MedicalService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ISystemSettingsService systemSettingsService,
        IAuditService auditService,
        INotificationService notificationService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _systemSettingsService = systemSettingsService;
        _auditService = auditService;
        _notificationService = notificationService;
    }

    /// <summary>
    /// Creates a medical examination result
    /// </summary>
    public async Task<ApiResponse<MedicalResultDto>> CreateMedicalResultAsync(
        CreateMedicalResultRequest request, 
        Guid doctorId)
    {
        // Verify application exists and belongs to applicant
        var application = await _unitOfWork.Repository<Mojaz.Domain.Entities.Application>().GetByIdAsync(request.ApplicationId);
        if (application == null)
        {
            return ApiResponse<MedicalResultDto>.NotFound("الطلب غير موجود.");
        }

        // Verify appointment exists
        var appointment = await _unitOfWork.Repository<Mojaz.Domain.Entities.Appointment>().GetByIdAsync(request.AppointmentId);
        if (appointment == null)
        {
            return ApiResponse<MedicalResultDto>.NotFound("الموعد غير موجود.");
        }

        // Check if medical examination already exists for this application
        var existingExam = await _unitOfWork.Repository<MedicalExamination>().FindAsync(x => x.ApplicationId == request.ApplicationId && !x.IsDeleted);
        if (existingExam != null && await _unitOfWork.Repository<MedicalExamination>().CountAsync(x => x.ApplicationId == request.ApplicationId && !x.IsDeleted) > 0)
        {
            return ApiResponse<MedicalResultDto>.Fail("يوجد فحص طبي لهذا الطلب بالفعل.", 409);
        }

        // Calculate validity period
        int validityDays = await _systemSettingsService.GetIntAsync("MEDICAL_VALIDITY_DAYS") ?? 90;
        DateTime validUntil = DateTime.UtcNow.AddDays(validityDays);

        // Create medical examination entity
        var medicalExam = new MedicalExamination
        {
            ApplicationId = request.ApplicationId,
            DoctorId = doctorId,
            ExaminedAt = DateTime.UtcNow,
            FitnessResult = request.Result,
            BloodType = request.BloodType,
            Notes = request.Notes,
            ValidUntil = validUntil
        };

        // Add to repository
        await _unitOfWork.Repository<MedicalExamination>().AddAsync(medicalExam);
        await _unitOfWork.SaveChangesAsync();

        // Auto-progress application based on medical result
        application = await _unitOfWork.Repository<Mojaz.Domain.Entities.Application>().GetByIdAsync(request.ApplicationId);
        if (application != null)
        {
            switch (request.Result)
            {
                case MedicalFitnessResult.Fit:
                case MedicalFitnessResult.ConditionallyFit:
                    // Auto-advance to Training stage
                    application.CurrentStage = ApplicationStages.Stage05Training;
                    _unitOfWork.Repository<Mojaz.Domain.Entities.Application>().Update(application);
                    await _unitOfWork.SaveChangesAsync();
                    break;

                case MedicalFitnessResult.Unfit:
                    // Stay at Medical stage, mark as rejected
                    application.Status = ApplicationStatus.Rejected;
                    _unitOfWork.Repository<Mojaz.Domain.Entities.Application>().Update(application);
                    await _unitOfWork.SaveChangesAsync();
                    break;
            }
        }

        // Map to DTO
        var resultDto = _mapper.Map<MedicalResultDto>(medicalExam);

        // Audit log for medical result submission
        await _auditService.LogAsync(
            "SUBMIT_MEDICAL_RESULT",
            "MedicalExamination",
            medicalExam.Id.ToString(),
            null,
            JsonSerializer.Serialize(new { request.Result, request.Notes, request.BloodType }));

        // Send notification to applicant
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = application.ApplicantId,
            ApplicationId = request.ApplicationId,
            EventType = NotificationEventType.MedicalExamResult,
            TitleAr = $"نتيجة الفحص الطبي - {request.Result}",
            TitleEn = $"Medical Exam Result - {request.Result}",
            MessageAr = $"رقم الطلب: {application.ApplicationNumber}. النتيجة: {request.Result}",
            MessageEn = $"Application No: {application.ApplicationNumber}. Result: {request.Result}",
            Email = false,
            Sms = false,
            Push = false,
            InApp = true
        });

        return ApiResponse<MedicalResultDto>.Created(resultDto, "تم تسجيل نتيجة الفحص الطبي بنجاح.");
    }

    /// <summary>
    /// Gets medical examination result by application ID
    /// </summary>
    public async Task<ApiResponse<MedicalResultDto>> GetByApplicationIdAsync(Guid applicationId)
    {
        var medicalExam = await _unitOfWork.Repository<MedicalExamination>()
            .FindAsync(x => x.ApplicationId == applicationId && !x.IsDeleted);

        if (medicalExam == null || medicalExam.Count == 0)
        {
            return ApiResponse<MedicalResultDto>.NotFound("لم يتم العثور على فحص طبي لهذا الطلب.");
        }

        var resultDto = _mapper.Map<MedicalResultDto>(medicalExam[0]);
        return ApiResponse<MedicalResultDto>.Ok(resultDto);
    }

    /// <summary>
    /// Updates the medical examination result
    /// </summary>
    public async Task<ApiResponse<MedicalResultDto>> UpdateResultAsync(
        Guid id, 
        MedicalFitnessResult result, 
        string? notes)
    {
        var medicalExam = await _unitOfWork.Repository<MedicalExamination>().GetByIdAsync(id);
        if (medicalExam == null)
        {
            return ApiResponse<MedicalResultDto>.NotFound("الفحص الطبي غير موجود.");
        }

        // Update fields
        medicalExam.FitnessResult = result;
        if (!string.IsNullOrWhiteSpace(notes))
        {
            medicalExam.Notes = notes;
        }
        medicalExam.UpdatedAt = DateTime.UtcNow;

        // Update in repository
        _unitOfWork.Repository<MedicalExamination>().Update(medicalExam);
        await _unitOfWork.SaveChangesAsync();

        // Map to DTO
        var resultDto = _mapper.Map<MedicalResultDto>(medicalExam);
        return ApiResponse<MedicalResultDto>.Ok(resultDto, "تم تحديث نتيجة الفحص الطبي بنجاح.");
    }
}