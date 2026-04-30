using Mojaz.Application.DTOs.Document;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IDocumentService
{
    Task<ApiResponse<DocumentDto>> UploadAsync(Guid applicationId, UploadDocumentRequest request, Guid userId);
    Task<ApiResponse<DocumentDto>> UploadByApplicationNumberAsync(string applicationNumber, UploadDocumentRequest request, Guid userId);
    Task<ApiResponse<IEnumerable<DocumentDto>>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role);
    Task<ApiResponse<IEnumerable<DocumentDto>>> GetByApplicationNumberAsync(string applicationNumber, Guid userId, string role);
    Task<ApiResponse<IEnumerable<DocumentRequirementDto>>> GetRequirementsAsync(Guid applicationId, Guid userId, string role);
    Task<ApiResponse<IEnumerable<DocumentRequirementDto>>> GetRequirementsByApplicationNumberAsync(string applicationNumber, Guid userId, string role);
    Task<ApiResponse<BulkApproveResponse>> BulkApproveByApplicationNumberAsync(string applicationNumber, Guid reviewerId);
    Task<ApiResponse<DocumentDto>> ReviewAsync(Guid documentId, DocumentReviewRequest request, Guid reviewerId);
    Task<ApiResponse<BulkApproveResponse>> BulkApproveAsync(Guid applicationId, Guid reviewerId);
    Task<ApiResponse<bool>> DeleteAsync(Guid documentId, Guid userId);
    Task<ApiResponse<bool>> DeleteByApplicationNumberAsync(string applicationNumber, Guid documentId, Guid userId);
    Task<(Stream content, string contentType, string fileName)> DownloadAsync(Guid documentId, Guid userId, string role);
    Task<(Stream content, string contentType, string fileName)> DownloadByApplicationNumberAsync(string applicationNumber, Guid documentId, Guid userId, string role);
    Task<ApiResponse<bool>> NotifyMissingDocumentsAsync(Guid applicationId, List<string> missingAr, List<string> missingEn, DateTime deadline);
}
