using Mojaz.Application.DTOs;
using Mojaz.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Infrastructure
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