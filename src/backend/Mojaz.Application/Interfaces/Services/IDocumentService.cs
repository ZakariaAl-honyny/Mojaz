using Mojaz.Application.DTOs.Document;
using Mojaz.Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IDocumentService
{
    Task<ApiResponse<DocumentDto>> UploadAsync(Guid applicationId, UploadDocumentRequest request, Guid userId);
    Task<ApiResponse<IEnumerable<DocumentDto>>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role);
    Task<ApiResponse<IEnumerable<DocumentRequirementDto>>> GetRequirementsAsync(Guid applicationId, Guid userId);
    Task<ApiResponse<DocumentDto>> ReviewAsync(Guid documentId, DocumentReviewRequest request, Guid reviewerId);
    Task<ApiResponse<BulkApproveResponse>> BulkApproveAsync(Guid applicationId, Guid reviewerId);
    Task<ApiResponse<bool>> DeleteAsync(Guid documentId, Guid userId);
    Task<(Stream content, string contentType, string fileName)> DownloadAsync(Guid documentId, Guid userId, string role);
    Task<ApiResponse<bool>> NotifyMissingDocumentsAsync(Guid applicationId, List<string> missingAr, List<string> missingEn, DateTime deadline);
}
