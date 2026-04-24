using FluentValidation;
using Mojaz.Application.DTOs.Auth;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Validators.Auth;

public class ForgotPasswordRequestValidator : AbstractValidator<ForgotPasswordRequest>
{
    public ForgotPasswordRequestValidator()
    {
        RuleFor(x => x.Identifier)
            .NotEmpty().WithMessage("Identifier is required.");

        RuleFor(x => x.Method)
            .IsInEnum().WithMessage("Invalid method.");
    }
}