using FluentValidation;
using Mojaz.Application.DTOs.Auth;

namespace Mojaz.Application.Validators.Auth;

public class RefreshTokenRequestValidator : AbstractValidator<RefreshTokenRequest>
{
    public RefreshTokenRequestValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required.")
            .Must(BeValidGuid).WithMessage("Invalid refresh token format.");
    }

    private bool BeValidGuid(string token)
    {
        return Guid.TryParse(token, out _);
    }
}