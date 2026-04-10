using Moq;
using Mojaz.Application.Validators;
using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Interfaces;
using Mojaz.Domain.Entities;
using Mojaz.Application.Interfaces.Services;
using FluentValidation.TestHelper;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Tests.Validators;

public class CreateApplicationValidatorTests
{
    private readonly Mock<IRepository<LicenseCategory>> _categoryRepositoryMock;
    private readonly Mock<ISystemSettingsService> _settingsServiceMock;
    private readonly CreateApplicationValidator _validator;

    public CreateApplicationValidatorTests()
    {
        _categoryRepositoryMock = new Mock<IRepository<LicenseCategory>>();
        _settingsServiceMock = new Mock<ISystemSettingsService>();
        _validator = new CreateApplicationValidator(_categoryRepositoryMock.Object, _settingsServiceMock.Object);
    }

    [Fact]
    public async Task Should_Have_Error_When_Age_Under_18_For_Category_F()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var categoryF = new LicenseCategory 
        { 
            Id = categoryId, 
            Code = LicenseCategoryCode.F, 
            NameEn = "Agricultural Vehicle" 
        };

        _categoryRepositoryMock.Setup(r => r.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryF);

        _settingsServiceMock.Setup(s => s.GetAsync("MIN_AGE_CATEGORY_F"))
            .ReturnsAsync("18");

        var request = new CreateApplicationRequest
        {
            ServiceType = ServiceType.NewLicense,
            LicenseCategoryId = categoryId,
            NationalId = "1000000000",
            DateOfBirth = DateTime.UtcNow.AddYears(-17), // 17 years old
            Gender = "Male",
            Nationality = "Saudi",
            City = "Riyadh",
            Region = "Riyadh",
            ApplicantType = "Citizen",
            BranchId = Guid.NewGuid(),
            PreferredLanguage = "ar",
            DataAccuracyConfirmed = true
        };

        // Act
        var result = await _validator.TestValidateAsync(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.DateOfBirth)
              .WithErrorMessage("You must be at least 18 years old for Agricultural Vehicle (Category F).");
    }

    [Fact]
    public async Task Should_Not_Have_Error_When_Age_18_Or_Over_For_Category_F()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var categoryF = new LicenseCategory 
        { 
            Id = categoryId, 
            Code = LicenseCategoryCode.F, 
            NameEn = "Agricultural Vehicle" 
        };

        _categoryRepositoryMock.Setup(r => r.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(categoryF);

        _settingsServiceMock.Setup(s => s.GetAsync("MIN_AGE_CATEGORY_F"))
            .ReturnsAsync("18");

        var request = new CreateApplicationRequest
        {
            ServiceType = ServiceType.NewLicense,
            LicenseCategoryId = categoryId,
            NationalId = "1000000000",
            DateOfBirth = DateTime.UtcNow.AddYears(-19), // 19 years old
            Gender = "Male",
            Nationality = "Saudi",
            City = "Riyadh",
            Region = "Riyadh",
            ApplicantType = "Citizen",
            BranchId = Guid.NewGuid(),
            PreferredLanguage = "ar",
            DataAccuracyConfirmed = true
        };

        // Act
        var result = await _validator.TestValidateAsync(request);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.DateOfBirth);
    }
}
