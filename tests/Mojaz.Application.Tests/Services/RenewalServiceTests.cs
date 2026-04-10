using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.Renewal;
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

namespace Mojaz.Application.Tests.Services;

public class RenewalServiceTests
{
    private readonly Mock<IRepository<License>> _licenseRepositoryMock;
    private readonly Mock<IRepository<RenewalApplication>> _renewalApplicationRepositoryMock;
    private readonly Mock<IRepository<LicenseCategory>> _licenseCategoryRepositoryMock;
    private readonly Mock<IRepository<FeeStructure>> _feeStructureRepositoryMock;
    private readonly Mock<IRepository<ApplicationEntity>> _applicationRepositoryMock;
    private readonly Mock<IRepository<User>> _userRepositoryMock;
    private readonly Mock<IRepository<MedicalExamination>> _medicalExaminationRepositoryMock;
    private readonly Mock<IRepository<PaymentTransaction>> _paymentRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILicensePdfGenerator> _licensePdfGeneratorMock;
    private readonly Mock<IFileStorageService> _fileStorageServiceMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<ISystemSettingsService> _systemSettingsServiceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<ILogger<RenewalService>> _loggerMock;
    private readonly RenewalService _service;

    public RenewalServiceTests()
    {
        _licenseRepositoryMock = new Mock<IRepository<License>>();
        _renewalApplicationRepositoryMock = new Mock<IRepository<RenewalApplication>>();
        _licenseCategoryRepositoryMock = new Mock<IRepository<LicenseCategory>>();
        _feeStructureRepositoryMock = new Mock<IRepository<FeeStructure>>();
        _applicationRepositoryMock = new Mock<IRepository<ApplicationEntity>>();
        _userRepositoryMock = new Mock<IRepository<User>>();
        _medicalExaminationRepositoryMock = new Mock<IRepository<MedicalExamination>>();
        _paymentRepositoryMock = new Mock<IRepository<PaymentTransaction>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _licensePdfGeneratorMock = new Mock<ILicensePdfGenerator>();
        _fileStorageServiceMock = new Mock<IFileStorageService>();
        _notificationServiceMock = new Mock<INotificationService>();
        _systemSettingsServiceMock = new Mock<ISystemSettingsService>();
        _mapperMock = new Mock<IMapper>();
        _loggerMock = new Mock<ILogger<RenewalService>>();

        _service = new RenewalService(
            _licenseRepositoryMock.Object,
            _renewalApplicationRepositoryMock.Object,
            _licenseCategoryRepositoryMock.Object,
            _feeStructureRepositoryMock.Object,
            _applicationRepositoryMock.Object,
            _userRepositoryMock.Object,
            _medicalExaminationRepositoryMock.Object,
            _paymentRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _licensePdfGeneratorMock.Object,
            _fileStorageServiceMock.Object,
            _notificationServiceMock.Object,
            _systemSettingsServiceMock.Object,
            _mapperMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task ValidateEligibilityAsync_WithValidActiveLicense_ReturnsEligible()
    {
        // Arrange
        var applicantId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var license = new License
        {
            Id = Guid.NewGuid(),
            HolderId = applicantId,
            LicenseCategoryId = categoryId,
            Status = LicenseStatus.Active,
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };

        _licenseRepositoryMock
            .Setup(x => x.FindAsync(It.IsAny<Expression<Func<License, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new System.Collections.Generic.List<License> { license });

        _systemSettingsServiceMock
            .Setup(x => x.GetAsync(It.IsAny<string>()))
            .ReturnsAsync("90");

        // Act
        var result = await _service.ValidateEligibilityAsync(applicantId, categoryId);

        // Assert
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task ValidateEligibilityAsync_WithExpiredLicenseOutsideGracePeriod_ReturnsNotEligible()
    {
        // Arrange
        var applicantId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var license = new License
        {
            Id = Guid.NewGuid(),
            HolderId = applicantId,
            LicenseCategoryId = categoryId,
            Status = LicenseStatus.Expired,
            ExpiresAt = DateTime.UtcNow.AddDays(-180)
        };

        _licenseRepositoryMock
            .Setup(x => x.FindAsync(It.IsAny<Expression<Func<License, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new System.Collections.Generic.List<License> { license });

        _systemSettingsServiceMock
            .Setup(x => x.GetAsync(It.IsAny<string>()))
            .ReturnsAsync("90");

        // Act
        var result = await _service.ValidateEligibilityAsync(applicantId, categoryId);

        // Assert
        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task CreateRenewalAsync_WithValidRequest_ReturnsCreatedApplication()
    {
        // Arrange
        var request = new CreateRenewalRequest
        {
            OldLicenseId = Guid.NewGuid(),
            LicenseCategoryId = Guid.NewGuid()
        };
        var applicantId = Guid.NewGuid();

        var license = new License
        {
            Id = request.OldLicenseId,
            HolderId = applicantId,
            Status = LicenseStatus.Active,
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };

        _licenseRepositoryMock
            .Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(license);

        _licenseCategoryRepositoryMock
            .Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LicenseCategory { Id = request.LicenseCategoryId });

        _renewalApplicationRepositoryMock
            .Setup(x => x.FindAsync(It.IsAny<Expression<Func<RenewalApplication, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new System.Collections.Generic.List<RenewalApplication>());

        _renewalApplicationRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<RenewalApplication>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((RenewalApplication r, CancellationToken _) => r);

        _unitOfWorkMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _service.CreateRenewalAsync(request);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeEmpty();
    }

    [Fact]
    public async Task IssueLicenseAsync_WithValidRenewal_DeactivatesOldLicense()
    {
        // Arrange
        var holder = new User { Id = Guid.NewGuid(), FullNameAr = "Test User" };
        var category = new LicenseCategory { Id = Guid.NewGuid(), NameAr = "B", NameEn = "B", Code = LicenseCategoryCode.B, ValidityYears = 10 };
        var oldLicense = new License
        {
            Id = Guid.NewGuid(),
            HolderId = holder.Id,
            LicenseCategoryId = category.Id,
            LicenseNumber = "MOJ-2025-12345678",
            Status = LicenseStatus.Active,
            IssuedAt = DateTime.UtcNow.AddYears(-5),
            ExpiresAt = DateTime.UtcNow.AddYears(5)
        };
        
        var renewalApplication = new RenewalApplication
        {
            Id = Guid.NewGuid(),
            ApplicantId = holder.Id,
            OldLicenseId = oldLicense.Id,
            LicenseCategoryId = category.Id,
            MedicalExaminationId = Guid.NewGuid(),
            RenewalFeePaid = true,
            Status = ApplicationStatus.Payment
        };
        
        _renewalApplicationRepositoryMock
            .Setup(x => x.GetByIdAsync(renewalApplication.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(renewalApplication);
        
        _licenseRepositoryMock
            .Setup(x => x.GetByIdAsync(oldLicense.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(oldLicense);
        
        _licenseCategoryRepositoryMock
            .Setup(x => x.GetByIdAsync(category.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);
        
        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(holder.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(holder);
        
        _licensePdfGeneratorMock
            .Setup(x => x.GenerateLicensePdfAsync(It.IsAny<License>(), It.IsAny<User>(), It.IsAny<LicenseCategory>()))
            .ReturnsAsync(new byte[] { 1, 2, 3 });
        
        _fileStorageServiceMock
            .Setup(x => x.SaveAsync(It.IsAny<System.IO.Stream>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync("https://blob.com/license.pdf");
        
        _unitOfWorkMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
        
        // Act
        var result = await _service.IssueLicenseAsync(renewalApplication.Id);
        
        // Assert
        result.Success.Should().BeTrue();
        
        // Verify old license was updated to Renewed status
        _licenseRepositoryMock.Verify(
            x => x.Update(It.Is<License>(l => 
                l.Id == oldLicense.Id && 
                l.Status == LicenseStatus.Renewed)),
            Times.Once);
    }
}