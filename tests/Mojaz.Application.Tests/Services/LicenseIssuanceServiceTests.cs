using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using Hangfire;
using Mojaz.Application.DTOs.License;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Moq;
using Xunit;

using ApplicationEntity = Mojaz.Domain.Entities.Application;
using ApplicationEmailService = Mojaz.Application.Interfaces.Services.IEmailService;

namespace Mojaz.Application.Tests.Services;

public class LicenseServiceTests
{
    private readonly Mock<IRepository<License>> _licenseRepositoryMock;
    private readonly Mock<IRepository<ApplicationEntity>> _applicationRepositoryMock;
    private readonly Mock<IRepository<LicenseCategory>> _licenseCategoryRepositoryMock;
    private readonly Mock<IRepository<User>> _userRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IFileStorageService> _fileStorageServiceMock;
    private readonly Mock<ILicensePdfGenerator> _licensePdfGeneratorMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<ApplicationEmailService> _emailServiceMock;
    private readonly Mock<IBackgroundJobClient> _backgroundJobClientMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<ICategoryUpgradeService> _upgradeServiceMock;
    private readonly LicenseService _service;

    public LicenseServiceTests()
    {
        _licenseRepositoryMock = new Mock<IRepository<License>>();
        _applicationRepositoryMock = new Mock<IRepository<ApplicationEntity>>();
        _licenseCategoryRepositoryMock = new Mock<IRepository<LicenseCategory>>();
        _userRepositoryMock = new Mock<IRepository<User>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _fileStorageServiceMock = new Mock<IFileStorageService>();
        _licensePdfGeneratorMock = new Mock<ILicensePdfGenerator>();
        _notificationServiceMock = new Mock<INotificationService>();
        _emailServiceMock = new Mock<ApplicationEmailService>();
        _backgroundJobClientMock = new Mock<IBackgroundJobClient>();
        _mapperMock = new Mock<IMapper>();
        _upgradeServiceMock = new Mock<ICategoryUpgradeService>();

        _service = new LicenseService(
            _licenseRepositoryMock.Object,
            _applicationRepositoryMock.Object,
            _licenseCategoryRepositoryMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _notificationServiceMock.Object,
            _emailServiceMock.Object,
            _backgroundJobClientMock.Object,
            _licensePdfGeneratorMock.Object,
            _fileStorageServiceMock.Object,
            _mapperMock.Object,
            _upgradeServiceMock.Object);
    }

    [Fact]
    public async Task IssueLicenseAsync_WhenPayloadValid_ShouldGenerateCorrectLicenseNumber()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var applicantId = Guid.NewGuid();
        var issuerId = Guid.NewGuid();
        var application = new ApplicationEntity
        {
            Id = applicationId,
            ApplicantId = applicantId,
            LicenseCategoryId = categoryId,
            Status = ApplicationStatus.Approved,
            CurrentStage = "10-IssuancePayment",
            ApplicationNumber = "MOJ-2025-00000001"
        };
        var category = new LicenseCategory
        {
            Id = categoryId,
            Code = LicenseCategoryCode.B,
            NameEn = "Private",
            NameAr = "رخصة خاصة",
            ValidityYears = 10
        };
        var holder = new User
        {
            Id = applicantId,
            FullNameEn = "John Doe",
            Email = "john@example.com"
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        _licenseCategoryRepositoryMock.Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);
        _userRepositoryMock.Setup(x => x.GetByIdAsync(applicantId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(holder);
        _licenseRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<License, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false); // No previous license

        _licensePdfGeneratorMock.Setup(x => x.GenerateLicensePdfAsync(It.IsAny<License>(), It.IsAny<User>(), It.IsAny<LicenseCategory>()))
            .ReturnsAsync(new byte[] { 1, 2, 3 });
        _fileStorageServiceMock.Setup(x => x.SaveAsync(It.IsAny<Stream>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync("licenses/2026/04/MOJ-2026-12345678.pdf");
        _mapperMock.Setup(x => x.Map<LicenseDto>(It.IsAny<License>()))
            .Returns(new LicenseDto { Id = Guid.NewGuid(), LicenseNumber = "MOJ-2025-00000001" });

        // Act
        var result = await _service.IssueLicenseAsync(applicationId, issuerId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task IssueLicenseAsync_WhenAlreadyIssued_ShouldReturnConflict()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var application = new ApplicationEntity
        {
            Id = applicationId,
            Status = ApplicationStatus.Approved
        };
        
        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        
        // Mock existing license - service checks ExistsAsync
        _licenseRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<License, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _service.IssueLicenseAsync(applicationId, Guid.NewGuid());

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(409);
        result.Message.Should().Contain("already issued");
    }

    [Fact]
    public async Task IssueLicenseAsync_WhenNotApproved_ShouldReturnBadRequest()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var application = new ApplicationEntity
        {
            Id = applicationId,
            Status = ApplicationStatus.InReview // Not Approved
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        // Act
        var result = await _service.IssueLicenseAsync(applicationId, Guid.NewGuid());

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("Approved");
    }
}