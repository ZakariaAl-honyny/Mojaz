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
        private readonly ICategoryUpgradeService _categoryUpgradeService;

        public TrainingService(
            ITrainingRepository trainingRepository,
            IRepository<Domain.Entities.Application> applicationRepository,
            IRepository<LicenseCategory> categoryRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IAuditService auditService,
            INotificationService notificationService,
            ISystemSettingsService settingsService,
            ICategoryUpgradeService categoryUpgradeService)
        {
            _trainingRepository = trainingRepository;
            _applicationRepository = applicationRepository;
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _auditService = auditService;
            _notificationService = notificationService;
            _settingsService = settingsService;
            _categoryUpgradeService = categoryUpgradeService;
        }

        public async Task<ApiResponse<TrainingRecordDto>> CreateAsync(CreateTrainingRecordRequest request)
        {
            var application = await _applicationRepository.GetByIdAsync(request.ApplicationId);
            if (application == null) return ApiResponse<TrainingRecordDto>.Fail(404, "الطلب غير موجود.");

            if (await _trainingRepository.ExistsAsync(x => x.ApplicationId == request.ApplicationId))
                return ApiResponse<TrainingRecordDto>.Fail(400, "يوجد سجل تدريبي لهذا الطلب بالفعل.");

            int requiredHours;
            if (application.ServiceType == ServiceType.CategoryUpgrade)
            {
                var licenseRepo = _unitOfWork.Repository<License>();
                var activeLicense = (await licenseRepo.FindAsync(x => x.HolderId == application.ApplicantId && x.Status == LicenseStatus.Active)).FirstOrDefault();
                
                if (activeLicense == null)
                    return ApiResponse<TrainingRecordDto>.Fail(400, "لا توجد رخصة نشطة لترقية الفئة.");

                var toCategoryEntity = await _categoryRepository.GetByIdAsync(application.LicenseCategoryId);
                var fromCategoryEntity = await _categoryRepository.GetByIdAsync(activeLicense.LicenseCategoryId);

                if (toCategoryEntity == null || fromCategoryEntity == null)
                    return ApiResponse<TrainingRecordDto>.Fail(400, "فئات الرخصة غير موجودة.");

                requiredHours = await _categoryUpgradeService.GetReducedTrainingHoursAsync(fromCategoryEntity.Code, toCategoryEntity.Code);
            }
            else
            {
                var category = await _categoryRepository.GetByIdAsync(application.LicenseCategoryId);
                var categoryCode = category?.Code.ToString() ?? "B";
                var requiredHoursStr = await _settingsService.GetAsync($"MIN_TRAINING_HOURS_CATEGORY_{categoryCode}");
                requiredHours = int.TryParse(requiredHoursStr, out var h) ? h : 20;
            }

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

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(trainingRecord), "تم إنشاء سجل التدريب بنجاح.");
        }

        public async Task<ApiResponse<TrainingRecordDto>> GetByApplicationIdAsync(Guid applicationId, Guid? currentUserId = null, string? currentUserRole = null)
        {
            var trainingRecord = await _trainingRepository.GetByApplicationIdAsync(applicationId);
            if (trainingRecord == null) return ApiResponse<TrainingRecordDto>.Fail(404, "سجل التدريب غير موجود.");

            // Ownership check for Applicants
            if (currentUserRole == "Applicant" && currentUserId.HasValue)
            {
                var application = await _applicationRepository.GetByIdAsync(applicationId);
                if (application == null) return ApiResponse<TrainingRecordDto>.Fail(404, "الطلب غير موجود.");
                
                // Applicants can only see their own training records
                if (application.ApplicantId != currentUserId.Value)
                {
                    return ApiResponse<TrainingRecordDto>.Fail(403, "ليس لديك صلاحية لعرض هذا السجل.");
                }
            }

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(trainingRecord));
        }

        public async Task<ApiResponse<PagedResult<TrainingRecordDto>>> GetAllAsync(Guid userId, string role, int page = 1, int pageSize = 20, string? search = null, string? status = null)
        {
            // Only allow managers/admins to see all training records
            if (role != "Manager" && role != "Admin" && role != "Receptionist")
            {
                return ApiResponse<PagedResult<TrainingRecordDto>>.Fail(403, "ليس لديك صلاحية لعرض جميع سجلات التدريب.");
            }

            var query = _trainingRepository.Query().Where(x => !x.IsDeleted);

            // Apply filters
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<TrainingStatus>(status, true, out var trainingStatus))
            {
                query = query.Where(x => x.TrainingStatus == trainingStatus);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x => 
                    x.SchoolName.Contains(search) || 
                    x.CertificateNumber.Contains(search) ||
                    x.CenterName.Contains(search) ||
                    x.TrainerName.Contains(search));
            }

            var totalCount = query.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            var items = query.OrderByDescending(x => x.CreatedAt)
                .AsEnumerable()
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var pagedResult = new PagedResult<TrainingRecordDto>
            {
                Items = _mapper.Map<List<TrainingRecordDto>>(items),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasPreviousPage = page > 1,
                HasNextPage = page < totalPages
            };

            return ApiResponse<PagedResult<TrainingRecordDto>>.Ok(pagedResult);
        }

        public async Task<ApiResponse<TrainingRecordDto>> UpdateHoursAsync(Guid id, UpdateTrainingHoursRequest request)
        {
            var trainingRecord = await _trainingRepository.GetByIdAsync(id);
            if (trainingRecord == null) return ApiResponse<TrainingRecordDto>.Fail(404, "سجل التدريب غير موجود.");

            if (trainingRecord.IsExempted)
                return ApiResponse<TrainingRecordDto>.Fail(400, "لا يمكن تحديث الساعات لتدريب تم الإعفاء منه.");

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

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(trainingRecord), "تم تحديث ساعات التدريب.");
        }

        public async Task<ApiResponse<TrainingRecordDto>> CreateExemptionAsync(CreateExemptionRequest request)
        {
            var application = await _applicationRepository.GetByIdAsync(request.ApplicationId);
            if (application == null) return ApiResponse<TrainingRecordDto>.Fail(404, "الطلب غير موجود.");

            var existing = await _trainingRepository.GetByApplicationIdAsync(request.ApplicationId);
            if (existing != null && existing.TrainingStatus == TrainingStatus.Completed)
                return ApiResponse<TrainingRecordDto>.Fail(400, "التدريب مكتمل بالفعل. لا حاجة للإعفاء.");

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

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(existing), "تم تقديم طلب الإعفاء.");
        }

        public async Task<ApiResponse<TrainingRecordDto>> ApproveExemptionAsync(Guid id, ExemptionActionRequest request)
        {
            var trainingRecord = await _trainingRepository.GetByIdAsync(id);
            if (trainingRecord == null) return ApiResponse<TrainingRecordDto>.Fail(404, "سجل التدريب غير موجود.");

            if (trainingRecord.TrainingStatus != TrainingStatus.ExemptionPending)
                return ApiResponse<TrainingRecordDto>.Fail(400, "التدريب ليس في حالة انتظار الإعفاء.");

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

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(trainingRecord), "تمت الموافقة على الإعفاء.");
        }

        public async Task<ApiResponse<TrainingRecordDto>> RejectExemptionAsync(Guid id, ExemptionActionRequest request)
        {
            var trainingRecord = await _trainingRepository.GetByIdAsync(id);
            if (trainingRecord == null) return ApiResponse<TrainingRecordDto>.Fail(404, "سجل التدريب غير موجود.");

            if (trainingRecord.TrainingStatus != TrainingStatus.ExemptionPending)
                return ApiResponse<TrainingRecordDto>.Fail(400, "التدريب ليس في حالة انتظار الإعفاء.");

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

            return ApiResponse<TrainingRecordDto>.Ok(_mapper.Map<TrainingRecordDto>(trainingRecord), "تم رفض الإعفاء.");
        }

        public async Task<ApiResponse<bool>> IsTrainingCompleteAsync(Guid applicationId)
        {
            var trainingRecord = await _trainingRepository.GetByApplicationIdAsync(applicationId);
            if (trainingRecord == null) return ApiResponse<bool>.Ok(false);

            return ApiResponse<bool>.Ok(trainingRecord.TrainingStatus == TrainingStatus.Completed || trainingRecord.IsExempted);
        }

        public async Task<ApiResponse<List<TrainingRecordDto>>> GetPendingExemptionsAsync()
        {
            // Pending exemptions: IsExempted true but ExemptionApprovedAt null
            var pendingExemptions = await _trainingRepository.FindAsync(x => 
                x.IsExempted && 
                x.ExemptionApprovedAt == null &&
                !x.IsDeleted);

            var dtos = _mapper.Map<List<TrainingRecordDto>>(pendingExemptions);
            return ApiResponse<List<TrainingRecordDto>>.Ok(dtos, $"تم العثور على {dtos.Count} طلبات إعفاء معلقة.");
        }
    }
}
