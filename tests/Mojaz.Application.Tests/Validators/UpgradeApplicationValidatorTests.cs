using Moq;
using Mojaz.Application.Validators;
using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using FluentValidation.TestHelper;

namespace Mojaz.Application.Tests.Validators;

public class UpgradeApplicationValidatorTests
{
    private readonly Mock<IRepository<LicenseCategory>> _categoryRepositoryMock;
    private readonly Mock<IRepository<License>> _licenseRepositoryMock;
    private readonly UpgradeApplicationValidator _validator;

    public UpgradeApplicationValidatorTests()
    {
        _categoryRepositoryMock = new Mock<IRepository<LicenseCategory>>();
        _licenseRepositoryMock = new Mock<IRepository<License>>();
        _validator = new UpgradeApplicationValidator(
            _categoryRepositoryMock.Object,
            _licenseRepositoryMock.Object);
    }

    [Fact]
    public async Task Should_Have_Error_When_Upgrade_From_F_To_C()
    {
        // Arrange
        var licenseId = Guid.NewGuid();
        var categoryF = new LicenseCategory 
        { 
            Id = Guid.NewGuid(), 
            Code = LicenseCategoryCode.F, 
            NameAr = "مركبات زراعية",
            NameEn = "Agricultural Vehicles"
        };
        var categoryC = new LicenseCategory 
        { 
            Id = Guid.NewGuid(), 
            Code = LicenseCategoryCode.C, 
            NameAr = "حافلة",
            NameEn = "Public Bus"
        };

        var activeLicense = new License 
        { 
            Id = licenseId, 
            LicenseNumber = "MOJ-2025-12345678",
            LicenseCategory = categoryF,
            Status = LicenseStatus.Active 
        };

        _licenseRepositoryMock.Setup(r => r.GetByIdAsync(licenseId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(activeLicense);

        _categoryRepositoryMock.Setup(r => r.GetByIdAsync(categoryC.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryC);

        var request = new UpgradeApplicationRequest
        {
            CurrentLicenseId = licenseId,
            TargetCategoryId = categoryC.Id,
            BranchId = Guid.NewGuid(),
            PreferredLanguage = "ar",
            DataAccuracyConfirmed = true
        };

        // Act
        var result = await _validator.TestValidateAsync(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.TargetCategoryId)
              .WithErrorMessage("This upgrade path is not allowed. Category F can only be upgraded to Category B (Private Car).");
    }

    [Fact]
    public async Task Should_Have_Error_When_Upgrade_From_F_To_D()
    {
        // Arrange
        var licenseId = Guid.NewGuid();
        var categoryF = new LicenseCategory 
        { 
            Id = Guid.NewGuid(), 
            Code = LicenseCategoryCode.F, 
            NameAr = "مركبات زراعية",
            NameEn = "Agricultural Vehicles"
        };
        var categoryD = new LicenseCategory 
        { 
            Id = Guid.NewGuid(), 
            Code = LicenseCategoryCode.D, 
            NameAr = "شاحنة ثقيلة",
            NameEn = "Heavy Truck"
        };

        var activeLicense = new License 
        { 
            Id = licenseId, 
            LicenseNumber = "MOJ-2025-12345678",
            LicenseCategory = categoryF,
            Status = LicenseStatus.Active 
        };

        _licenseRepositoryMock.Setup(r => r.GetByIdAsync(licenseId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(activeLicense);

        _categoryRepositoryMock.Setup(r => r.GetByIdAsync(categoryD.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryD);

        var request = new UpgradeApplicationRequest
        {
            CurrentLicenseId = licenseId,
            TargetCategoryId = categoryD.Id,
            BranchId = Guid.NewGuid(),
            PreferredLanguage = "ar",
            DataAccuracyConfirmed = true
        };

        // Act
        var result = await _validator.TestValidateAsync(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.TargetCategoryId)
              .WithErrorMessage("This upgrade path is not allowed. Category F can only be upgraded to Category B (Private Car).");
    }

    [Fact]
    public async Task Should_Not_Have_Error_When_Upgrade_From_F_To_B()
    {
        // Arrange
        var licenseId = Guid.NewGuid();
        var categoryF = new LicenseCategory 
        { 
            Id = Guid.NewGuid(), 
            Code = LicenseCategoryCode.F, 
            NameAr = "مركبات زراعية",
            NameEn = "Agricultural Vehicles"
        };
        var categoryB = new LicenseCategory 
        { 
            Id = Guid.NewGuid(), 
            Code = LicenseCategoryCode.B, 
            NameAr = "خصوصي",
            NameEn = "Private Car"
        };

        var activeLicense = new License 
        { 
            Id = licenseId, 
            LicenseNumber = "MOJ-2025-12345678",
            LicenseCategory = categoryF,
            Status = LicenseStatus.Active 
        };

        _licenseRepositoryMock.Setup(r => r.GetByIdAsync(licenseId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(activeLicense);

        _categoryRepositoryMock.Setup(r => r.GetByIdAsync(categoryB.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryB);

        var request = new UpgradeApplicationRequest
        {
            CurrentLicenseId = licenseId,
            TargetCategoryId = categoryB.Id,
            BranchId = Guid.NewGuid(),
            PreferredLanguage = "ar",
            DataAccuracyConfirmed = true
        };

        // Act
        var result = await _validator.TestValidateAsync(request);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.TargetCategoryId);
    }

    [Fact]
    public async Task Should_Have_Error_When_License_Not_Active()
    {
        // Arrange
        var licenseId = Guid.NewGuid();
        var categoryF = new LicenseCategory 
        { 
            Id = Guid.NewGuid(), 
            Code = LicenseCategoryCode.F, 
            NameAr = "مركبات زراعية",
            NameEn = "Agricultural Vehicles"
        };
        var categoryB = new LicenseCategory 
        { 
            Id = Guid.NewGuid(), 
            Code = LicenseCategoryCode.B, 
            NameAr = "خصوصي",
            NameEn = "Private Car"
        };

        // Expired license
        var expiredLicense = new License 
        { 
            Id = licenseId, 
            LicenseNumber = "MOJ-2025-12345678",
            LicenseCategory = categoryF,
            Status = LicenseStatus.Expired 
        };

        _licenseRepositoryMock.Setup(r => r.GetByIdAsync(licenseId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expiredLicense);

        _categoryRepositoryMock.Setup(r => r.GetByIdAsync(categoryB.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryB);

        var request = new UpgradeApplicationRequest
        {
            CurrentLicenseId = licenseId,
            TargetCategoryId = categoryB.Id,
            BranchId = Guid.NewGuid(),
            PreferredLanguage = "ar",
            DataAccuracyConfirmed = true
        };

        // Act
        var result = await _validator.TestValidateAsync(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.CurrentLicenseId)
              .WithErrorMessage("You must have a valid active license to upgrade.");
    }

    [Fact]
    public async Task Should_Have_Error_When_License_Does_Not_Exist()
    {
        // Arrange
        var licenseId = Guid.NewGuid();
        var categoryB = new LicenseCategory 
        { 
            Id = Guid.NewGuid(), 
            Code = LicenseCategoryCode.B, 
            NameAr = "خصوصي",
            NameEn = "Private Car"
        };

        _licenseRepositoryMock.Setup(r => r.GetByIdAsync(licenseId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((License?)null);

        _categoryRepositoryMock.Setup(r => r.GetByIdAsync(categoryB.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryB);

        var request = new UpgradeApplicationRequest
        {
            CurrentLicenseId = licenseId,
            TargetCategoryId = categoryB.Id,
            BranchId = Guid.NewGuid(),
            PreferredLanguage = "ar",
            DataAccuracyConfirmed = true
        };

        // Act
        var result = await _validator.TestValidateAsync(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.CurrentLicenseId)
              .WithErrorMessage("You must have a valid active license to upgrade.");
    }
}