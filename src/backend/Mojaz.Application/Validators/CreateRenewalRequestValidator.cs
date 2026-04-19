using FluentValidation;
using DrivingLicenseIssuanceSystem.Application.DTOs.Renewal;

namespace DrivingLicenseIssuanceSystem.Application.Validators;

public class CreateRenewalRequestValidator : AbstractValidator<CreateRenewalRequest>
{
    public CreateRenewalRequestValidator()
    {
        RuleFor(x => x.OldLicenseId)
            .NotEmpty()
            .WithMessage("Old license ID is required");

        RuleFor(x => x.LicenseCategoryId)
            .NotEmpty()
            .WithMessage("License category ID is required");
    }
}