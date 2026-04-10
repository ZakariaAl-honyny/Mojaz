using AutoMapper;
using Hangfire;
using Mojaz.Application.DTOs.Email;
using Mojaz.Application.DTOs.Email.Templates;
using Mojaz.Application.DTOs.License;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;
using ApplicationEmailService = Mojaz.Application.Interfaces.Services.IEmailService;

namespace Mojaz.Application.Services;

public class LicenseService : ILicenseService
{
    private readonly IRepository<License> _licenseRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<LicenseCategory> _licenseCategoryRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly ApplicationEmailService _emailService;
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly ILicensePdfGenerator _licensePdfGenerator;
    private readonly IFileStorageService _fileStorageService;
    private readonly IMapper _mapper;

    public LicenseService(
        IRepository<License> licenseRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<LicenseCategory> licenseCategoryRepository,
        IRepository<User> userRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        ApplicationEmailService emailService,
        IBackgroundJobClient backgroundJobClient,
        ILicensePdfGenerator licensePdfGenerator,
        IFileStorageService fileStorageService,
        IMapper mapper)
    {
        _licenseRepository = licenseRepository;
        _applicationRepository = applicationRepository;
        _licenseCategoryRepository = licenseCategoryRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _emailService = emailService;
        _backgroundJobClient = backgroundJobClient;
        _licensePdfGenerator = licensePdfGenerator;
        _fileStorageService = fileStorageService;
        _mapper = mapper;
    }

    public async Task<ApiResponse<LicenseDto>> IssueLicenseAsync(Guid applicationId, Guid issuerId)
    {
        // 1. Idempotency Check: Already issued?
        var existingLicense = await _licenseRepository.ExistsAsync(x => x.ApplicationId == applicationId);
        if (existingLicense)
        {
            return ApiResponse<LicenseDto>.Fail(409, "A license has already been issued for this application.");
        }

        // 2. Load Application
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<LicenseDto>.NotFound("Application not found.");

        // 3. Validation: Status must be Approved
        if (application.Status != ApplicationStatus.Approved)
        {
            return ApiResponse<LicenseDto>.Fail(400, "License can only be issued for approved applications.");
        }

        // 4. Load Category for validity years
        var category = await _licenseCategoryRepository.GetByIdAsync(application.LicenseCategoryId);
        if (category == null) return ApiResponse<LicenseDto>.Fail(400, "License category not found.");

        // 5. Load Holder User
        var holder = await _userRepository.GetByIdAsync(application.ApplicantId);
        if (holder == null) return ApiResponse<LicenseDto>.Fail(400, "License holder user not found.");

        // 6. Generate Metadata
        var licenseNumber = GenerateLicenseNumber();
        var issuedAt = DateTime.UtcNow;
        var expiresAt = issuedAt.AddYears(category.ValidityYears > 0 ? category.ValidityYears : 10);

        var license = new License
        {
            HolderId = application.ApplicantId,
            ApplicationId = application.Id,
            LicenseCategoryId = application.LicenseCategoryId,
            LicenseNumber = licenseNumber,
            IssuedAt = issuedAt,
            ExpiresAt = expiresAt,
            IssuedBy = issuerId,
            Status = LicenseStatus.Active,
            BranchId = application.BranchId
        };

        // 7. Generate PDF Content
        var pdfBytes = await _licensePdfGenerator.GenerateLicensePdfAsync(license, holder, category);

        // 8. Store PDF in Blob Storage
        using var ms = new MemoryStream(pdfBytes);
        var fileName = $"{licenseNumber}.pdf";
        var contentType = "application/pdf";
        var blobUrl = await _fileStorageService.SaveAsync(ms, fileName, contentType);
        
        license.BlobUrl = blobUrl;

        // 9. Persist License & Update Application
        await _licenseRepository.AddAsync(license);
        
        application.Status = ApplicationStatus.Issued;
        application.CurrentStage = "10-Active";
        _applicationRepository.Update(application);
        
        await _unitOfWork.SaveChangesAsync();

        // 10. Send Notifications (In-App)
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = application.ApplicantId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.LicenseIssued,
            TitleAr = "تم إصدار الرخصة",
            TitleEn = "License Issued",
            MessageAr = $"تم إصدار رخصة القيادة رقم {licenseNumber} بنجاح.",
            MessageEn = $"Your driving license {licenseNumber} has been issued successfully."
        });

        // 11. Background Email (Hangfire)
        if (!string.IsNullOrEmpty(holder.Email))
        {
            var emailData = new LicenseIssuedEmailData
            {
                LicenseNumber = license.LicenseNumber,
                ExpiryDateAr = license.ExpiresAt.ToString("yyyy-MM-dd"),
                ExpiryDateEn = license.ExpiresAt.ToString("yyyy-MM-dd"),
                DownloadUrl = $"/api/v1/licenses/{license.Id}/download",
                CategoryAr = category.NameAr,
                CategoryEn = category.NameEn
            };

            _backgroundJobClient.Enqueue(() => _emailService.SendTemplatedAsync(new TemplatedEmailRequest
            {
                RecipientEmail = holder.Email,
                TemplateName = "license-issued",
                TemplateData = emailData,
                ReferenceId = license.Id.ToString()
            }));
        }

        var resultDto = _mapper.Map<LicenseDto>(license);
        return ApiResponse<LicenseDto>.Ok(resultDto, "License issued successfully.");
    }

    public async Task<ApiResponse<LicenseDto>> GetByIdAsync(Guid id)
    {
        var license = await _licenseRepository.GetByIdAsync(id);
        if (license == null) return ApiResponse<LicenseDto>.NotFound("License not found.");
        
        var dto = _mapper.Map<LicenseDto>(license);
        return ApiResponse<LicenseDto>.Ok(dto);
    }

    public async Task<ApiResponse<LicenseDto>> GetByApplicationIdAsync(Guid applicationId)
    {
        var licenses = await _licenseRepository.FindAsync(x => x.ApplicationId == applicationId);
        var license = licenses.FirstOrDefault();
        if (license == null) return ApiResponse<LicenseDto>.NotFound("No license found for this application.");
        
        var dto = _mapper.Map<LicenseDto>(license);
        return ApiResponse<LicenseDto>.Ok(dto);
    }

    private string GenerateLicenseNumber()
    {
        var year = DateTime.UtcNow.Year;
        var random = Random.Shared.Next(10000000, 99999999);
        return $"MOJ-{year}-{random:D8}";
    }
}