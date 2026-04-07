using Mojaz.Application.DTOs.Document;
using Mojaz.Application.DTOs.Email;
using Mojaz.Application.DTOs.Email.Templates;
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

    public DocumentService(
        IRepository<ApplicationDocument> documentRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<User> userRepository,
        IUnitOfWork unitOfWork,
        IAuditService auditService,
        IEmailService emailService,
        IBackgroundJobClient backgroundJobClient)
    {
        _documentRepository = documentRepository;
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _auditService = auditService;
        _emailService = emailService;
        _backgroundJobClient = backgroundJobClient;
    }

    public async Task<ApiResponse<DocumentDto>> UploadAsync(Guid applicationId, UploadDocumentRequest request, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<DocumentDto>.Fail(404, "Application not found.");
        
        if (application.ApplicantId != userId) return ApiResponse<DocumentDto>.Fail(403, "Unauthorized.");

        // Simulate file storage
        var fileName = $"{Guid.NewGuid()}_{request.File.FileName}";
        var filePath = $"/uploads/documents/{fileName}";
        
        var document = new ApplicationDocument
        {
            ApplicationId = applicationId,
            DocumentType = request.DocumentType,
            FileName = fileName,
            FilePath = filePath,
            ContentType = request.File.ContentType,
            FileSize = request.File.Length,
            Status = DocumentStatus.Pending,
            UploadedAt = DateTime.UtcNow
        };

        await _documentRepository.AddAsync(document);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("UPLOAD_DOCUMENT", "Document", document.Id.ToString(), null, request.DocumentType.ToString());

        return ApiResponse<DocumentDto>.Ok(new DocumentDto { Id = document.Id, Status = document.Status });
    }

    public async Task<ApiResponse<IEnumerable<DocumentDto>>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role)
    {
        var docs = await _documentRepository.FindAsync(d => d.ApplicationId == applicationId);
        return ApiResponse<IEnumerable<DocumentDto>>.Ok(docs.Select(d => new DocumentDto { Id = d.Id, Status = d.Status, ApplicationId = d.ApplicationId, DocumentType = d.DocumentType, FileName = d.FileName, FileSize = d.FileSize, ContentType = d.ContentType, UploadedAt = d.UploadedAt }));
    }

    public async Task<ApiResponse<bool>> ReviewAsync(Guid documentId, DocumentReviewRequest request, Guid reviewerId)
    {
        var document = await _documentRepository.GetByIdAsync(documentId);
        if (document == null) return ApiResponse<bool>.Fail(404, "Document not found.");

        document.Status = request.Approved ? DocumentStatus.Approved : DocumentStatus.Rejected;
        document.RejectionReason = request.RejectionReason;
        document.ReviewedBy = reviewerId;
        document.ReviewedAt = DateTime.UtcNow;

        _documentRepository.Update(document);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("REVIEW_DOCUMENT", "Document", documentId.ToString(), "Pending", document.Status.ToString());

        return ApiResponse<bool>.Ok(true, "Document reviewed.");
    }

    public async Task<ApiResponse<bool>> NotifyMissingDocumentsAsync(Guid applicationId, List<string> missingDocumentsAr, List<string> missingDocumentsEn, DateTime deadline)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        var user = await _userRepository.GetByIdAsync(application.ApplicantId);
        if (user != null && !string.IsNullOrEmpty(user.Email))
        {
            var emailData = new DocumentsMissingEmailData
            {
                ApplicationId = applicationId.ToString(),
                ApplicationNumber = application.ApplicationNumber,
                MissingDocumentsAr = missingDocumentsAr,
                MissingDocumentsEn = missingDocumentsEn,
                DeadlineDateAr = deadline.ToString("yyyy-MM-dd"),
                DeadlineDateEn = deadline.ToString("yyyy-MM-dd")
            };

            _backgroundJobClient.Enqueue(() => _emailService.SendTemplatedAsync(new TemplatedEmailRequest
            {
                RecipientEmail = user.Email,
                TemplateName = "documents-missing",
                TemplateData = emailData,
                ReferenceId = applicationId.ToString()
            }));

            await _auditService.LogAsync("NOTIFY_MISSING_DOCUMENTS", "Application", applicationId.ToString(), null, "Sent");
        }

        return ApiResponse<bool>.Ok(true, "Missing documents notification sent.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid documentId, Guid userId)
    {
        var document = await _documentRepository.GetByIdAsync(documentId);
        if (document == null) return ApiResponse<bool>.Fail(404, "Document not found.");

        _documentRepository.Remove(document);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Document deleted.");
    }

    public async Task<(byte[] content, string contentType, string fileName)> DownloadAsync(Guid documentId, Guid userId, string role)
    {
        var document = await _documentRepository.GetByIdAsync(documentId);
        if (document == null) throw new Exception("Document not found.");
        
        return (new byte[0], document.ContentType, document.FileName);
    }
}
