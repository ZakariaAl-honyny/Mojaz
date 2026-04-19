using FluentValidation;
using DrivingLicenseIssuanceSystem.Application.DTOs.Application;

namespace DrivingLicenseIssuanceSystem.Application.Validators.Application;

public class CancelApplicationValidator : AbstractValidator<CancelApplicationRequest>
{
    public CancelApplicationValidator()
    {
        RuleFor(x => x.Reason)
            .NotEmpty()
            .WithMessage("Cancellation reason is required.")
            .MaximumLength(500)
            .WithMessage("Cancellation reason must not exceed 500 characters.");
    }
}