using FluentValidation;
using Mojaz.Application.DTOs.Renewal;

namespace Mojaz.Application.Validators;

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