using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Mojaz.Application.DTOs.Training;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Application.Services
{
    public class TrainingService : ITrainingService
    {
        private readonly ITrainingRepository _trainingRepository;
        private readonly IRepository<Domain.Entities.Application> _applicationRepository;
        private readonly IRepository<LicenseCategory> _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IAuditService _auditService;
        private readonly INotificationService _notificationService;
        private readonly ISystemSettingsService _settingsService;

        public TrainingService(
            ITrainingRepository trainingRepository,
            IRepository<Domain.Entities.Application> applicationRepository,
            IRepository<LicenseCategory> categoryRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IAuditService auditService,
            INotificationService notificationService,
            ISystemSettingsService settingsService)
        {
            _trainingRepository = trainingRepository;
            _applicationRepository = applicationRepository;
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _auditService = auditService;
            _notificationService = notificationService;
            _settingsService = settingsService;
        }

        public async Task<ApiResponse<TrainingRecordDto>> CreateAsync(CreateTrainingRecordRequest request)
        {
            var application = await _applicationRepository.GetByIdAsync(request.ApplicationId);
            if (application == null) return ApiResponse<TrainingRecordDto>.Fail(404, "Application not found.");

            if (await _trainingRepository.ExistsAsync(x => x.ApplicationId == request.ApplicationId))
                return ApiResponse<TrainingRecordDto>.Fail(400, "Training record already exists for this application.");

            var category = await _categoryRepository.GetByIdAsync(application.LicenseCategoryId);
            var categoryCode = category?.Code.ToString() ?? "B";
            var requiredHoursStr = await _settingsService.GetAsync($"MIN_TRAINING_HOURS_CATEGORY_{categoryCode}");
            int requiredHours = int.TryParse(requiredHoursStr, out var h) ? h : 20;

            var trainingRecord = new TrainingRecord
            {
                ApplicationId = request.ApplicationId,
                SchoolName = request.SchoolName,
                CertificateNumber = request.CertificateNumber,
                CompletedHours = request.HoursCompleted,
                TotalHoursRequired = requiredHours,
                TrainingStatus = request.HoursCompleted >= requiredHours ? TrainingStatus.Completed : TrainingStatus.InProgress,
                TrainingDate = request.TrainingDate,
                TrainerName = request.TrainerName,
                CenterName = request.CenterName,
                CompletedAt = request.HoursCompleted >= requiredHours ? DateTime.UtcNow : null
            };

            await _trainingRepository.AddAsync(trainingRecord);
            await _unitOfWork.SaveChangesAsync();

            await _auditService.LogAsync("CREATE_TRAINING_RECORD", "TrainingRecord", trainingRecord.Id.ToString(), null, $"Hours: {request.HoursCompleted}/{requiredHours}");

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(trainingRecord), "Training record created successfully.");
        }

        public async Task<ApiResponse<TrainingRecordDto>> GetByApplicationIdAsync(Guid applicationId, Guid? currentUserId = null, string? currentUserRole = null)
        {
            var trainingRecord = await _trainingRepository.GetByApplicationIdAsync(applicationId);
            if (trainingRecord == null) return ApiResponse<TrainingRecordDto>.Fail(404, "Training record not found.");

            // Ownership check for Applicants
            if (currentUserRole == "Applicant" && currentUserId.HasValue)
            {
                var application = await _applicationRepository.GetByIdAsync(applicationId);
                if (application == null) return ApiResponse<TrainingRecordDto>.Fail(404, "Application not found.");
                
                // Applicants can only see their own training records
                if (application.ApplicantId != currentUserId.Value)
                {
                    return ApiResponse<TrainingRecordDto>.Fail(403, "You do not have permission to view this training record.");
                }
            }

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(trainingRecord));
        }

        public async Task<ApiResponse<TrainingRecordDto>> UpdateHoursAsync(Guid id, UpdateTrainingHoursRequest request)
        {
            var trainingRecord = await _trainingRepository.GetByIdAsync(id);
            if (trainingRecord == null) return ApiResponse<TrainingRecordDto>.Fail(404, "Training record not found.");

            if (trainingRecord.IsExempted)
                return ApiResponse<TrainingRecordDto>.Fail(400, "Cannot update hours for an exempted training.");

            var oldHours = trainingRecord.CompletedHours;
            trainingRecord.CompletedHours += request.HoursToAdd;
            
            if (trainingRecord.CompletedHours >= trainingRecord.TotalHoursRequired)
            {
                trainingRecord.TrainingStatus = TrainingStatus.Completed;
                trainingRecord.CompletedAt = DateTime.UtcNow;

                // Advance Application Stage
                var application = await _applicationRepository.GetByIdAsync(trainingRecord.ApplicationId);
                if (application != null && application.CurrentStage == ApplicationStages.Training)
                {
                    application.CurrentStage = ApplicationStages.Theory;
                    _applicationRepository.Update(application);
                }
            }
            else
            {
                trainingRecord.TrainingStatus = TrainingStatus.InProgress;
                trainingRecord.CompletedAt = null;
            }

            _trainingRepository.Update(trainingRecord);
            await _unitOfWork.SaveChangesAsync();

            await _auditService.LogAsync("UPDATE_TRAINING_HOURS", "TrainingRecord", id.ToString(), oldHours.ToString(), trainingRecord.CompletedHours.ToString());

            if (trainingRecord.TrainingStatus == TrainingStatus.Completed)
            {
                var application = await _applicationRepository.GetByIdAsync(trainingRecord.ApplicationId);
                await _notificationService.SendAsync(new NotificationRequest
                {
                    UserId = application?.ApplicantId ?? Guid.Empty,
                    ApplicationId = trainingRecord.ApplicationId,
                    EventType = NotificationEventType.StatusChanged,
                    TitleAr = "اكتمل التدريب",
                    TitleEn = "Training Completed",
                    MessageAr = "لقد أكملت ساعات التدريب المطلوبة بنجاح. يمكنك الآن الانتقال للاختبار النظري.",
                    MessageEn = "You have successfully completed the required training hours. You can now proceed to the theory test.",
                    InApp = true
                });
            }

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(trainingRecord), "Training hours updated.");
        }

        public async Task<ApiResponse<TrainingRecordDto>> CreateExemptionAsync(CreateExemptionRequest request)
        {
            var application = await _applicationRepository.GetByIdAsync(request.ApplicationId);
            if (application == null) return ApiResponse<TrainingRecordDto>.Fail(404, "Application not found.");

            var existing = await _trainingRepository.GetByApplicationIdAsync(request.ApplicationId);
            if (existing != null && existing.TrainingStatus == TrainingStatus.Completed)
                return ApiResponse<TrainingRecordDto>.Fail(400, "Training is already completed. Exemption not needed.");

            var category = await _categoryRepository.GetByIdAsync(application.LicenseCategoryId);
            var categoryCode = category?.Code.ToString() ?? "B";
            var requiredHoursStr = await _settingsService.GetAsync($"MIN_TRAINING_HOURS_CATEGORY_{categoryCode}");
            int requiredHours = int.TryParse(requiredHoursStr, out var h) ? h : 20;

            if (existing == null)
            {
                existing = new TrainingRecord
                {
                    ApplicationId = request.ApplicationId,
                    TotalHoursRequired = requiredHours,
                    TrainingStatus = TrainingStatus.ExemptionPending
                };
                await _trainingRepository.AddAsync(existing);
            }

            existing.TrainingStatus = TrainingStatus.ExemptionPending;
            existing.IsExempted = false;
            existing.ExemptionReason = request.ExemptionReason;
            existing.ExemptionDocumentId = request.ExemptionDocumentId;
            existing.ExemptionApprovedBy = null;
            existing.ExemptionApprovedAt = null;

            _trainingRepository.Update(existing);
            await _unitOfWork.SaveChangesAsync();

            await _auditService.LogAsync("REQUEST_EXEMPTION", "TrainingRecord", existing.Id.ToString(), null, request.ExemptionReason);

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(existing), "Exemption request submitted.");
        }

        public async Task<ApiResponse<TrainingRecordDto>> ApproveExemptionAsync(Guid id, ExemptionActionRequest request)
        {
            var trainingRecord = await _trainingRepository.GetByIdAsync(id);
            if (trainingRecord == null) return ApiResponse<TrainingRecordDto>.Fail(404, "Training record not found.");

            if (trainingRecord.TrainingStatus != TrainingStatus.ExemptionPending)
                return ApiResponse<TrainingRecordDto>.Fail(400, "Training is not in exemption pending state.");

            trainingRecord.IsExempted = true;
            trainingRecord.TrainingStatus = TrainingStatus.Completed;
            trainingRecord.ExemptionApprovedAt = DateTime.UtcNow;
            trainingRecord.ExemptionApprovedBy = request.ActionBy;
            trainingRecord.CompletedAt = DateTime.UtcNow;
            trainingRecord.CompletedHours = trainingRecord.TotalHoursRequired;

            // Advance Application Stage
            var application = await _applicationRepository.GetByIdAsync(trainingRecord.ApplicationId);
            if (application != null && application.CurrentStage == ApplicationStages.Training)
            {
                application.CurrentStage = ApplicationStages.Theory;
                _applicationRepository.Update(application);
            }

            _trainingRepository.Update(trainingRecord);
            await _unitOfWork.SaveChangesAsync();

            await _auditService.LogAsync("APPROVE_EXEMPTION", "TrainingRecord", id.ToString(), null, request.Notes);

            if (application != null)
            {
                await _notificationService.SendAsync(new NotificationRequest
                {
                    UserId = application.ApplicantId,
                    ApplicationId = application.Id,
                    EventType = NotificationEventType.StatusChanged,
                    TitleAr = "تمت الموافقة على الإعفاء",
                    TitleEn = "Exemption Approved",
                    MessageAr = "تمت الموافقة على طلب الإعفاء من التدريب. يمكنك الآن الانتقال للاختبار النظري.",
                    MessageEn = "Your training exemption request has been approved. You can now proceed to the theory test.",
                    InApp = true,
                    Push = true
                });
            }

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(trainingRecord), "Exemption approved.");
        }

        public async Task<ApiResponse<TrainingRecordDto>> RejectExemptionAsync(Guid id, ExemptionActionRequest request)
        {
            var trainingRecord = await _trainingRepository.GetByIdAsync(id);
            if (trainingRecord == null) return ApiResponse<TrainingRecordDto>.Fail(404, "Training record not found.");

            if (trainingRecord.TrainingStatus != TrainingStatus.ExemptionPending)
                return ApiResponse<TrainingRecordDto>.Fail(400, "Training is not in exemption pending state.");

            trainingRecord.IsExempted = false;
            trainingRecord.TrainingStatus = TrainingStatus.InProgress;
            trainingRecord.ExemptionRejectionReason = request.Notes;

            _trainingRepository.Update(trainingRecord);
            await _unitOfWork.SaveChangesAsync();

            await _auditService.LogAsync("REJECT_EXEMPTION", "TrainingRecord", id.ToString(), null, request.Notes);

            var application = await _applicationRepository.GetByIdAsync(trainingRecord.ApplicationId);
            if (application != null)
            {
                await _notificationService.SendAsync(new NotificationRequest
                {
                    UserId = application.ApplicantId,
                    ApplicationId = application.Id,
                    EventType = NotificationEventType.StatusChanged,
                    TitleAr = "تم رفض طلب الإعفاء",
                    TitleEn = "Exemption Rejected",
                    MessageAr = $"تم رفض طلب الإعفاء من التدريب. السبب: {request.Notes}",
                    MessageEn = $"Your training exemption request has been rejected. Reason: {request.Notes}",
                    InApp = true,
                    Push = true
                });
            }

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(trainingRecord), "Exemption rejected.");
        }

        public async Task<ApiResponse<bool>> IsTrainingCompleteAsync(Guid applicationId)
        {
            var trainingRecord = await _trainingRepository.GetByApplicationIdAsync(applicationId);
            if (trainingRecord == null) return ApiResponse<bool>.Ok(false);

            return ApiResponse<bool>.Ok(trainingRecord.TrainingStatus == TrainingStatus.Completed || trainingRecord.IsExempted);
        }
    }
}
