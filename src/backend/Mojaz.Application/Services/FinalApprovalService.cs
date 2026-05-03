using AutoMapper;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Application.Services;

public class FinalApprovalService : IFinalApprovalService
{
    private readonly IRepository<Mojaz.Domain.Entities.Application> _applicationRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<PaymentTransaction> _paymentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuditService _auditService;
    private readonly INotificationService _notificationService;
    private readonly IGate4ValidationService _gate4ValidationService;
    private readonly IFeeStructureRepository _feeStructureRepository;
    private readonly ILogger<FinalApprovalService> _logger;

    private const string StageDocuments = "02-Documents";

    public FinalApprovalService(
        IRepository<Mojaz.Domain.Entities.Application> applicationRepository,
        IRepository<User> userRepository,
        IRepository<PaymentTransaction> paymentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAuditService auditService,
        INotificationService notificationService,
        IGate4ValidationService gate4ValidationService,
        IFeeStructureRepository feeStructureRepository,
        ILogger<FinalApprovalService> logger)
    {
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _paymentRepository = paymentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _auditService = auditService;
        _notificationService = notificationService;
        _gate4ValidationService = gate4ValidationService;
        _feeStructureRepository = feeStructureRepository;
        _logger = logger;
    }

    public async Task<ApiResponse<Gate4ValidationResultDto>> GetGate4StatusAsync(int applicationId, int managerId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
        {
            return ApiResponse<Gate4ValidationResultDto>.NotFound("الطلب غير موجود.");
        }

        var result = await _gate4ValidationService.ValidateAsync(applicationId);
        
        var dto = new Gate4ValidationResultDto
        {
            ApplicationId = applicationId,
            IsFullyPassed = result.IsFullyPassed,
            Conditions = result.Conditions.Select(c => new Gate4ConditionDto
            {
                Key = c.Key,
                LabelAr = c.LabelAr,
                LabelEn = c.LabelEn,
                IsPassed = c.IsPassed,
                FailureMessageAr = c.FailureMessageAr,
                FailureMessageEn = c.FailureMessageEn
            }).ToList()
        };

        return ApiResponse<Gate4ValidationResultDto>.Ok(dto, "تم استرجاع حالة التحقق من البوابة الرابعة.");
    }

