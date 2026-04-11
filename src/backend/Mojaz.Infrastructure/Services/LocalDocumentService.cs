using Mojaz.Application.DTOs;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Domain.Entities;
using Mojaz.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Services
{
    public class LocalDocumentService : IDocumentService
    {
        private readonly MojazDbContext _dbContext;
        private readonly string _uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

        public LocalDocumentService(MojazDbContext dbContext)
        {
            _dbContext = dbContext;
            
            // Ensure uploads directory exists
            if (!Directory.Exists(_uploadsDirectory))
            {
                Directory.CreateDirectory(_uploadsDirectory);
            }
        }

        public async Task<ApiResponse<DocumentDto>> UploadDocumentAsync(int applicationId, DocumentUploadRequest request)
        {
            try
            {
                // Validate application exists
                var applicationExists = await _dbContext.Applications.AnyAsync(a => a.Id == applicationId);
                if (!applicationExists)
                {
                    return ApiResponse<DocumentDto>.Fail("Application not found", 404);
                }

                // Validate file
                if (request.File == null || request.File.Length == 0)
                {
                    return ApiResponse<DocumentDto>.Fail("No file provided", 400);
                }

                // Validate file extension
                var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
                var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                {
                    return ApiResponse<DocumentDto>.Fail($"Invalid file extension. Allowed: {string.Join(", ", allowedExtensions)}", 400);
                }

                // Validate file size (5MB)
                if (request.File.Length > 5 * 1024 * 1024) // 5MB
                {
                    return ApiResponse<DocumentDto>.Fail("File size exceeds 5MB limit", 400);
                }

                // Validate MIME type
                var allowedMimeTypes = new[] { "application/pdf", "image/jpeg", "image/png" };
                if (!allowedMimeTypes.Contains(request.File.ContentType.ToLowerInvariant()))
                {
                    return ApiResponse<DocumentDto>.Fail("Invalid file type. Only PDF, JPG, and PNG are allowed.", 400);
                }

                // Generate unique filename
                var fileGuid = Guid.NewGuid();
                var fileName = $"{fileGuid}{extension}";
                var filePath = Path.Combine(_uploadsDirectory, fileName);

                // Save file to disk
                await using var stream = new FileStream(filePath, FileMode.Create);
                await request.File.CopyToAsync(stream);

                // Create document record
                var document = new Document
                {
                    ApplicationId = applicationId,
                    DocumentType = request.DocumentType,
                    FileName = request.File.FileName,
                    FileExtension = extension.TrimStart('.'),
                    FileGuid = fileGuid.ToString(),
                    FileSize = request.File.Length,
                    MimeType = request.File.ContentType,
                    Status = "Pending"
                };

                _dbContext.Documents.Add(document);
                await _dbContext.SaveChangesAsync();

                // Return DTO
                var documentDto = new DocumentDto
                {
                    Id = document.Id,
                    ApplicationId = document.ApplicationId,
                    DocumentType = document.DocumentType,
                    FileName = document.FileName,
                    FileExtension = document.FileExtension,
                    FileGuid = document.FileGuid,
                    FileSize = document.FileSize,
                    MimeType = document.MimeType,
                    Status = document.Status,
                    CreatedAt = document.CreatedAt
                };

                return ApiResponse<DocumentDto>.Created(documentDto, "Document uploaded successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<DocumentDto>.Fail($"Error uploading document: {ex.Message}", 500);
            }
        }

        public async Task<ApiResponse<List<DocumentDto>>> GetApplicationDocumentsAsync(int applicationId)
        {
            try
            {
                var documents = await _dbContext.Documents
                    .Where(d => d.ApplicationId == applicationId && !d.IsDeleted)
                    .Select(d => new DocumentDto
                    {
                        Id = d.Id,
                        ApplicationId = d.ApplicationId,
                        DocumentType = d.DocumentType,
                        FileName = d.FileName,
                        FileExtension = d.FileExtension,
                        FileGuid = d.FileGuid,
                        FileSize = d.FileSize,
                        MimeType = d.MimeType,
                        Status = d.Status,
                        ReviewReason = d.ReviewReason,
                        ReviewedBy = d.ReviewedBy,
                        ReviewedAt = d.ReviewedAt,
                        CreatedAt = d.CreatedAt
                    })
                    .ToListAsync();

                return ApiResponse<List<DocumentDto>>.Ok(documents, "Documents retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<DocumentDto>>.Fail($"Error retrieving documents: {ex.Message}", 500);
            }
        }

        public async Task<ApiResponse<bool>> DeleteDocumentAsync(int applicationId, int documentId)
        {
            try
            {
                var document = await _dbContext.Documents
                    .FirstOrDefaultAsync(d => d.Id == documentId && d.ApplicationId == applicationId && !d.IsDeleted);

                if (document == null)
                {
                    return ApiResponse<bool>.Fail("Document not found", 404);
                }

                // Soft delete
                document.IsDeleted = true;
                document.UpdatedAt = DateTime.UtcNow;
                
                await _dbContext.SaveChangesAsync();

                // Delete physical file
                var filePath = Path.Combine(_uploadsDirectory, $"{document.FileGuid}{document.FileExtension}");
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                return ApiResponse<bool>.Ok(true, "Document deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.Fail($"Error deleting document: {ex.Message}", 500);
            }
        }

        public async Task<ApiResponse<DocumentDto>> ReviewDocumentAsync(int applicationId, int documentId, DocumentReviewRequest request)
        {
            try
            {
                var document = await _dbContext.Documents
                    .FirstOrDefaultAsync(d => d.Id == documentId && d.ApplicationId == applicationId && !d.IsDeleted);

                if (document == null)
                {
                    return ApiResponse<DocumentDto>.Fail("Document not found", 404);
                }

                // Validate status
                var status = request.Status?.ToLowerInvariant();
                if (status != "approved" && status != "rejected")
                {
                    return ApiResponse<DocumentDto>.Fail("Invalid status. Must be 'approved' or 'rejected'", 400);
                }

                // Update document
                document.Status = status.Equals("approved", StringComparison.OrdinalIgnoreCase) ? "Approved" : "Rejected";
                document.ReviewReason = request.Reason;
                document.ReviewedAt = DateTime.UtcNow;
                // ReviewedBy should be set from authenticated user context in controller
                
                await _dbContext.SaveChangesAsync();

                // Return updated document
                var documentDto = new DocumentDto
                {
                    Id = document.Id,
                    ApplicationId = document.ApplicationId,
                    DocumentType = document.DocumentType,
                    FileName = document.FileName,
                    FileExtension = document.FileExtension,
                    FileGuid = document.FileGuid,
                    FileSize = document.FileSize,
                    MimeType = document.MimeType,
                    Status = document.Status,
                    ReviewReason = document.ReviewReason,
                    ReviewedBy = document.ReviewedBy,
                    ReviewedAt = document.ReviewedAt,
                    CreatedAt = document.CreatedAt
                };

                return ApiResponse<DocumentDto>.Ok(documentDto, $"Document {document.Status.ToLowerInvariant()} successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<DocumentDto>.Fail($"Error reviewing document: {ex.Message}", 500);
            }
        }

        public async Task<ApiResponse<byte[]>> GetDocumentFileAsync(int documentId)
        {
            try
            {
                var document = await _dbContext.Documents
                    .FirstOrDefaultAsync(d => d.Id == documentId && !d.IsDeleted);

                if (document == null)
                {
                    return ApiResponse<byte[]>.Fail("Document not found", 404);
                }

                var filePath = Path.Combine(_uploadsDirectory, $"{document.FileGuid}.{document.FileExtension}");
                
                if (!File.Exists(filePath))
                {
                    return ApiResponse<byte[]>.Fail("File not found on disk", 404);
                }

                var fileBytes = await File.ReadAllBytesAsync(filePath);
                
                return ApiResponse<byte[]>.Ok(fileBytes, "File retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<byte[]>.Fail($"Error retrieving document file: {ex.Message}", 500);
            }
        }
    }
}