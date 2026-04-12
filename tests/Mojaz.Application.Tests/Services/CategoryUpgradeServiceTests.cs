using Moq;
using FluentAssertions;
using Xunit;
using Mojaz.Application.Services;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Tests.Services;

public class CategoryUpgradeServiceTests
{
    private readonly Mock<ISystemSettingsService> _settingsServiceMock;
    private readonly Mock<IFeeStructureRepository> _feeRepositoryMock;
    private readonly Mock<ILicenseRepository> _licenseRepositoryMock;
    private readonly Mock<IRepository<LicenseCategory>> _categoryRepoMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly CategoryUpgradeService _service;

    public CategoryUpgradeServiceTests()
    {
        _settingsServiceMock = new Mock<ISystemSettingsService>();
        _feeRepositoryMock = new Mock<IFeeStructureRepository>();
        _licenseRepositoryMock = new Mock<ILicenseRepository>();
        _categoryRepoMock = new Mock<IRepository<LicenseCategory>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();

        _service = new CategoryUpgradeService(
            _settingsServiceMock.Object,
            _feeRepositoryMock.Object,
            _licenseRepositoryMock.Object,
            _categoryRepoMock.Object,
            _unitOfWorkMock.Object);
    }

    [Theory]
    [InlineData(LicenseCategoryCode.B, LicenseCategoryCode.C)]
    [InlineData(LicenseCategoryCode.C, LicenseCategoryCode.D)]
    [InlineData(LicenseCategoryCode.D, LicenseCategoryCode.E)]
    [InlineData(LicenseCategoryCode.F, LicenseCategoryCode.B)]
    public async Task ValidateUpgradePathAsync_ValidPath_ReturnsTrue(LicenseCategoryCode from, LicenseCategoryCode to)
    {
        // Act
        var result = await _service.ValidateUpgradePathAsync(from, to);

        // Assert
        result.Should().BeTrue();
    }

    [Theory]
    [InlineData(LicenseCategoryCode.B, LicenseCategoryCode.E)]
    [InlineData(LicenseCategoryCode.C, LicenseCategoryCode.B)]
    [InlineData(LicenseCategoryCode.E, LicenseCategoryCode.B)]
    public async Task ValidateUpgradePathAsync_InvalidPath_ReturnsFalse(LicenseCategoryCode from, LicenseCategoryCode to)
    {
        // Act
        var result = await _service.ValidateUpgradePathAsync(from, to);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task ValidateUpgradePathAsync_SameCategory_ReturnsFalse()
    {
        // Arrange
        var category = LicenseCategoryCode.B;

        // Act
        var result = await _service.ValidateUpgradePathAsync(category, category);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckHoldingPeriodAsync_HoldingPeriodMet_ReturnsTrue()
    {
        // Arrange
        var licenseId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var license = new License { HolderId = userId, IssuedAt = DateTime.UtcNow.AddMonths(-13) };
        
        _licenseRepositoryMock.Setup(r => r.GetByIdAsync(licenseId)).ReturnsAsync(license);
        _settingsServiceMock.Setup(s => s.GetAsync("MIN_HOLDING_PERIOD_UPGRADE_MONTHS")).ReturnsAsync("12");

        // Act
        var result = await _service.CheckHoldingPeriodAsync(licenseId, userId);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task CheckHoldingPeriodAsync_HoldingPeriodNotMet_ReturnsFalse()
    {
        // Arrange
        var licenseId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var license = new License { HolderId = userId, IssuedAt = DateTime.UtcNow.AddMonths(-6) };
        
        _licenseRepositoryMock.Setup(r => r.GetByIdAsync(licenseId)).ReturnsAsync(license);
        _settingsServiceMock.Setup(s => s.GetAsync("MIN_HOLDING_PERIOD_UPGRADE_MONTHS")).ReturnsAsync("12");

        // Act
        var result = await _service.CheckHoldingPeriodAsync(licenseId, userId);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckHoldingPeriodAsync_LicenseNotFound_ReturnsFalse()
    {
        // Arrange
        var licenseId = Guid.NewGuid();
        _licenseRepositoryMock.Setup(r => r.GetByIdAsync(licenseId)).ReturnsAsync((License)null!);

        // Act
        var result = await _service.CheckHoldingPeriodAsync(licenseId, Guid.NewGuid());

        // Assert
        result.Should().BeFalse();
    }
}