    public async Task<ApiResponse<ApplicationDecisionDto>> FinalizeAsync(int applicationId, FinalizeApplicationRequest request, int managerId)
    {
        // 1. Load Application — 404 if not found
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
        {
            return ApiResponse<ApplicationDecisionDto>.NotFound("الطلب غير موجود.");
        }

        // 2. Guard: Application.CurrentStage must be FinalApproval stage
        if (application.CurrentStage != ApplicationStages.Stage08FinalApproval)
        {
            return ApiResponse<ApplicationDecisionDto>.Fail(400, "الطلب ليس في مرحلة الاعتماد النهائي.");
        }

        // 3. Guard: Application.FinalDecision must be null (not already finalized)
        if (application.FinalDecision != null)
        {
            return ApiResponse<ApplicationDecisionDto>.Fail(409, "تم اعتماد هذا الطلب نهائياً بالفعل.");
        }

        // 4. Run Gate4ValidationService if decision is Approve
        var gate4Result = await _gate4ValidationService.ValidateAsync(applicationId);
        
        // 5. IF decision == Approve AND !gate4Result.IsFullyPassed -> block
        if (request.Decision == FinalDecisionType.Approved && !gate4Result.IsFullyPassed)
        {
            var failingConditions = gate4Result.Conditions
                .Where(c => !c.IsPassed)
                .Select(c => $"{c.LabelAr}: {c.FailureMessageAr}")
                .ToList();
            
            return ApiResponse<ApplicationDecisionDto>.Fail(400, "فشل التحقق من البوابة الرابعة. لا يمكن اعتماد الطلب.", failingConditions);
        }

        // 6. Record decision on Application entity
        application.FinalDecision = request.Decision;
        application.FinalDecisionBy = managerId;
        application.FinalDecisionAt = DateTime.UtcNow;
        application.FinalDecisionReason = request.Reason;
        application.ReturnToStage = request.ReturnToStage;
        application.ManagerNotes = request.ManagerNotes;

        // 7. Transition Application.Status and CurrentStage based on decision
        ApplicationStatus newStatus;
        string newStage;
        
        switch (request.Decision)
        {
            case FinalDecisionType.Approved:
                newStatus = ApplicationStatus.Approved;
                newStage = ApplicationStages.Stage09IssuancePayment;
                
                // Create payment for issuance fee
                try
                {
                    var issuanceFee = await _feeStructureRepository.GetActiveFeeAsync(FeeType.IssuanceFee, application.LicenseCategoryId);
                    if (issuanceFee != null && issuanceFee.Amount > 0)
                    {
                        var issuancePayment = new PaymentTransaction
                        {
                            ApplicationId = applicationId,
                            FeeType = FeeType.IssuanceFee,
                            Amount = issuanceFee.Amount,
                            Status = PaymentStatus.Pending,
                            PaymentMethod = "System",
                            TransactionReference = $"TXN_{Guid.NewGuid()}"
                        };
                        await _paymentRepository.AddAsync(issuancePayment);
                        _logger.LogInformation("Created issuance payment for application {ApplicationId}, amount: {Amount}", 
                            applicationId, issuanceFee.Amount);
                    }
                    else
                    {
                        _logger.LogWarning("No active issuance fee found for application {ApplicationId}, category: {CategoryId}", 
                            applicationId, application.LicenseCategoryId);
                    }
                }
                catch (Exception ex)
                {
                    // Don't block final approval if payment creation fails
                    _logger.LogError(ex, "Failed to create issuance payment for application {ApplicationId}", applicationId);
                }
                break;
            case FinalDecisionType.Rejected:
                newStatus = ApplicationStatus.Rejected;
                newStage = application.CurrentStage;
                break;
            case FinalDecisionType.Returned:
                newStatus = ApplicationStatus.InReview;
                newStage = request.ReturnToStage ?? StageDocuments;
                break;
            default:
                newStatus = ApplicationStatus.InReview;
                newStage = application.CurrentStage;
                break;
        }

        var previousStatus = application.Status;
        application.Status = newStatus;
        application.CurrentStage = newStage;

        // 8. Add ApplicationStatusHistory record
        var statusHistory = new ApplicationStatusHistory
        {
            ApplicationId = applicationId,
            FromStatus = previousStatus,
            ToStatus = newStatus,
            ChangedBy = managerId,
            ChangedAt = DateTime.UtcNow,
            Notes = $"القرار النهائي: {request.Decision}"
        };
        await _unitOfWork.Repository<ApplicationStatusHistory>().AddAsync(statusHistory);

        // 9. Update application
        _applicationRepository.Update(application);

        // 10. SaveChangesAsync
        await _unitOfWork.SaveChangesAsync();

        // 10.1 Handle Category Upgrade Record
        if (request.Decision == FinalDecisionType.Approved && application.ServiceType == ServiceType.CategoryUpgrade)
        {
            var licenseRepo = _unitOfWork.Repository<License>();
            var activeLicense = (await licenseRepo.FindAsync(x => x.HolderId == application.ApplicantId && x.Status == LicenseStatus.Active)).FirstOrDefault();
            
            if (activeLicense != null)
            {
                var toCategoryEntity = await _unitOfWork.Repository<LicenseCategory>().GetByIdAsync(application.LicenseCategoryId ?? 0);
                var fromCategoryEntity = await _unitOfWork.Repository<LicenseCategory>().GetByIdAsync(activeLicense.LicenseCategoryId);

                if (toCategoryEntity != null && fromCategoryEntity != null)
                {
                    var upgrade = new CategoryUpgrade
                    {
                        ApplicationId = application.Id,
                        LicenseId = activeLicense.Id,
                        FromCategory = fromCategoryEntity.Code,
                        ToCategory = toCategoryEntity.Code,
                        UpgradedAt = DateTime.UtcNow,
                        ProcessedBy = managerId
                    };
                    await _unitOfWork.Repository<CategoryUpgrade>().AddAsync(upgrade);
                    await _unitOfWork.SaveChangesAsync();
                }
            }
        }

        // 11. AuditLog: "FINAL_APPROVAL_{DECISION}"
        await _auditService.LogAsync(
            "FINAL_APPROVAL_" + request.Decision.ToString().ToUpper(),
            "Application",
            applicationId.ToString());

        // 12. In-app notification (synchronous)
        var manager = await _userRepository.GetByIdAsync(managerId);
        var managerName = manager?.FullNameAr ?? "المدير";
        
        NotificationEventType eventType;
        string titleAr, titleEn, messageAr, messageEn;

        switch (request.Decision)
        {
            case FinalDecisionType.Approved:
                eventType = NotificationEventType.FinalApprovalApproved;
                titleAr = "تمت الموافقة على طلبك";
                titleEn = "Your application has been approved";
                messageAr = $"لقد ت��ت ا��موافقة على طلبك رقم {application.ApplicationNumber} ويمكنك الآن سداد رسوم الإصدار.";
                messageEn = $"Application {application.ApplicationNumber} has been approved. You can now proceed with issuance payment.";
                break;
            case FinalDecisionType.Rejected:
                eventType = NotificationEventType.FinalApprovalRejected;
                titleAr = "تم رفض طلبك";
                titleEn = "Your application has been rejected";
                messageAr = $"تم رفض طلبك رقم {application.ApplicationNumber}. السبب: {request.Reason}";
                messageEn = $"Application {application.ApplicationNumber} has been rejected. Reason: {request.Reason}";
                break;
            case FinalDecisionType.Returned:
                eventType = NotificationEventType.FinalApprovalReturned;
                titleAr = "تم إعادة طلبك للمراجعة";
                titleEn = "Your application has been returned";
                messageAr = $"تم إعادة طلبك رقم {application.ApplicationNumber} للمرحلة {request.ReturnToStage}. السبب: {request.Reason}";
                messageEn = $"Application {application.ApplicationNumber} has been returned to {request.ReturnToStage}. Reason: {request.Reason}";
                break;
            default:
                eventType = NotificationEventType.StatusChanged;
                titleAr = "تغيير حالة الطلب";
                titleEn = "Application status changed";
                messageAr = $"تم تحديث حالة طلبك رقم {application.ApplicationNumber}.";
                messageEn = $"Application {application.ApplicationNumber} status has been updated.";
                break;
        }

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = application.ApplicantId,
            ApplicationId = applicationId,
            EventType = eventType,
            TitleAr = titleAr,
            TitleEn = titleEn,
            MessageAr = messageAr,
            MessageEn = messageEn,
            InApp = true,
            Email = false,
            Push = false,
            Sms = false
        });

        // Build response DTO
        var responseDto = new ApplicationDecisionDto
        {
            ApplicationId = applicationId,
            ApplicationNumber = application.ApplicationNumber,
            NewStatus = newStatus,
            Decision = request.Decision,
            DecisionAt = DateTime.UtcNow,
            DecisionBy = managerName,
            Gate4Result = new Gate4ValidationResultDto
            {
                ApplicationId = applicationId,
                IsFullyPassed = gate4Result.IsFullyPassed,
                Conditions = gate4Result.Conditions.Select(c => new Gate4ConditionDto
                {
                    Key = c.Key,
                    LabelAr = c.LabelAr,
                    LabelEn = c.LabelEn,
                    IsPassed = c.IsPassed,
                    FailureMessageAr = c.FailureMessageAr,
                    FailureMessageEn = c.FailureMessageEn
                }).ToList()
            }
        };

        var successMessage = request.Decision switch
        {
            FinalDecisionType.Approved => "تم اعتماد الطلب بنجاح.",
            FinalDecisionType.Rejected => "تم رفض الطلب.",
            FinalDecisionType.Returned => "تم إعادة الطلب للتصحيح.",
            _ => "تم تسجيل القرار النهائي."
        };

        return ApiResponse<ApplicationDecisionDto>.Ok(responseDto, successMessage);
    }
}