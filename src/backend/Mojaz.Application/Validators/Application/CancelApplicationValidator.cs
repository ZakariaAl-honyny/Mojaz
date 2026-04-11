using FluentValidation;
using Mojaz.Application.DTOs.Application;

namespace Mojaz.Application.Validators.Application;

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