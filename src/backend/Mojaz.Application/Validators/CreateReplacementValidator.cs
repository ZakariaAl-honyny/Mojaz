using FluentValidation;
using Mojaz.Application.DTOs.LicenseReplacement;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Validators;

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