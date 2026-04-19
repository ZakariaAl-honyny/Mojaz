using FluentValidation;
using DrivingLicenseIssuanceSystem.Application.DTOs.Application;

namespace DrivingLicenseIssuanceSystem.Application.Validators.Application;

public class SubmitApplicationValidator : AbstractValidator<SubmitApplicationRequest>
{
    public SubmitApplicationValidator()
    {
        RuleFor(x => x.DataAccuracyConfirmed)
            .Equal(true)
            .WithMessage("You must confirm that all provided data is accurate.");
    }
}
