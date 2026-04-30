using Mojaz.Application.Interfaces.Security;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using FluentAssertions;
using Moq;
using Microsoft.AspNetCore.Http;
using Mojaz.Application.DTOs.Document;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Hangfire;
using Xunit;

using ApplicationEntity = Mojaz.Domain.Entities.Application;
using IEmailService = Mojaz.Application.Interfaces.Services.IEmailService;

namespace Mojaz.Application.Tests;

public class DocumentServiceTests
{
    private readonly Mock<IRepository<ApplicationDocument>> _documentRepo = new();
    private readonly Mock<IRepository<ApplicationEntity>> _applicationRepo = new();
    private readonly Mock<IRepository<User>> _userRepo = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly Mock<IAuditService> _auditService = new();
    private readonly Mock<IEmailService> _emailService = new();
    private readonly Mock<IBackgroundJobClient> _backgroundJobClient = new();
    private readonly Mock<IFileStorageService> _fileStorageService = new();
    private readonly Mock<ISystemSettingsService> _systemSettingsService = new();
    private readonly Mock<IFileValidationService> _fileValidationService = new();

    private DocumentService CreateService() => new(
        _documentRepo.Object,
        _applicationRepo.Object,
        _userRepo.Object,
        _unitOfWork.Object,
        _auditService.Object,
        _emailService.Object,
        _backgroundJobClient.Object,
        _fileStorageService.Object,
        _systemSettingsService.Object,
        _fileValidationService.Object
    );

    #region Upload Tests

