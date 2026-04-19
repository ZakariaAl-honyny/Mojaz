using FluentValidation;
using DrivingLicenseIssuanceSystem.Application.DTOs.LicenseReplacement;
using DrivingLicenseIssuanceSystem.Domain.Enums;

namespace DrivingLicenseIssuanceSystem.Application.Validators;

/// <summary>
/// Validator for CreateReplacementRequest
/// </summary>
public class CreateReplacementValidator : AbstractValidator<CreateReplacementRequest>
{
    public CreateReplacementValidator()
    {
        RuleFor(x => x.LicenseId)
            .NotEmpty()
            .WithMessage("License ID is required");

        RuleFor(x => x.Reason)
            .IsInEnum()
            .WithMessage("Invalid replacement reason");
    }
}