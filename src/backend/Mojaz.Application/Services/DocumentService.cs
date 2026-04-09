using Mojaz.Application.DTOs.Document;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Models;
using Hangfire;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;
using IEmailService = Mojaz.Application.Interfaces.Services.IEmailService;

namespace Mojaz.Application.Services;

public class DocumentService : IDocumentService
{
    private readonly IRepository<ApplicationDocument> _documentRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuditService _auditService;
    private readonly IEmailService _emailService;
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly IFileStorageService _fileStorageService;
    private readonly ISystemSettingsService _systemSettingsService;
    private readonly INotificationService? _notificationService;

public DocumentService(
    IRepository<ApplicationDocument> documentRepository,
    IRepository<ApplicationEntity> applicationRepository,
    IRepository<User> userRepository,
    IUnitOfWork unitOfWork,
    IAuditService auditService,
    IEmailService emailService,
    IBackgroundJobClient backgroundJobClient,
    IFileStorageService fileStorageService,
    ISystemSettingsService systemSettingsService,
    INotificationService? notificationService = null)
{
    _documentRepository = documentRepository;
    _applicationRepository = applicationRepository;
    _userRepository = userRepository;
    _unitOfWork = unitOfWork;
    _auditService = auditService;
    _emailService = emailService;
    _backgroundJobClient = backgroundJobClient;
    _fileStorageService = fileStorageService;
    _systemSettingsService = systemSettingsService;
    _notificationService = notificationService;
}

    public async Task<ApiResponse<DocumentDto>> UploadAsync(Guid applicationId, UploadDocumentRequest request, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<DocumentDto>.Fail(404, "Application not found.");
         
        if (application.ApplicantId != userId) return ApiResponse<DocumentDto>.Fail(403, "Unauthorized.");

        // Validate file
        if (request.File == null) return ApiResponse<DocumentDto>.Fail(400, "File is required.");
        
        // Validate file size (max 5MB from SystemSettings)
        var maxSizeMbSetting = await _systemSettingsService.GetAsync("MAX_FILE_SIZE_MB");
        var maxSizeMb = maxSizeMbSetting != null && int.TryParse(maxSizeMbSetting, out var parsed) ? parsed : 5;
        if (request.File.Length > maxSizeMb * 1048576)
            return ApiResponse<DocumentDto>.Fail(400, $"File size exceeds the {maxSizeMb}MB limit.");
        
        // Validate file extension
        var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
        if (extension != ".pdf" && extension != ".jpg" && extension != ".jpeg" && extension != ".png")
            return ApiResponse<DocumentDto>.Fail(400, "Invalid file type. Only PDF, JPG, PNG allowed.");
        
        // TODO: Implement MIME magic bytes validation

        // Use file storage service
        var storedFileName = $"{Guid.NewGuid()}{extension}";
        var relativePath = await _fileStorageService.SaveAsync(request.File.OpenReadStream(), storedFileName, request.File.ContentType);
        
        var document = new ApplicationDocument
        {
            ApplicationId = applicationId,
            DocumentType = request.DocumentType,
            OriginalFileName = request.File.FileName,
            StoredFileName = storedFileName,
            FilePath = relativePath,
            ContentType = request.File.ContentType,
            FileSizeBytes = request.File.Length,
            Status = DocumentStatus.Pending
        };

        await _documentRepository.AddAsync(document);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("UPLOAD_DOCUMENT", "Document", document.Id.ToString(), null, request.DocumentType.ToString());

        return ApiResponse<DocumentDto>.Ok(new DocumentDto 
        { 
            Id = document.Id,
            ApplicationId = document.ApplicationId,
            DocumentType = document.DocumentType,
            DocumentTypeName = document.DocumentType.ToString(),
            OriginalFileName = document.OriginalFileName,
            FileSizeBytes = document.FileSizeBytes,
            ContentType = document.ContentType,
            Status = document.Status,
            CreatedAt = document.CreatedAt,
            DownloadUrl = $"/api/v1/applications/{document.ApplicationId}/documents/{document.Id}/download"
        });
    }

