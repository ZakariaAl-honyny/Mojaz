using FluentValidation;
using Mojaz.Application.DTOs.Auth;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Validators.Auth;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Identifier)
            .NotEmpty().WithMessage("Identifier is required.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.");

        RuleFor(x => x.Method)
            .IsInEnum().WithMessage("Invalid login method.");
    }
}