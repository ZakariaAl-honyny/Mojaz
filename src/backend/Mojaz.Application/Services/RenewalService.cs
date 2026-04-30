using AutoMapper;
using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.Renewal;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using System;
using System.Linq;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class RenewalService : IRenewalService
{
    private readonly IRepository<License> _licenseRepository;
    private readonly IRepository<RenewalApplication> _renewalApplicationRepository;
    private readonly IRepository<LicenseCategory> _licenseCategoryRepository;
    private readonly IRepository<FeeStructure> _feeStructureRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<MedicalExamination> _medicalExaminationRepository;
    private readonly IRepository<PaymentTransaction> _paymentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILicensePdfGenerator _licensePdfGenerator;
    private readonly IFileStorageService _fileStorageService;
    private readonly INotificationService _notificationService;
    private readonly ISystemSettingsService _systemSettingsService;
    private readonly IMapper _mapper;
    private readonly ILogger<RenewalService> _logger;

    public RenewalService(
        IRepository<License> licenseRepository,
        IRepository<RenewalApplication> renewalApplicationRepository,
        IRepository<LicenseCategory> licenseCategoryRepository,
        IRepository<FeeStructure> feeStructureRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<User> userRepository,
        IRepository<MedicalExamination> medicalExaminationRepository,
        IRepository<PaymentTransaction> paymentRepository,
        IUnitOfWork unitOfWork,
        ILicensePdfGenerator licensePdfGenerator,
        IFileStorageService fileStorageService,
        INotificationService notificationService,
        ISystemSettingsService systemSettingsService,
        IMapper mapper,
        ILogger<RenewalService> logger)
    {
        _licenseRepository = licenseRepository;
        _renewalApplicationRepository = renewalApplicationRepository;
        _licenseCategoryRepository = licenseCategoryRepository;
        _feeStructureRepository = feeStructureRepository;
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _medicalExaminationRepository = medicalExaminationRepository;
        _paymentRepository = paymentRepository;
        _unitOfWork = unitOfWork;
        _licensePdfGenerator = licensePdfGenerator;
        _fileStorageService = fileStorageService;
        _notificationService = notificationService;
        _systemSettingsService = systemSettingsService;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponse<EligibilityResponse>> ValidateEligibilityAsync(int applicantId, int licenseCategoryId)
    {
        try
        {
            // Find active or recently expired license for this applicant and category
            var licenses = await _licenseRepository.FindAsync(l =>
                l.HolderId == applicantId &&
                l.LicenseCategoryId == licenseCategoryId &&
                !l.IsDeleted);

            var license = licenses.FirstOrDefault(l => 
                l.Status == LicenseStatus.Active || 
                l.Status == LicenseStatus.Expired);

            if (license == null)
            {
                return ApiResponse<EligibilityResponse>.Fail(400, "لم يتم العثور على رخصة مؤهلة لهذه الفئة.");
            }

            // Check grace period
            var gracePeriodDaysStr = await _systemSettingsService.GetAsync("RENEWAL_GRACE_PERIOD_DAYS");
            var gracePeriodDays = string.IsNullOrEmpty(gracePeriodDaysStr) ? 90 : int.Parse(gracePeriodDaysStr);
            var gracePeriodEnd = license.ExpiresAt.AddDays(gracePeriodDays);
            var now = DateTime.UtcNow;

            // Check if within grace period (either before expiry or within grace period after expiry)
            bool isWithinGracePeriod = false;
            if (license.Status == LicenseStatus.Active && license.ExpiresAt > now)
            {
                // Can renew up to expiry date
                isWithinGracePeriod = true;
            }
            else if (license.Status == LicenseStatus.Expired && gracePeriodEnd > now)
            {
                // Can renew within grace period after expiry
                isWithinGracePeriod = true;
            }

            if (!isWithinGracePeriod)
            {
                return ApiResponse<EligibilityResponse>.Fail(400, "الرخصة خارج فترة السماح للتجديد.");
            }

            // Check for security/judicial block
            var holder = await _userRepository.GetByIdAsync(applicantId);
            if (holder != null && holder.IsSecurityBlocked)
            {
                return ApiResponse<EligibilityResponse>.Fail(403, "يوجد حظر أمني على ملف مقدم الطلب.");
            }

            // Get renewal fee by FeeType.RenewalFee and category ID
            var feeStructures = await _feeStructureRepository.FindAsync(f =>
                f.IsActive && f.FeeType == FeeType.RenewalFee && f.LicenseCategoryId == licenseCategoryId);

            var renewalFee = feeStructures.FirstOrDefault()?.Amount ?? 0;

            // Get category info
            var categoryInfo = await _licenseCategoryRepository.GetByIdAsync(licenseCategoryId);

            var response = new EligibilityResponse
            {
                IsEligible = true,
                LicenseId = license.Id,
                LicenseNumber = license.LicenseNumber,
                LicenseCategoryCode = categoryInfo?.Code.ToString(),
                LicenseCategoryName = categoryInfo?.NameAr,
                CurrentLicenseExpiresAt = license.ExpiresAt,
                GracePeriodEndsAt = license.Status == LicenseStatus.Active ? license.ExpiresAt : gracePeriodEnd,
                RenewalFeeAmount = renewalFee
            };

            return ApiResponse<EligibilityResponse>.Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating eligibility for renewal");
            return ApiResponse<EligibilityResponse>.Fail(500, "حدث خطأ أثناء التحقق من الأهلية.");
        }
    }

    public async Task<ApiResponse<int>> CreateRenewalAsync(CreateRenewalRequest request)
    {
        try
        {
            // Validate old license exists and belongs to applicant
            var oldLicense = await _licenseRepository.GetByIdAsync(request.OldLicenseId);
            if (oldLicense == null)
            {
                return ApiResponse<int>.NotFound("الرخصة القديمة غير موجودة.");
            }

            // Validate category
            var category = await _licenseCategoryRepository.GetByIdAsync(request.LicenseCategoryId);
            if (category == null)
            {
                return ApiResponse<int>.NotFound("فئة الرخصة غير موجودة.");
            }

            // Check for existing pending renewal application (using Draft as initial status)
            var existingRenewal = await _renewalApplicationRepository.FindAsync(r =>
                r.OldLicenseId == request.OldLicenseId &&
                r.Status == ApplicationStatus.Draft &&
                !r.IsDeleted);

            if (existingRenewal.Any())
            {
                return ApiResponse<int>.Fail(409, "يوجد طلب تجديد لهذا الطلب بالفعل.");
            }

            // Create renewal application
            // Renewal workflow skips: Stage 05 (Training), Stage 06 (Theory), Stage 07 (Practical)
            var renewalApplication = new RenewalApplication
            {
                ApplicantId = oldLicense.HolderId,
                OldLicenseId = request.OldLicenseId,
                LicenseCategoryId = request.LicenseCategoryId,
                Status = ApplicationStatus.Draft,
                ServiceType = ServiceType.Renewal,
                
                // Mark stages as exempt for simplified renewal workflow
                TrainingExempt = true,
                TheoryExempt = true,
                PracticalExempt = true
            };

            await _renewalApplicationRepository.AddAsync(renewalApplication);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Renewal application created: {ApplicationId}", renewalApplication.Id);

            return ApiResponse<int>.Ok(renewalApplication.Id, "تم إنشاء طلب التجديد بنجاح.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating renewal application");
            return ApiResponse<int>.Fail(500, "حدث خطأ أثناء إنشاء طلب التجديد.");
        }
    }

    public async Task<ApiResponse<bool>> ProcessMedicalResultAsync(int applicationId, int medicalExaminationId)
    {
        try
        {
            var renewalApplication = await _renewalApplicationRepository.GetByIdAsync(applicationId);
            if (renewalApplication == null)
            {
                return ApiResponse<bool>.NotFound("طلب التجديد غير موجود.");
            }

            var medicalExam = await _medicalExaminationRepository.GetByIdAsync(medicalExaminationId);
            if (medicalExam == null)
            {
                return ApiResponse<bool>.NotFound("الفحص الطبي غير موجود.");
            }

            // Validate medical exam is fit
            if (medicalExam.FitnessResult != MedicalFitnessResult.Fit)
            {
                return ApiResponse<bool>.Fail(400, "يجب أن يظهر الفحص الطبي اللياقة البدنية للتجديد.");
            }

            renewalApplication.MedicalExaminationId = medicalExaminationId;
            renewalApplication.Status = ApplicationStatus.InReview;
            _renewalApplicationRepository.Update(renewalApplication);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Medical result processed for renewal application: {ApplicationId}", applicationId);

            return ApiResponse<bool>.Ok(true, "تمت معالجة نتيجة الفحص الطبي بنجاح.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing medical result for renewal application: {ApplicationId}", applicationId);
            return ApiResponse<bool>.Fail(500, "حدث خطأ أثناء معالجة نتيجة الفحص الطبي.");
        }
    }

    public async Task<ApiResponse<bool>> PayRenewalFeeAsync(int applicationId, PaymentRequest paymentInfo)
    {
        try
        {
            var renewalApplication = await _renewalApplicationRepository.GetByIdAsync(applicationId);
            if (renewalApplication == null)
            {
                return ApiResponse<bool>.NotFound("طلب التجديد غير موجود.");
            }

            // Validate medical exam is completed
            if (!renewalApplication.MedicalExaminationId.HasValue)
            {
                return ApiResponse<bool>.Fail(400, "يجب إكمال الفحص الطبي قبل عملية الدفع.");
            }

            // Get the renewal fee from fee structures
            var feeStructures = await _feeStructureRepository.FindAsync(f =>
                f.IsActive && f.FeeType == FeeType.RenewalFee && f.LicenseCategoryId == renewalApplication.LicenseCategoryId);
            var renewalFee = feeStructures.FirstOrDefault()?.Amount ?? paymentInfo.Amount;

            var feeTypeEnum = FeeType.RenewalFee;

            // Create payment transaction
            var payment = new PaymentTransaction
            {
                ApplicationId = applicationId,
                FeeType = feeTypeEnum,
                Amount = paymentInfo.Amount,
                PaymentMethod = paymentInfo.PaymentMethod,
                TransactionReference = paymentInfo.TransactionId,
                Status = PaymentStatus.Paid,
                PaidAt = DateTime.UtcNow
            };

            await _paymentRepository.AddAsync(payment);
            renewalApplication.RenewalFeePaid = true;
            renewalApplication.Status = ApplicationStatus.Payment;
            _renewalApplicationRepository.Update(renewalApplication);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Renewal fee paid for application: {ApplicationId}", applicationId);

            return ApiResponse<bool>.Ok(true, "تم دفع رسوم التجديد بنجاح.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing renewal fee payment for application: {ApplicationId}", applicationId);
            return ApiResponse<bool>.Fail(500, "حدث خطأ أثناء معالجة عملية الدفع.");
        }
    }

    public async Task<ApiResponse<IssueLicenseResponse>> IssueLicenseAsync(int applicationId)
    {
        try
        {
            var renewalApplication = await _renewalApplicationRepository.GetByIdAsync(applicationId);
            if (renewalApplication == null)
            {
                return ApiResponse<IssueLicenseResponse>.NotFound("طلب التجديد غير موجود.");
            }

            // Validate all prerequisites
            if (!renewalApplication.MedicalExaminationId.HasValue)
            {
                return ApiResponse<IssueLicenseResponse>.Fail(400, "يجب إكمال الفحص الطبي.");
            }

            if (!renewalApplication.RenewalFeePaid)
            {
                return ApiResponse<IssueLicenseResponse>.Fail(400, "يجب دفع رسوم التجديد.");
            }

            // Get old license
            var oldLicense = await _licenseRepository.GetByIdAsync(renewalApplication.OldLicenseId);
            if (oldLicense == null)
            {
                return ApiResponse<IssueLicenseResponse>.NotFound("الرخصة القديمة غير موجودة.");
            }

            // Get category for validity
            var category = await _licenseCategoryRepository.GetByIdAsync(renewalApplication.LicenseCategoryId);
            if (category == null)
            {
                return ApiResponse<IssueLicenseResponse>.NotFound("فئة الرخصة غير موجودة.");
            }

            // Get holder
            var holder = await _userRepository.GetByIdAsync(renewalApplication.ApplicantId);
            if (holder == null)
            {
                return ApiResponse<IssueLicenseResponse>.NotFound("صاحب الرخصة غير موجود.");
            }

            // Generate new license
            var licenseNumber = GenerateLicenseNumber();
            var issuedAt = DateTime.UtcNow;
            var expiresAt = issuedAt.AddYears(category.ValidityYears > 0 ? category.ValidityYears : 10);

            var newLicense = new License
            {
                HolderId = renewalApplication.ApplicantId,
                ApplicationId = applicationId,
                LicenseCategoryId = renewalApplication.LicenseCategoryId,
                LicenseNumber = licenseNumber,
                IssuedAt = issuedAt,
                ExpiresAt = expiresAt,
                Status = LicenseStatus.Active
            };

            await _licenseRepository.AddAsync(newLicense);

            // Update old license status to Renewed
            oldLicense.Status = LicenseStatus.Renewed;
            _licenseRepository.Update(oldLicense);

            // Update renewal application
            renewalApplication.NewLicenseId = newLicense.Id;
            renewalApplication.Status = ApplicationStatus.Issued;
            _renewalApplicationRepository.Update(renewalApplication);

            await _unitOfWork.SaveChangesAsync();

            // Generate PDF
            var pdfBytes = await _licensePdfGenerator.GenerateLicensePdfAsync(newLicense, holder, category);
            var fileName = $"{licenseNumber}.pdf";
            
            using var stream = new MemoryStream(pdfBytes);
            var blobUrl = await _fileStorageService.SaveAsync(stream, fileName, "application/pdf");

            // Update license with blob URL
            newLicense.BlobUrl = blobUrl;
            _licenseRepository.Update(newLicense);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("New license issued: {LicenseId} for application: {ApplicationId}", newLicense.Id, applicationId);

            // Send notifications
            await SendLicenseIssuedNotificationAsync(holder.Id, newLicense, category);

            var response = new IssueLicenseResponse
            {
                NewLicenseId = newLicense.Id,
                LicenseNumber = newLicense.LicenseNumber,
                BlobUrl = blobUrl,
                IssuedAt = newLicense.IssuedAt,
                ExpiresAt = newLicense.ExpiresAt
            };

            return ApiResponse<IssueLicenseResponse>.Ok(response, "تم إصدار الرخصة بنجاح.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error issuing license for renewal application: {ApplicationId}", applicationId);
            return ApiResponse<IssueLicenseResponse>.Fail(500, "حدث خطأ أثناء إصدار الرخصة.");
        }
    }

    private static string GenerateLicenseNumber()
    {
        var year = DateTime.UtcNow.Year;
        var random = Random.Shared.Next(10000000, 99999999);
        return $"MOJ-{year}-{random:D8}";
    }

    private async Task SendLicenseIssuedNotificationAsync(int userId, License license, LicenseCategory category)
    {
        try
        {
            await _notificationService.SendAsync(new NotificationRequest
            {
                UserId = userId,
                EventType = NotificationEventType.LicenseIssued,
                TitleAr = "تم تجديد رخصتك بنجاح",
                TitleEn = "Your license has been renewed successfully",
                MessageAr = $"رقم الرخصة: {license.LicenseNumber}. تاريخ الانتهاء: {license.ExpiresAt:yyyy-MM-dd}",
                MessageEn = $"License Number: {license.LicenseNumber}. Expiry Date: {license.ExpiresAt:yyyy-MM-dd}"
            });
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to send license issued notification for user: {UserId}", userId);
        }
    }
}