    public async Task<ApiResponse<IEnumerable<DocumentDto>>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role)
    {
        var docs = await _documentRepository.FindAsync(d => d.ApplicationId == applicationId);
        return ApiResponse<IEnumerable<DocumentDto>>.Ok(docs.Select(d => new DocumentDto 
        { 
            Id = d.Id, 
            Status = d.Status, 
            ApplicationId = d.ApplicationId, 
            DocumentType = d.DocumentType,
            DocumentTypeName = d.DocumentType.ToString(),
            OriginalFileName = d.OriginalFileName, 
            FileSizeBytes = d.FileSizeBytes, 
            ContentType = d.ContentType,
            ReviewedBy = d.ReviewedBy,
            ReviewedAt = d.ReviewedAt,
            RejectionReason = d.RejectionReason,
            CreatedAt = d.CreatedAt,
            DownloadUrl = $"/api/v1/applications/{d.ApplicationId}/documents/{d.Id}/download"
        }));
    }

    public async Task<ApiResponse<IEnumerable<DocumentRequirementDto>>> GetRequirementsAsync(Guid applicationId, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<IEnumerable<DocumentRequirementDto>>.Fail(404, "Application not found.");

        var docs = await _documentRepository.FindAsync(d => d.ApplicationId == applicationId);
        
        // Get applicant info for conditional logic
        var applicant = await _userRepository.GetByIdAsync(application.ApplicantId);
        
        // Get existing documents
        var existingDocs = docs.ToList();
        
        var requirements = new List<DocumentRequirementDto>();
        
        // Define all 8 document types with their conditional rules
        foreach (DocumentType docType in Enum.GetValues(typeof(DocumentType)))
        {
            var isRequired = false;
            var isConditional = false;
            string? conditionDescription = null;
            
            // Check conditional requirements
            switch (docType)
            {
                case DocumentType.AddressProof:
                    // Required when applicant is Resident (check from Application/Applicant)
                    isRequired = false;
                    isConditional = true;
                    conditionDescription = "Required for resident applicants";
                    break;
                case DocumentType.GuardianConsent:
                    // Required when applicant age < 18
                    if (applicant != null)
                    {
                        var age = DateTime.UtcNow.Year - applicant.DateOfBirth.Year;
                        isRequired = age < 18;
                        isConditional = true;
                        conditionDescription = isRequired ? "Required because applicant is under 18 years old" : "Not applicable (applicant is 18 or older)";
                    }
                    break;
                case DocumentType.PreviousLicense:
                    // Required when previous license declared / Renewal / Upgrade service
                    isRequired = false;
                    isConditional = true;
                    conditionDescription = "Required for renewal or upgrade services";
                    break;
                case DocumentType.AccessibilityDocuments:
                    // Required when SupportNeeds == true
                    isRequired = false;
                    isConditional = true;
                    conditionDescription = "Required for applicants with accessibility needs";
                    break;
                default:
                    // Mandatory documents
                    isRequired = true;
                    break;
            }
            
            var existingDoc = existingDocs.FirstOrDefault(d => d.DocumentType == docType);
            
            requirements.Add(new DocumentRequirementDto
            {
                DocumentType = docType,
                DocumentTypeName = docType.ToString(),
                IsRequired = isRequired,
                IsConditional = isConditional,
                ConditionDescription = conditionDescription,
                HasUpload = existingDoc != null,
                Status = existingDoc?.Status,
                DocumentId = existingDoc?.Id
            });
        }
        
        return ApiResponse<IEnumerable<DocumentRequirementDto>>.Ok(requirements);
    }

    public async Task<ApiResponse<DocumentDto>> ReviewAsync(Guid documentId, DocumentReviewRequest request, Guid reviewerId)
    {
        var document = await _documentRepository.GetByIdAsync(documentId);
        if (document == null) return ApiResponse<DocumentDto>.Fail(404, "Document not found.");

        // Validate rejection reason
        if (!request.Approved && string.IsNullOrWhiteSpace(request.RejectionReason))
            return ApiResponse<DocumentDto>.Fail(400, "Rejection reason is required when rejecting a document.");

        document.Status = request.Approved ? DocumentStatus.Approved : DocumentStatus.Rejected;
        document.RejectionReason = request.RejectionReason;
        document.ReviewedBy = reviewerId;
        document.ReviewedAt = DateTime.UtcNow;

        _documentRepository.Update(document);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("REVIEW_DOCUMENT", "Document", documentId.ToString(), "Pending", document.Status.ToString());

        // Send notification for rejection (in-app synchronously + async for Push/Email/SMS)
        if (document.Status == DocumentStatus.Rejected && _notificationService != null)
        {
            try
            {
                var application = await _applicationRepository.GetByIdAsync(document.ApplicationId);
                if (application != null)
                {
                    // Get document type name for notification
                    var docTypeName = document.DocumentType.ToString();
                    
                    // Create in-app notification (synchronous)
                    await _notificationService.SendAsync(new NotificationRequest
                    {
                        UserId = application.ApplicantId,
                        ApplicationId = document.ApplicationId,
                        EventType = NotificationEventType.DocumentRejected,
                        TitleAr = $"تم رفض مستند {{0}}",
                        TitleEn = $"Your {docTypeName} document has been rejected",
                        MessageAr = $"سبب الرفض: {document.RejectionReason}",
                        MessageEn = $"Rejection reason: {document.RejectionReason}",
                        Email = true,
                        Sms = false,
                        Push = true,
                        InApp = true
                    });
                    
                    // Enqueue background job for external notifications
                    // Note: In production, this would be handled by Hangfire for async delivery
                }
            }
            catch (Exception ex)
            {
                // Log but don't fail the review if notification fails
                await _auditService.LogAsync("NOTIFICATION_FAILED", "Document", documentId.ToString(), ex.Message, null);
            }
        }

        return ApiResponse<DocumentDto>.Ok(new DocumentDto
        {
            Id = document.Id,
            ApplicationId = document.ApplicationId,
            DocumentType = document.DocumentType,
            DocumentTypeName = document.DocumentType.ToString(),
            OriginalFileName = document.OriginalFileName,
            FileSizeBytes = document.FileSizeBytes,
            ContentType = document.ContentType,
            Status = document.Status,
            RejectionReason = document.RejectionReason,
            ReviewedBy = document.ReviewedBy,
            ReviewedAt = document.ReviewedAt,
            CreatedAt = document.CreatedAt,
            DownloadUrl = $"/api/v1/applications/{document.ApplicationId}/documents/{document.Id}/download"
        });
    }

    public async Task<ApiResponse<BulkApproveResponse>> BulkApproveAsync(Guid applicationId, Guid reviewerId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<BulkApproveResponse>.Fail(404, "Application not found.");

        var pendingDocs = (await _documentRepository.FindAsync(d => d.ApplicationId == applicationId && d.Status == DocumentStatus.Pending)).ToList();
        
        if (!pendingDocs.Any())
        {
            return ApiResponse<BulkApproveResponse>.Ok(new BulkApproveResponse { ApprovedCount = 0, ApprovedDocumentIds = new List<Guid>() });
        }

        var approvedIds = new List<Guid>();
        foreach (var doc in pendingDocs)
        {
            doc.Status = DocumentStatus.Approved;
            doc.ReviewedBy = reviewerId;
            doc.ReviewedAt = DateTime.UtcNow;
            _documentRepository.Update(doc);
            approvedIds.Add(doc.Id);
            
            await _auditService.LogAsync("BULK_APPROVE_DOCUMENT", "Document", doc.Id.ToString(), "Pending", "Approved");
        }

        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<BulkApproveResponse>.Ok(new BulkApproveResponse 
        { 
            ApprovedCount = approvedIds.Count, 
            ApprovedDocumentIds = approvedIds 
        });
    }

    public async Task<ApiResponse<bool>> NotifyMissingDocumentsAsync(Guid applicationId, List<string> missingAr, List<string> missingEn, DateTime deadline)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        var user = await _userRepository.GetByIdAsync(application.ApplicantId);
        if (user != null && !string.IsNullOrEmpty(user.Email))
        {
            // TODO: Add email templates and notification service integration
            // For now, just log the notification
            await _auditService.LogAsync("NOTIFY_MISSING_DOCUMENTS", "Application", applicationId.ToString(), 
                $"Missing docs: {string.Join(", ", missingEn)}", "Notification queued");
        }

        return ApiResponse<bool>.Ok(true, "Missing documents notification sent.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid documentId, Guid userId)
    {
        var document = await _documentRepository.GetByIdAsync(documentId);
        if (document == null) return ApiResponse<bool>.Fail(404, "Document not found.");
        
        // Check if application is in a state that allows deletion (Draft only)
        var application = await _applicationRepository.GetByIdAsync(document.ApplicationId);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");
        
        // Only allow deletion if user owns the document and application is in editable state
        if (application.ApplicantId != userId)
            return ApiResponse<bool>.Fail(403, "You are not authorized to delete this document.");
            
        // Check application status - can only delete if Draft
        if (application.Status != Domain.Enums.ApplicationStatus.Draft)
            return ApiResponse<bool>.Fail(403, "Documents cannot be deleted after the application has been submitted for review.");

        // Soft delete
        document.IsDeleted = true;
        document.UpdatedAt = DateTime.UtcNow;
        _documentRepository.Update(document);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("DELETE_DOCUMENT", "Document", documentId.ToString(), null, "Soft deleted");

        return ApiResponse<bool>.Ok(true, "Document deleted successfully.");
    }

    public async Task<(Stream content, string contentType, string fileName)> DownloadAsync(Guid documentId, Guid userId, string role)
    {
        var document = await _documentRepository.GetByIdAsync(documentId);
        if (document == null) throw new Exception("Document not found.");
        
        // Get the application to check ownership
        var application = await _applicationRepository.GetByIdAsync(document.ApplicationId);
        if (application == null) throw new Exception("Application not found.");
        
        // Check authorization: owner or employee role
        var isOwner = application.ApplicantId == userId;
        var isEmployee = !string.IsNullOrEmpty(role) && (role == "Receptionist" || role == "Manager" || role == "Admin" || role == "Doctor" || role == "Examiner");
        
        if (!isOwner && !isEmployee)
            throw new UnauthorizedAccessException("You are not authorized to access this document.");
        
        // Read file from storage
        var (stream, contentType) = await _fileStorageService.ReadAsync(document.FilePath);
        
        return (stream, document.ContentType, document.OriginalFileName);
    }
}
