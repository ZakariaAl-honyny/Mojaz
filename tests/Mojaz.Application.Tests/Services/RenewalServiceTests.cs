using System;
using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using Mojaz.Application.DTOs.Renewal;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Moq;
using Xunit;

namespace Mojaz.Application.Tests.Services;

public class RenewalServiceTests
{
    private readonly Mock<IRepository<License>> _licenseRepositoryMock;
    private readonly Mock<IRepository<RenewalApplication>> _renewalApplicationRepositoryMock;
    private readonly Mock<IRepository<LicenseCategory>> _licenseCategoryRepositoryMock;
    private readonly Mock<IRepository<FeeStructure>> _feeStructureRepositoryMock;
    private readonly Mock<IRepository<Application>> _applicationRepositoryMock;
    private readonly Mock<IRepository<User>> _userRepositoryMock;
    private readonly Mock<IRepository<MedicalExamination>> _medicalExaminationRepositoryMock;
    private readonly Mock<IRepository<PaymentTransaction>> _paymentRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILicensePdfGenerator> _licensePdfGeneratorMock;
    private readonly Mock<IFileStorageService> _fileStorageServiceMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<ISystemSettingsService> _systemSettingsServiceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<Microsoft.Extensions.Logging.ILogger<RenewalService>> _loggerMock;
    private readonly RenewalService _service;

    public RenewalServiceTests()
    {
        _licenseRepositoryMock = new Mock<IRepository<License>>();
        _renewalApplicationRepositoryMock = new Mock<IRepository<RenewalApplication>>();
        _licenseCategoryRepositoryMock = new Mock<IRepository<LicenseCategory>>();
        _feeStructureRepositoryMock = new Mock<IRepository<FeeStructure>>();
        _applicationRepositoryMock = new Mock<IRepository<Application>>();
        _userRepositoryMock = new Mock<IRepository<User>>();
        _medicalExaminationRepositoryMock = new Mock<IRepository<MedicalExamination>>();
        _paymentRepositoryMock = new Mock<IRepository<PaymentTransaction>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _licensePdfGeneratorMock = new Mock<ILicensePdfGenerator>();
        _fileStorageServiceMock = new Mock<IFileStorageService>();
        _notificationServiceMock = new Mock<INotificationService>();
        _systemSettingsServiceMock = new Mock<ISystemSettingsService>();
        _mapperMock = new Mock<IMapper>();
        _loggerMock = new Mock<Microsoft.Extensions.Logging.ILogger<RenewalService>>();

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
            ApplicantId = applicantId,
            LicenseCategoryId = categoryId,
            Status = LicenseStatus.Active,
            ExpiryDate = DateTime.UtcNow.AddDays(30)
        };

        _licenseRepositoryMock
            .Setup(x => x.GetAsync(It.IsAny<Guid>(), It.IsAny<bool>()))
            .ReturnsAsync(license);

        _systemSettingsServiceMock
            .Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<bool>()))
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
            ApplicantId = applicantId,
            LicenseCategoryId = categoryId,
            Status = LicenseStatus.Expired,
            ExpiryDate = DateTime.UtcNow.AddDays(-180)
        };

        _licenseRepositoryMock
            .Setup(x => x.GetAsync(It.IsAny<Guid>(), It.IsAny<bool>()))
            .ReturnsAsync(license);

        _systemSettingsServiceMock
            .Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<bool>()))
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
            Status = LicenseStatus.Active,
            ExpiryDate = DateTime.UtcNow.AddDays(30)
        };

        _licenseRepositoryMock
            .Setup(x => x.GetAsync(It.IsAny<Guid>(), It.IsAny<bool>()))
            .ReturnsAsync(license);

        _renewalApplicationRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<RenewalApplication>()))
            .ReturnsAsync((RenewalApplication r) => r);

        _unitOfWorkMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<bool>()))
            .ReturnsAsync(1);

        // Act
        var result = await _service.CreateRenewalAsync(request, applicantId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
    }
}