using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.LicenseReplacement;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Infrastructure.Interfaces;
using Mojaz.Shared;
using Moq;
using Xunit;

namespace Mojaz.Application.Tests.Services;

public class ReplaceLicenseServiceTests
{
    private readonly Mock<IRepository<License>> _licenseRepositoryMock;
    private readonly Mock<IRepository<Application>> _applicationRepositoryMock;
    private readonly Mock<IRepository<LicenseReplacement>> _replacementRepositoryMock;
    private readonly Mock<IRepository<FeeStructure>> _feeStructureRepositoryMock;
    private readonly Mock<IRepository<PaymentTransaction>> _paymentRepositoryMock;
    private readonly Mock<IRepository<LicenseCategory>> _licenseCategoryRepositoryMock;
    private readonly Mock<IRepository<User>> _userRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<ILogger<ReplaceLicenseService>> _loggerMock;
    private readonly ReplaceLicenseService _service;

    public ReplaceLicenseServiceTests()
    {
        _licenseRepositoryMock = new Mock<IRepository<License>>();
        _applicationRepositoryMock = new Mock<IRepository<Application>>();
        _replacementRepositoryMock = new Mock<IRepository<LicenseReplacement>>();
        _feeStructureRepositoryMock = new Mock<IRepository<FeeStructure>>();
        _paymentRepositoryMock = new Mock<IRepository<PaymentTransaction>>();
        _licenseCategoryRepositoryMock = new Mock<IRepository<LicenseCategory>>();
        _userRepositoryMock = new Mock<IRepository<User>>();
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
            _unitOfWorkMock.Object,
            _mapperMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task CheckEligibilityAsync_ActiveLicense_ReturnsEligible()
    {
        // Arrange
        var applicantId = Guid.NewGuid();
        var licenseId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var activeLicense = new License
        {
            Id = licenseId,
            HolderId = applicantId,
            Status = LicenseStatus.Active,
            LicenseNumber = "MOJ-2025-12345678",
            LicenseCategoryId = categoryId,
            IsDeleted = false,
            ExpiresAt = DateTime.UtcNow.AddYears(1)
        };

        _licenseRepositoryMock.Setup(r => r.FindAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<License, bool>>>()))
            .ReturnsAsync(new List<License> { activeLicense });

        _licenseCategoryRepositoryMock.Setup(r => r.GetByIdAsync(categoryId))
            .ReturnsAsync(new LicenseCategory { Id = categoryId, Name = "Category B" });

        // Act
        var result = await _service.CheckEligibilityAsync(applicantId);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.IsEligible.Should().BeTrue();
        result.Data.LicenseId.Should().Be(licenseId);
        result.Data.LicenseNumber.Should().Be(activeLicense.LicenseNumber);
    }

    [Fact]
    public async Task CheckEligibilityAsync_NoLicense_ReturnsIneligible()
    {
        // Arrange
        var applicantId = Guid.NewGuid();
        _licenseRepositoryMock.Setup(r => r.FindAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<License, bool>>>()))
            .ReturnsAsync(new List<License>());

        // Act
        var result = await _service.CheckEligibilityAsync(applicantId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("No active license found");
    }

    [Fact]
    public async Task CheckEligibilityAsync_ExpiredLicense_ReturnsIneligible()
    {
        // Arrange
        var applicantId = Guid.NewGuid();
        var expiredLicense = new License
        {
            Id = Guid.NewGuid(),
            HolderId = applicantId,
            Status = LicenseStatus.Expired,
            IsDeleted = false
        };

        _licenseRepositoryMock.Setup(r => r.FindAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<License, bool>>>()))
            .ReturnsAsync(new List<License> { expiredLicense });

        // Act
        var result = await _service.CheckEligibilityAsync(applicantId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("No active license found");
    }

    [Fact]
    public async Task CheckEligibilityAsync_ReplacedLicense_ReturnsIneligible()
    {
        // Arrange
        var applicantId = Guid.NewGuid();
        var replacedLicense = new License
        {
            Id = Guid.NewGuid(),
            HolderId = applicantId,
            Status = LicenseStatus.Replaced,
            IsDeleted = false
        };

        _licenseRepositoryMock.Setup(r => r.FindAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<License, bool>>>()))
            .ReturnsAsync(new List<License> { replacedLicense });

        // Act
        var result = await _service.CheckEligibilityAsync(applicantId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("No active license found");
    }
}