    [Fact]
    public async Task UploadAsync_ValidRequest_ReturnsSuccess()
    {
        // Arrange
        var service = CreateService();
        var applicationId = 1;
        var userId = 2;
        
        var application = new ApplicationEntity
        {
            Id = applicationId,
            ApplicantId = userId,
            Status = ApplicationStatus.Draft
        };

        _applicationRepo.Setup(r => r.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        
        _systemSettingsService.Setup(r => r.GetAsync(It.IsAny<string>()))
            .ReturnsAsync("5");

        var file = new Mock<IFormFile>();
        file.Setup(f => f.FileName).Returns("test.pdf");
        file.Setup(f => f.Length).Returns(1024);
        file.Setup(f => f.ContentType).Returns("application/pdf");
        file.Setup(f => f.OpenReadStream()).Returns(new MemoryStream(new byte[1024]));

        _fileStorageService.Setup(s => s.SaveAsync(It.IsAny<Stream>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync("uploads/2025/test.pdf");
            
        // Fix: Correctly mock the file validation service methods
        _fileValidationService.Setup(v => v.ValidateSizeAsync(It.IsAny<long>()))
            .ReturnsAsync(true);
        _fileValidationService.Setup(v => v.ValidateSignatureAsync(It.IsAny<Stream>(), It.IsAny<string>()))
            .ReturnsAsync(true);

        var request = new UploadDocumentRequest
        {
            DocumentType = DocumentType.IdCopy,
            File = file.Object
        };

        // Act
        var result = await service.UploadAsync(applicationId, request, userId);

        // Assert
        result.Success.Should().BeTrue();
        result.StatusCode.Should().BeGreaterOrEqualTo(200);
    }

    [Fact]
    public async Task UploadAsync_FileTooLarge_ReturnsBadRequest()
    {
        // Arrange
        var service = CreateService();
        var applicationId = 3;
        var userId = 4;
        
        var application = new ApplicationEntity
        {
            Id = applicationId,
            ApplicantId = userId,
            Status = ApplicationStatus.Draft
        };

        _applicationRepo.Setup(r => r.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        
        _systemSettingsService.Setup(r => r.GetAsync(It.IsAny<string>()))
            .ReturnsAsync("5");

        var file = new Mock<IFormFile>();
        file.Setup(f => f.FileName).Returns("test.pdf");
        file.Setup(f => f.Length).Returns(10 * 1024 * 1024); // 10MB

        var request = new UploadDocumentRequest
        {
            DocumentType = DocumentType.IdCopy,
            File = file.Object
        };

        // Act
        var result = await service.UploadAsync(applicationId, request, userId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task UploadAsync_InvalidExtension_ReturnsBadRequest()
    {
        // Arrange
        var service = CreateService();
        var applicationId = 5;
        var userId = 6;
        
        var application = new ApplicationEntity
        {
            Id = applicationId,
            ApplicantId = userId,
            Status = ApplicationStatus.Draft
        };

        _applicationRepo.Setup(r => r.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        var file = new Mock<IFormFile>();
        file.Setup(f => f.FileName).Returns("test.exe");
        file.Setup(f => f.Length).Returns(1024);

        var request = new UploadDocumentRequest
        {
            DocumentType = DocumentType.IdCopy,
            File = file.Object
        };

        // Act
        var result = await service.UploadAsync(applicationId, request, userId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task UploadAsync_WrongOwner_ReturnsForbidden()
    {
        // Arrange
        var service = CreateService();
        var applicationId = 7;
        var userId = 8;
        var otherUserId = 9;
        
        var application = new ApplicationEntity
        {
            Id = applicationId,
            ApplicantId = otherUserId, // Different owner
            Status = ApplicationStatus.Draft
        };

        _applicationRepo.Setup(r => r.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        var file = new Mock<IFormFile>();
        file.Setup(f => f.FileName).Returns("test.pdf");
        file.Setup(f => f.Length).Returns(1024);

        var request = new UploadDocumentRequest
        {
            DocumentType = DocumentType.IdCopy,
            File = file.Object
        };

        // Act
        var result = await service.UploadAsync(applicationId, request, userId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(403);
    }

    #endregion

    #region Review Tests

    [Fact]
    public async Task ReviewAsync_ValidApprove_ReturnsSuccess()
    {
        // Arrange
        var service = CreateService();
        var documentId = 10;
        var reviewerId = 11;

        var document = new ApplicationDocument
        {
            Id = documentId,
            ApplicationId = 12,
            Status = DocumentStatus.Pending
        };

        _documentRepo.Setup(r => r.GetByIdAsync(documentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(document);

        var request = new DocumentReviewRequest { Approved = true };

        // Act
        var result = await service.ReviewAsync(documentId, request, reviewerId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data!.Status.Should().Be(DocumentStatus.Approved);
    }

    [Fact]
    public async Task ReviewAsync_RejectWithoutReason_ReturnsBadRequest()
    {
        // Arrange
        var service = CreateService();
        var documentId = 13;
        var reviewerId = 14;

        var document = new ApplicationDocument
        {
            Id = documentId,
            ApplicationId = 15,
            Status = DocumentStatus.Pending
        };

        _documentRepo.Setup(r => r.GetByIdAsync(documentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(document);

        var request = new DocumentReviewRequest { Approved = false, RejectionReason = "" };

        // Act
        var result = await service.ReviewAsync(documentId, request, reviewerId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task ReviewAsync_ValidReject_ReturnsSuccess()
    {
        // Arrange
        var service = CreateService();
        var documentId = 16;
        var reviewerId = 17;

        var document = new ApplicationDocument
        {
            Id = documentId,
            ApplicationId = 18,
            Status = DocumentStatus.Pending
        };

        _documentRepo.Setup(r => r.GetByIdAsync(documentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(document);

        var request = new DocumentReviewRequest 
        { 
            Approved = false, 
            RejectionReason = "Document is blurry" 
        };

        // Act
        var result = await service.ReviewAsync(documentId, request, reviewerId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data!.Status.Should().Be(DocumentStatus.Rejected);
        result.Data.RejectionReason.Should().Be("Document is blurry");
    }

    #endregion

    #region Bulk Approve Tests

    [Fact]
    public async Task BulkApproveAsync_HasPendingDocuments_ApprovesAll()
    {
        // Arrange
        var service = CreateService();
        var applicationId = 19;
        var reviewerId = 20;

        var application = new ApplicationEntity
        {
            Id = applicationId,
            Status = ApplicationStatus.Draft
        };

        var pendingDocs = new List<ApplicationDocument>
        {
            new ApplicationDocument { Id = 21, ApplicationId = applicationId, Status = DocumentStatus.Pending },
            new ApplicationDocument { Id = 22, ApplicationId = applicationId, Status = DocumentStatus.Pending }
        };

        _applicationRepo.Setup(r => r.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        
        _documentRepo.Setup(r => r.FindAsync(It.IsAny<System.Linq.Expressions.Expression<Func<ApplicationDocument, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(pendingDocs);

        // Act
        var result = await service.BulkApproveAsync(applicationId, reviewerId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data!.ApprovedCount.Should().Be(2);
    }

    [Fact]
    public async Task BulkApproveAsync_NoPendingDocuments_ReturnsZero()
    {
        // Arrange
        var service = CreateService();
        var applicationId = 23;
        var reviewerId = 24;

        var application = new ApplicationEntity { Id = applicationId };
        
        _applicationRepo.Setup(r => r.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        
        _documentRepo.Setup(r => r.FindAsync(It.IsAny<System.Linq.Expressions.Expression<Func<ApplicationDocument, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ApplicationDocument>());

        // Act
        var result = await service.BulkApproveAsync(applicationId, reviewerId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data!.ApprovedCount.Should().Be(0);
    }

    #endregion

    #region Delete Tests

    [Fact]
    public async Task DeleteAsync_BeforeSubmission_ReturnsSuccess()
    {
        // Arrange
        var service = CreateService();
        var documentId = 25;
        var userId = 26;
        var applicationId = 27;

        var document = new ApplicationDocument
        {
            Id = documentId,
            ApplicationId = applicationId,
            Status = DocumentStatus.Pending
        };

        var application = new ApplicationEntity
        {
            Id = applicationId,
            ApplicantId = userId,
            Status = ApplicationStatus.Draft
        };

        _documentRepo.Setup(r => r.GetByIdAsync(documentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(document);
        _applicationRepo.Setup(r => r.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        // Act
        var result = await service.DeleteAsync(documentId, userId);

        // Assert
        result.Success.Should().BeTrue();
        document.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteAsync_AfterSubmission_ReturnsForbidden()
    {
        // Arrange
        var service = CreateService();
        var documentId = 28;
        var userId = 29;
        var applicationId = 30;

        var document = new ApplicationDocument
        {
            Id = documentId,
            ApplicationId = applicationId,
            Status = DocumentStatus.Pending
        };

        var application = new ApplicationEntity
        {
            Id = applicationId,
            ApplicantId = userId,
            Status = ApplicationStatus.Submitted // Already submitted
        };

        _documentRepo.Setup(r => r.GetByIdAsync(documentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(document);
        _applicationRepo.Setup(r => r.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        // Act
        var result = await service.DeleteAsync(documentId, userId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(403);
    }

    #endregion

    #region Requirements Tests

    [Fact]
    public async Task GetRequirementsAsync_MinorApplicant_ReturnsGuardianConsentRequired()
    {
        // Arrange
        var service = CreateService();
        var applicationId = 31;
        var userId = 32;

        var application = new ApplicationEntity
        {
            Id = applicationId,
            ApplicantId = userId
        };

        var user = new User
        {
            Id = userId,
            DateOfBirth = DateTime.UtcNow.AddYears(-16) // Minor
        };

        _applicationRepo.Setup(r => r.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        _userRepo.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _documentRepo.Setup(r => r.FindAsync(It.IsAny<System.Linq.Expressions.Expression<Func<ApplicationDocument, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ApplicationDocument>());

        // Act
        var result = await service.GetRequirementsAsync(applicationId, userId, "Applicant");

        // Assert
        result.Success.Should().BeTrue();
        var guardianReq = result.Data!.First(r => r.DocumentType == DocumentType.GuardianConsent);
        guardianReq.IsRequired.Should().BeTrue();
    }

    [Fact]
    public async Task GetRequirementsAsync_AdultApplicant_ReturnsGuardianConsentNotRequired()
    {
        // Arrange
        var service = CreateService();
        var applicationId = 33;
        var userId = 34;

        var application = new ApplicationEntity
        {
            Id = applicationId,
            ApplicantId = userId
        };

        var user = new User
        {
            Id = userId,
            DateOfBirth = DateTime.UtcNow.AddYears(-25) // Adult
        };

        _applicationRepo.Setup(r => r.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        _userRepo.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _documentRepo.Setup(r => r.FindAsync(It.IsAny<System.Linq.Expressions.Expression<Func<ApplicationDocument, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ApplicationDocument>());

        // Act
        var result = await service.GetRequirementsAsync(applicationId, userId, "Applicant");

        // Assert
        result.Success.Should().BeTrue();
        var guardianReq = result.Data!.First(r => r.DocumentType == DocumentType.GuardianConsent);
        guardianReq.IsRequired.Should().BeFalse();
    }

    #endregion
}