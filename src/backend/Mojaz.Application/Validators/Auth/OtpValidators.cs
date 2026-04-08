using FluentValidation;
using Mojaz.Application.DTOs.Auth;

namespace Mojaz.Application.Validators.Auth;

public class VerifyOtpRequestValidator : AbstractValidator<VerifyOtpRequest>
{
    public VerifyOtpRequestValidator()
    {
        RuleFor(x => x.Destination).NotEmpty().WithMessage("Destination is required.");
        RuleFor(x => x.Code).NotEmpty().Length(6).WithMessage("Code must be 6 digits.");
        RuleFor(x => x.Purpose).IsInEnum().WithMessage("Invalid purpose.");
    }
}

public class ResendOtpRequestValidator : AbstractValidator<ResendOtpRequest>
{
    public ResendOtpRequestValidator()
    {
        RuleFor(x => x.Destination).NotEmpty().WithMessage("Destination is required.");
        RuleFor(x => x.Purpose).IsInEnum().WithMessage("Invalid purpose.");
    }
}
