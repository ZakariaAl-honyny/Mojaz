using FluentValidation;
using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Interfaces;
using Mojaz.Domain.Entities;
using Mojaz.Application.Interfaces.Services;

namespace Mojaz.Application.Validators;

public class CreateApplicationValidator : AbstractValidator<CreateApplicationRequest>
{
    public CreateApplicationValidator(
        IRepository<LicenseCategory> categoryRepository,
        ISystemSettingsService settingsService)
    {
        // Step 1: Service
        RuleFor(x => x.ServiceType).NotEmpty().WithMessage("Service type is required.");

        // Step 2: Category
        RuleFor(x => x.LicenseCategoryId)
            .NotEmpty().WithMessage("License category is required.")
            .CustomAsync(async (categoryId, context, cancellationToken) =>
            {
                var category = await categoryRepository.GetByIdAsync(categoryId);
                if (category == null)
                {
                    context.AddFailure("LicenseCategoryId", "Invalid license category.");
                    return;
                }

                var request = context.InstanceToValidate;
                var settingKey = $"MIN_AGE_CATEGORY_{category.Code}";
                var minAgeStr = await settingsService.GetAsync(settingKey);
                
                if (int.TryParse(minAgeStr, out var minAge))
                {
                    var today = DateTime.UtcNow;
                    var age = today.Year - request.DateOfBirth.Year;
                    if (request.DateOfBirth.Date > today.AddYears(-age)) age--;

                    if (age < minAge)
                    {
                        context.AddFailure("DateOfBirth", $"You must be at least {minAge} years old for {category.NameEn} (Category {category.Code}).");
                    }
                }
            });

        // Step 3: Personal Information (Applicant profile updates)
        RuleFor(x => x.NationalId)
            .NotEmpty().WithMessage("National ID/Iqama is required.")
            .Matches(@"^[12]\d{9}$").WithMessage("Invalid National ID or Iqama number. Must be 10 digits starting with 1 or 2.");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth is required.");

        RuleFor(x => x.Gender)
            .NotEmpty().WithMessage("Gender is required.")
            .Must(g => g == "Male" || g == "Female").WithMessage("Gender must be Male or Female.");

        RuleFor(x => x.Nationality).NotEmpty().WithMessage("Nationality is required.");
        
        RuleFor(x => x.City).NotEmpty().WithMessage("City is required.");
        RuleFor(x => x.Region).NotEmpty().WithMessage("Region is required.");
        
        RuleFor(x => x.ApplicantType)
            .NotEmpty().WithMessage("Applicant type is required.")
            .Must(t => t == "Citizen" || t == "Resident").WithMessage("Type must be Citizen or Resident.");

        // Step 4: Details
        RuleFor(x => x.BranchId).NotEmpty().WithMessage("Preferred branch/center is required.");
        RuleFor(x => x.PreferredLanguage)
            .NotEmpty().WithMessage("Preferred language is required.")
            .Must(l => l == "ar" || l == "en").WithMessage("Language must be ar or en.");

        // Step 5: Review
        RuleFor(x => x.DataAccuracyConfirmed)
            .Equal(true).WithMessage("You must confirm that all provided data is accurate.");
    }
}
