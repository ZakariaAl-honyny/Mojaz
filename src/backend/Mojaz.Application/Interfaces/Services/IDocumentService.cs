using Mojaz.Application.DTOs.Document;
using Mojaz.Shared;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IDocumentService
{
    Task<ApiResponse<DocumentDto>> UploadAsync(int applicationId, UploadDocumentRequest request, int userId, string role);
    Task<ApiResponse<DocumentDto>> UploadByApplicationNumberAsync(string applicationNumber, UploadDocumentRequest request, int userId, string role);
    Task<ApiResponse<IEnumerable<DocumentDto>>> GetByApplicationIdAsync(int applicationId, int userId, string role);
    Task<ApiResponse<IEnumerable<DocumentDto>>> GetByApplicationNumberAsync(string applicationNumber, int userId, string role);
    Task<ApiResponse<IEnumerable<DocumentRequirementDto>>> GetRequirementsAsync(int applicationId, int userId, string role);
    Task<ApiResponse<IEnumerable<DocumentRequirementDto>>> GetRequirementsByApplicationNumberAsync(string applicationNumber, int userId, string role);
    Task<ApiResponse<BulkApproveResponse>> BulkApproveByApplicationNumberAsync(string applicationNumber, int reviewerId);
    Task<ApiResponse<DocumentDto>> ReviewAsync(int documentId, DocumentReviewRequest request, int reviewerId);
    Task<ApiResponse<BulkApproveResponse>> BulkApproveAsync(int applicationId, int reviewerId);
    Task<ApiResponse<bool>> DeleteAsync(int documentId, int userId);
    Task<ApiResponse<bool>> DeleteByApplicationNumberAsync(string applicationNumber, int documentId, int userId);
    Task<(Stream content, string contentType, string fileName)> DownloadAsync(int documentId, int userId, string role);
    Task<(Stream content, string contentType, string fileName)> DownloadByApplicationNumberAsync(string applicationNumber, int documentId, int userId, string role);
    Task<ApiResponse<bool>> NotifyMissingDocumentsAsync(int applicationId, List<string> missingAr, List<string> missingEn, DateTime deadline);
}
