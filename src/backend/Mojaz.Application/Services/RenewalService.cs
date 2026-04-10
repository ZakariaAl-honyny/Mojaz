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

    public async Task<ApiResponse<EligibilityResponse>> ValidateEligibilityAsync(Guid applicantId, Guid licenseCategoryId)
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
                return ApiResponse<EligibilityResponse>.Fail(400, "No eligible license found for this category.");
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
                return ApiResponse<EligibilityResponse>.Fail(400, "License is outside the renewal grace period.");
            }

            // Get renewal fee - use category ID in the fee type name
            var feeTypeStr = $"RenewalFee_{licenseCategoryId}";
            var feeStructures = await _feeStructureRepository.FindAsync(f =>
                f.IsActive);

            var feeTypeEnum = Enum.Parse<FeeType>(feeTypeStr, true);
            var renewalFee = feeStructures.FirstOrDefault(f => 
                f.FeeType == feeTypeEnum)?.Amount ?? 0;

            var response = new EligibilityResponse
            {
                IsEligible = true,
                CurrentLicenseExpiresAt = license.ExpiresAt,
                GracePeriodEndsAt = license.Status == LicenseStatus.Active ? license.ExpiresAt : gracePeriodEnd,
                RenewalFeeAmount = renewalFee
            };

            return ApiResponse<EligibilityResponse>.Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating eligibility for renewal");
            return ApiResponse<EligibilityResponse>.Fail(500, "An error occurred while validating eligibility.");
        }
    }

    public async Task<ApiResponse<Guid>> CreateRenewalAsync(CreateRenewalRequest request)
    {
        try
        {
            // Validate old license exists and belongs to applicant
            var oldLicense = await _licenseRepository.GetByIdAsync(request.OldLicenseId);
            if (oldLicense == null)
            {
                return ApiResponse<Guid>.NotFound("Old license not found.");
            }

            // Validate category
            var category = await _licenseCategoryRepository.GetByIdAsync(request.LicenseCategoryId);
            if (category == null)
            {
                return ApiResponse<Guid>.NotFound("License category not found.");
            }

            // Check for existing pending renewal application (using Draft as initial status)
            var existingRenewal = await _renewalApplicationRepository.FindAsync(r =>
                r.OldLicenseId == request.OldLicenseId &&
                r.Status == ApplicationStatus.Draft &&
                !r.IsDeleted);

            if (existingRenewal.Any())
            {
                return ApiResponse<Guid>.Fail(409, "A renewal application already exists for this license.");
            }

            // Create renewal application
            var renewalApplication = new RenewalApplication
            {
                ApplicantId = oldLicense.HolderId,
                OldLicenseId = request.OldLicenseId,
                LicenseCategoryId = request.LicenseCategoryId,
                Status = ApplicationStatus.Draft,
                ServiceType = ServiceType.Renewal
            };

            await _renewalApplicationRepository.AddAsync(renewalApplication);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Renewal application created: {ApplicationId}", renewalApplication.Id);

            return ApiResponse<Guid>.Ok(renewalApplication.Id, "Renewal application created successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating renewal application");
            return ApiResponse<Guid>.Fail(500, "An error occurred while creating the renewal application.");
        }
    }

    public async Task<ApiResponse<bool>> ProcessMedicalResultAsync(Guid applicationId, Guid medicalExaminationId)
    {
        try
        {
            var renewalApplication = await _renewalApplicationRepository.GetByIdAsync(applicationId);
            if (renewalApplication == null)
            {
                return ApiResponse<bool>.NotFound("Renewal application not found.");
            }

            var medicalExam = await _medicalExaminationRepository.GetByIdAsync(medicalExaminationId);
            if (medicalExam == null)
            {
                return ApiResponse<bool>.NotFound("Medical examination not found.");
            }

            // Validate medical exam is fit
            if (medicalExam.FitnessResult != MedicalFitnessResult.Fit)
            {
                return ApiResponse<bool>.Fail(400, "Medical examination must show fitness for renewal.");
            }

            renewalApplication.MedicalExaminationId = medicalExaminationId;
            renewalApplication.Status = ApplicationStatus.InReview;
            _renewalApplicationRepository.Update(renewalApplication);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Medical result processed for renewal application: {ApplicationId}", applicationId);

            return ApiResponse<bool>.Ok(true, "Medical result processed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing medical result for renewal application: {ApplicationId}", applicationId);
            return ApiResponse<bool>.Fail(500, "An error occurred while processing the medical result.");
        }
    }

    public async Task<ApiResponse<bool>> PayRenewalFeeAsync(Guid applicationId, PaymentRequest paymentInfo)
    {
        try
        {
            var renewalApplication = await _renewalApplicationRepository.GetByIdAsync(applicationId);
            if (renewalApplication == null)
            {
                return ApiResponse<bool>.NotFound("Renewal application not found.");
            }

            // Validate medical exam is completed
            if (!renewalApplication.MedicalExaminationId.HasValue)
            {
                return ApiResponse<bool>.Fail(400, "Medical examination must be completed before payment.");
            }

            // Get the fee type for renewal
            var feeTypeStr = $"RenewalFee_{renewalApplication.LicenseCategoryId}";
            var feeTypeEnum = Enum.Parse<FeeType>(feeTypeStr, true);

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

            return ApiResponse<bool>.Ok(true, "Renewal fee paid successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing renewal fee payment for application: {ApplicationId}", applicationId);
            return ApiResponse<bool>.Fail(500, "An error occurred while processing the payment.");
        }
    }

    public async Task<ApiResponse<IssueLicenseResponse>> IssueLicenseAsync(Guid applicationId)
    {
        try
        {
            var renewalApplication = await _renewalApplicationRepository.GetByIdAsync(applicationId);
            if (renewalApplication == null)
            {
                return ApiResponse<IssueLicenseResponse>.NotFound("Renewal application not found.");
            }

            // Validate all prerequisites
            if (!renewalApplication.MedicalExaminationId.HasValue)
            {
                return ApiResponse<IssueLicenseResponse>.Fail(400, "Medical examination must be completed.");
            }

            if (!renewalApplication.RenewalFeePaid)
            {
                return ApiResponse<IssueLicenseResponse>.Fail(400, "Renewal fee must be paid.");
            }

            // Get old license
            var oldLicense = await _licenseRepository.GetByIdAsync(renewalApplication.OldLicenseId);
            if (oldLicense == null)
            {
                return ApiResponse<IssueLicenseResponse>.NotFound("Old license not found.");
            }

            // Get category for validity
            var category = await _licenseCategoryRepository.GetByIdAsync(renewalApplication.LicenseCategoryId);
            if (category == null)
            {
                return ApiResponse<IssueLicenseResponse>.NotFound("License category not found.");
            }

            // Get holder
            var holder = await _userRepository.GetByIdAsync(renewalApplication.ApplicantId);
            if (holder == null)
            {
                return ApiResponse<IssueLicenseResponse>.NotFound("License holder not found.");
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

            return ApiResponse<IssueLicenseResponse>.Ok(response, "License issued successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error issuing license for renewal application: {ApplicationId}", applicationId);
            return ApiResponse<IssueLicenseResponse>.Fail(500, "An error occurred while issuing the license.");
        }
    }

    private static string GenerateLicenseNumber()
    {
        var year = DateTime.UtcNow.Year;
        var random = Random.Shared.Next(10000000, 99999999);
        return $"MOJ-{year}-{random:D8}";
    }

    private async Task SendLicenseIssuedNotificationAsync(Guid userId, License license, LicenseCategory category)
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