using DrivingLicenseIssuanceSystem.Application.DTOs;
using DrivingLicenseIssuanceSystem.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Infrastructure
{
    public interface IDocumentService
    {
        Task<ApiResponse<DocumentDto>> UploadDocumentAsync(int applicationId, DocumentUploadRequest request);
        Task<ApiResponse<List<DocumentDto>>> GetApplicationDocumentsAsync(int applicationId);
        Task<ApiResponse<bool>> DeleteDocumentAsync(int applicationId, int documentId);
        Task<ApiResponse<DocumentDto>> ReviewDocumentAsync(int applicationId, int documentId, DocumentReviewRequest request);
        Task<ApiResponse<byte[]>> GetDocumentFileAsync(int documentId);
    }
}