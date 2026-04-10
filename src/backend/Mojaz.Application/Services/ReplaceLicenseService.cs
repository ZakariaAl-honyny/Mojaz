using AutoMapper;
using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.LicenseReplacement;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces;
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

public class ReplaceLicenseService : IReplaceLicenseService
{
    private readonly IRepository<License> _licenseRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<LicenseReplacement> _replacementRepository;
    private readonly IRepository<FeeStructure> _feeStructureRepository;
    private readonly IRepository<PaymentTransaction> _paymentRepository;
    private readonly IRepository<LicenseCategory> _licenseCategoryRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<ApplicationDocument> _documentRepository;
    private readonly INotificationService _notificationService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<ReplaceLicenseService> _logger;

    public ReplaceLicenseService(
        IRepository<License> licenseRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<LicenseReplacement> replacementRepository,
        IRepository<FeeStructure> feeStructureRepository,
        IRepository<PaymentTransaction> paymentRepository,
        IRepository<LicenseCategory> licenseCategoryRepository,
        IRepository<User> userRepository,
        IRepository<ApplicationDocument> documentRepository,
        INotificationService notificationService,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<ReplaceLicenseService> logger)
    {
        _licenseRepository = licenseRepository;
        _applicationRepository = applicationRepository;
        _replacementRepository = replacementRepository;
        _feeStructureRepository = feeStructureRepository;
        _paymentRepository = paymentRepository;
        _licenseCategoryRepository = licenseCategoryRepository;
        _userRepository = userRepository;
        _documentRepository = documentRepository;
        _notificationService = notificationService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<ReplacementEligibilityDto>> CheckEligibilityAsync(Guid applicantId)
    {
        try
        {
            // Query licenses by HolderId where Status == Active
            var licenses = await _licenseRepository.FindAsync(l =>
                l.HolderId == applicantId &&
                l.Status == LicenseStatus.Active &&
                !l.IsDeleted);

            var activeLicense = licenses.FirstOrDefault();

            if (activeLicense == null)
            {
                return ApiResponse<ReplacementEligibilityDto>.Fail(
                    400,
                    "No active license found. You must have an active license to apply for replacement.");
            }

            // Get license category for response
            var category = await _licenseCategoryRepository.GetByIdAsync(activeLicense.LicenseCategoryId);

            var result = new ReplacementEligibilityDto
            {
                IsEligible = true,
                LicenseId = activeLicense.Id,
                LicenseNumber = activeLicense.LicenseNumber,
                ExpiryDate = activeLicense.ExpiresAt
            };

            _logger.LogInformation("Eligibility check passed for applicant {ApplicantId}. Active license: {LicenseId}",
                applicantId, activeLicense.Id);

            return ApiResponse<ReplacementEligibilityDto>.Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking eligibility for license replacement for applicant {ApplicantId}", applicantId);
            return ApiResponse<ReplacementEligibilityDto>.Fail(500, "An error occurred while checking eligibility.");
        }
    }

    /// <inheritdoc />
    public async Task<ApiResponse<Guid>> CreateReplacementAsync(CreateReplacementRequest request, Guid applicantId)
    {
        try
        {
            // Validate the license belongs to the applicant
            var oldLicense = await _licenseRepository.GetByIdAsync(request.LicenseId);
            if (oldLicense == null)
            {
                return ApiResponse<Guid>.NotFound("License not found.");
            }

            if (oldLicense.HolderId != applicantId)
            {
                return ApiResponse<Guid>.Fail(403, "You do not own this license.");
            }

            // Validate license status is Active
            if (oldLicense.Status != LicenseStatus.Active)
            {
                return ApiResponse<Guid>.Fail(400, "Only active licenses can be replaced.");
            }

            // Check for existing pending replacement application
            var existingReplacements = await _replacementRepository.FindAsync(r =>
                r.LicenseId == request.LicenseId &&
                !r.Application.IsDeleted);

            var pendingApplication = existingReplacements.FirstOrDefault(r =>
                r.Application.Status != ApplicationStatus.Cancelled &&
                r.Application.Status != ApplicationStatus.Issued &&
                r.Application.Status != ApplicationStatus.Rejected);

            if (pendingApplication != null)
            {
                return ApiResponse<Guid>.Fail(409, "A replacement application already exists for this license.");
            }

            // Get category
            var category = await _licenseCategoryRepository.GetByIdAsync(oldLicense.LicenseCategoryId);
            if (category == null)
            {
                return ApiResponse<Guid>.NotFound("License category not found.");
            }

            // Create Application with ServiceType = Replacement
            var application = new ApplicationEntity
            {
                ApplicationNumber = GenerateApplicationNumber(),
                ApplicantId = applicantId,
                ServiceType = ServiceType.Replacement,
                LicenseCategoryId = oldLicense.LicenseCategoryId,
                Status = ApplicationStatus.Draft,
                CurrentStage = "Replacement",
                PreferredLanguage = "ar"
            };

            await _applicationRepository.AddAsync(application);

            // Create LicenseReplacement record with Reason
            var replacement = new LicenseReplacement
            {
                LicenseId = request.LicenseId,
                ApplicationId = application.Id,
                Reason = request.Reason,
                IsReportVerified = request.Reason != ReplacementReason.Stolen, // Auto-verify if not stolen
                ProcessedAt = DateTime.UtcNow
            };

            await _replacementRepository.AddAsync(replacement);

            // Link provided documents to the application
            if (request.DocumentIds != null && request.DocumentIds.Any())
            {
                foreach (var docId in request.DocumentIds)
                {
                    var doc = await _documentRepository.GetByIdAsync(docId);
                    if (doc != null)
                    {
                        doc.ApplicationId = application.Id;
                        _documentRepository.Update(doc);
                    }
                }
            }

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Replacement application created: {ApplicationId} for license {LicenseId}",
                application.Id, request.LicenseId);

            return ApiResponse<Guid>.Ok(application.Id, "Replacement application created successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating replacement application");
            return ApiResponse<Guid>.Fail(500, "An error occurred while creating the replacement application.");
        }
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LicenseReplacementDto>> GetReplacementDetailsAsync(Guid applicationId)
    {
        try
        {
            var replacements = await _replacementRepository.FindAsync(r =>
                r.ApplicationId == applicationId);

            var replacement = replacements.FirstOrDefault();

            if (replacement == null)
            {
                return ApiResponse<LicenseReplacementDto>.NotFound("Replacement record not found.");
            }

            // Get license details
            var license = await _licenseRepository.GetByIdAsync(replacement.LicenseId);
            if (license == null)
            {
                return ApiResponse<LicenseReplacementDto>.NotFound("License not found.");
            }

            var result = _mapper.Map<LicenseReplacementDto>(replacement);
            result.LicenseNumber = license.LicenseNumber;
            result.CurrentStatus = license.Status.ToString();
            result.ExpiryDate = license.ExpiresAt;

            return ApiResponse<LicenseReplacementDto>.Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting replacement details for application {ApplicationId}", applicationId);
            return ApiResponse<LicenseReplacementDto>.Fail(500, "An error occurred while getting replacement details.");
        }
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> UpdateReportVerificationAsync(
        Guid applicationId,
        bool isVerified,
        string? comments,
        Guid reviewerId)
    {
        try
        {
            var replacements = await _replacementRepository.FindAsync(r =>
                r.ApplicationId == applicationId);

            var replacement = replacements.FirstOrDefault();

            if (replacement == null)
            {
                return ApiResponse<bool>.NotFound("Replacement record not found.");
            }

            // Only stolen reports need verification
            if (replacement.Reason != ReplacementReason.Stolen)
            {
                return ApiResponse<bool>.Fail(400, "Report verification is only required for stolen licenses.");
            }

            // Update verification status
            replacement.IsReportVerified = isVerified;
            replacement.ReviewComments = comments;
            replacement.ProcessedBy = reviewerId;
            replacement.ProcessedAt = DateTime.UtcNow;

            _replacementRepository.Update(replacement);

            // Update application status if verified
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application != null && isVerified)
            {
                application.Status = ApplicationStatus.InReview;
                _applicationRepository.Update(application);
            }

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Report verification updated for application {ApplicationId}. Verified: {IsVerified}",
                applicationId, isVerified);

            return ApiResponse<bool>.Ok(true, "Report verification updated successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating report verification for application {ApplicationId}", applicationId);
            return ApiResponse<bool>.Fail(500, "An error occurred while updating report verification.");
        }
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> ProcessPaymentAsync(Guid applicationId, Guid paymentId)
    {
        try
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null)
            {
                return ApiResponse<bool>.NotFound("Application not found.");
            }

            // Validate application is ready for payment
            if (application.Status != ApplicationStatus.Draft && application.Status != ApplicationStatus.DocumentReview)
            {
                return ApiResponse<bool>.Fail(400, "Application is not in a state that requires payment.");
            }

            // Get payment
            var payment = await _paymentRepository.GetByIdAsync(paymentId);
            if (payment == null)
            {
                return ApiResponse<bool>.NotFound("Payment not found.");
            }

            // Verify payment is for this application
            if (payment.ApplicationId != applicationId)
            {
                return ApiResponse<bool>.Fail(400, "Payment does not belong to this application.");
            }

            // Verify payment is successful
            if (payment.Status != PaymentStatus.Paid)
            {
                return ApiResponse<bool>.Fail(400, "Payment is not completed.");
            }

            // Check report verification for stolen licenses
            var replacements = await _replacementRepository.FindAsync(r =>
                r.ApplicationId == applicationId);
            var replacement = replacements.FirstOrDefault();

            if (replacement?.Reason == ReplacementReason.Stolen && !replacement.IsReportVerified)
            {
                return ApiResponse<bool>.Fail(400, "Police report must be verified before proceeding.");
            }

            // Update application status
            application.Status = ApplicationStatus.Payment;
            _applicationRepository.Update(application);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Payment processed for replacement application: {ApplicationId}", applicationId);

            return ApiResponse<bool>.Ok(true, "Payment processed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing payment for application {ApplicationId}", applicationId);
            return ApiResponse<bool>.Fail(500, "An error occurred while processing the payment.");
        }
    }

    /// <inheritdoc />
    public async Task<ApiResponse<Guid>> IssueReplacementAsync(Guid applicationId, Guid processedById)
    {
        try
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null)
            {
                return ApiResponse<Guid>.NotFound("Application not found.");
            }

            // Validate all prerequisites
            if (application.Status != ApplicationStatus.Payment)
            {
                return ApiResponse<Guid>.Fail(400, "Payment must be completed before issuing replacement license.");
            }

            var replacements = await _replacementRepository.FindAsync(r =>
                r.ApplicationId == applicationId);
            var replacement = replacements.FirstOrDefault();

            if (replacement == null)
            {
                return ApiResponse<Guid>.NotFound("Replacement record not found.");
            }

            // For stolen licenses, verify report is checked
            if (replacement.Reason == ReplacementReason.Stolen && !replacement.IsReportVerified)
            {
                return ApiResponse<Guid>.Fail(400, "Police report must be verified before issuing replacement.");
            }

            // Get old license
            var oldLicense = await _licenseRepository.GetByIdAsync(replacement.LicenseId);
            if (oldLicense == null)
            {
                return ApiResponse<Guid>.NotFound("Original license not found.");
            }

            // Get category
            var category = await _licenseCategoryRepository.GetByIdAsync(application.LicenseCategoryId);
            if (category == null)
            {
                return ApiResponse<Guid>.NotFound("License category not found.");
            }

            // Get holder
            var holder = await _userRepository.GetByIdAsync(application.ApplicantId);
            if (holder == null)
            {
                return ApiResponse<Guid>.NotFound("License holder not found.");
            }

            // Generate new license number
            var newLicenseNumber = GenerateApplicationNumber();
            var issuedAt = DateTime.UtcNow;

            // Calculate expiry - keep same expiry as old license
            var expiresAt = oldLicense.ExpiresAt;

            // Create new license
            var newLicense = new License
            {
                LicenseNumber = newLicenseNumber,
                ApplicationId = applicationId,
                HolderId = application.ApplicantId,
                LicenseCategoryId = application.LicenseCategoryId,
                IssuedAt = issuedAt,
                ExpiresAt = expiresAt,
                IssuedBy = processedById,
                Status = LicenseStatus.Active
            };

            await _licenseRepository.AddAsync(newLicense);

            // Deactivate old license
            oldLicense.Status = LicenseStatus.Replaced;
            _licenseRepository.Update(oldLicense);

            // Update application status
            application.Status = ApplicationStatus.Issued;
            application.CurrentStage = "Completed";
            _applicationRepository.Update(application);

            // Update replacement record
            replacement.ProcessedBy = processedById;
            replacement.ProcessedAt = DateTime.UtcNow;
            _replacementRepository.Update(replacement);

            await _unitOfWork.SaveChangesAsync();

            // Notify the applicant about the license issuance
            await _notificationService.SendAsync(new NotificationRequest
            {
                UserId = application.ApplicantId,
                ApplicationId = application.Id,
                EventType = NotificationEventType.LicenseIssued,
                TitleAr = "تم إصدار رخصتك بنجاح",
                TitleEn = "Your license has been issued successfully",
                MessageAr = $"تم إصدار رخصة القيادة الجديدة الخاصة بك بنجاح. رقم الرخصة: {newLicenseNumber}",
                MessageEn = $"Your new driving license has been issued successfully. License Number: {newLicenseNumber}",
                InApp = true,
                Push = true,
                Email = true,
                Sms = true
            });

            _logger.LogInformation("Replacement license issued: {NewLicenseId} for application {ApplicationId}. Old license {OldLicenseId} replaced.",
                newLicense.Id, applicationId, oldLicense.Id);

            return ApiResponse<Guid>.Ok(newLicense.Id, "Replacement license issued successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error issuing replacement license for application {ApplicationId}", applicationId);
            return ApiResponse<Guid>.Fail(500, "An error occurred while issuing the replacement license.");
        }
    }

    private static string GenerateApplicationNumber()
    {
        var year = DateTime.UtcNow.Year;
        var random = Random.Shared.Next(10000000, 99999999);
        return $"MOJ-{year}-{random:D8}";
    }
}