using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.LicenseReplacement;
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

public class ReplaceLicenseServiceTests
{
    private readonly Mock<IRepository<License>> _licenseRepositoryMock;
    private readonly Mock<IRepository<ApplicationEntity>> _applicationRepositoryMock;
    private readonly Mock<IRepository<LicenseReplacement>> _replacementRepositoryMock;
    private readonly Mock<IRepository<FeeStructure>> _feeStructureRepositoryMock;
    private readonly Mock<IRepository<PaymentTransaction>> _paymentRepositoryMock;
    private readonly Mock<IRepository<LicenseCategory>> _licenseCategoryRepositoryMock;
    private readonly Mock<IRepository<User>> _userRepositoryMock;
    private readonly Mock<IRepository<ApplicationDocument>> _documentRepositoryMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<ILogger<ReplaceLicenseService>> _loggerMock;
    private readonly ReplaceLicenseService _service;

    public ReplaceLicenseServiceTests()
    {
        _licenseRepositoryMock = new Mock<IRepository<License>>();
        _applicationRepositoryMock = new Mock<IRepository<ApplicationEntity>>();
        _replacementRepositoryMock = new Mock<IRepository<LicenseReplacement>>();
        _feeStructureRepositoryMock = new Mock<IRepository<FeeStructure>>();
        _paymentRepositoryMock = new Mock<IRepository<PaymentTransaction>>();
        _licenseCategoryRepositoryMock = new Mock<IRepository<LicenseCategory>>();
        _userRepositoryMock = new Mock<IRepository<User>>();
        _documentRepositoryMock = new Mock<IRepository<ApplicationDocument>>();
        _notificationServiceMock = new Mock<INotificationService>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _mapperMock = new Mock<IMapper>();
        _loggerMock = new Mock<ILogger<ReplaceLicenseService>>();

        _service = new ReplaceLicenseService(
            _licenseRepositoryMock.Object,
            _applicationRepositoryMock.Object,
            _replacementRepositoryMock.Object,
            _feeStructureRepositoryMock.Object,
            _paymentRepositoryMock.Object,
            _licenseCategoryRepositoryMock.Object,
            _userRepositoryMock.Object,
            _documentRepositoryMock.Object,
            _notificationServiceMock.Object,
            _unitOfWorkMock.Object,
            _mapperMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task CheckEligibilityAsync_WithActiveLicense_ReturnsEligible()
    {
        // Arrange
        var applicantId = Guid.NewGuid();
        var licenseId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var license = new License
        {
            Id = licenseId,
            HolderId = applicantId,
            LicenseCategoryId = categoryId,
            Status = LicenseStatus.Active,
            LicenseNumber = "MOJ-2025-12345678",
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };

        _licenseRepositoryMock
            .Setup(x => x.FindAsync(It.IsAny<Expression<Func<License, bool>>>(), It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync(new System.Collections.Generic.List<License> { license });

        _licenseCategoryRepositoryMock
            .Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync(new LicenseCategory { Id = categoryId, NameAr = "خصاصة", NameEn = "Private" });

        // Act
        var result = await _service.CheckEligibilityAsync(applicantId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data.IsEligible.Should().BeTrue();
        result.Data.LicenseId.Should().Be(licenseId);
        result.Data.LicenseNumber.Should().Be(license.LicenseNumber);
    }

    [Fact]
    public async Task CheckEligibilityAsync_NoActiveLicense_ReturnsNotEligible()
    {
        // Arrange
        var applicantId = Guid.NewGuid();

        _licenseRepositoryMock
            .Setup(x => x.FindAsync(It.IsAny<Expression<Func<License, bool>>>(), It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync(new System.Collections.Generic.List<License>());

        // Act
        var result = await _service.CheckEligibilityAsync(applicantId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("No active license found");
    }

    [Fact]
    public async Task CheckEligibilityAsync_ExpiredLicense_ReturnsNotEligible()
    {
        // Arrange
        var applicantId = Guid.NewGuid();
        var license = new License
        {
            Id = Guid.NewGuid(),
            HolderId = applicantId,
            Status = LicenseStatus.Expired,
            ExpiresAt = DateTime.UtcNow.AddDays(-30)
        };

        _licenseRepositoryMock
            .Setup(x => x.FindAsync(
                It.IsAny<Expression<Func<License, bool>>>(),
                It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync(new System.Collections.Generic.List<License>());

        // Act
        var result = await _service.CheckEligibilityAsync(applicantId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("No active license found");
    }

    [Fact]
    public async Task CreateReplacementAsync_ValidRequest_CreatesApplication()
    {
        // Arrange
        var request = new CreateReplacementRequest
        {
            LicenseId = Guid.NewGuid(),
            Reason = ReplacementReason.Lost
        };
        var applicantId = Guid.NewGuid();

        var license = new License
        {
            Id = request.LicenseId,
            HolderId = applicantId,
            Status = LicenseStatus.Active,
            LicenseCategoryId = Guid.NewGuid(),
            LicenseNumber = "MOJ-2025-12345678"
        };

        var category = new LicenseCategory
        {
            Id = license.LicenseCategoryId,
            NameAr = "خصاصة",
            NameEn = "Private"
        };

        _licenseRepositoryMock
            .Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync(license);

        _licenseCategoryRepositoryMock
            .Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync(category);

        _replacementRepositoryMock
            .Setup(x => x.FindAsync(It.IsAny<Expression<Func<LicenseReplacement, bool>>>(), It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync(new System.Collections.Generic.List<LicenseReplacement>());

        _applicationRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<ApplicationEntity>(), It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync((ApplicationEntity a, System.Threading.CancellationToken _) => 
            {
                a.Id = Guid.NewGuid(); // Simulate database generating ID
                return a;
            });

        _replacementRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<LicenseReplacement>(), It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync((LicenseReplacement r, System.Threading.CancellationToken _) => 
            {
                r.Id = Guid.NewGuid(); // Simulate database generating ID
                return r;
            });

        _unitOfWorkMock
            .Setup(x => x.SaveChangesAsync(It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _service.CreateReplacementAsync(request, applicantId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBe(Guid.Empty);
        result.Message.Should().Contain("created successfully");

        // Verify Application was created with ServiceType = Replacement
        _applicationRepositoryMock.Verify(
            x => x.AddAsync(It.Is<ApplicationEntity>(a =>
                a.ServiceType == ServiceType.Replacement &&
                a.ApplicantId == applicantId),
                It.IsAny<System.Threading.CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task CreateReplacementAsync_InactiveLicense_ReturnsError()
    {
        // Arrange
        var request = new CreateReplacementRequest
        {
            LicenseId = Guid.NewGuid(),
            Reason = ReplacementReason.Damaged
        };
        var applicantId = Guid.NewGuid();

        var license = new License
        {
            Id = request.LicenseId,
            HolderId = applicantId,
            Status = LicenseStatus.Expired, // Inactive status
            LicenseCategoryId = Guid.NewGuid()
        };

        _licenseRepositoryMock
            .Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<System.Threading.CancellationToken>()))
            .ReturnsAsync(license);

        // Act
        var result = await _service.CreateReplacementAsync(request, applicantId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("Only active licenses can be replaced");
    }
}