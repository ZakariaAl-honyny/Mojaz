using FluentValidation;
using Mojaz.Application.DTOs.Auth;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Validators.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full Name is required")
            .MinimumLength(5).MaximumLength(150);

        RuleFor(x => x.Email)
            .NotEmpty().When(x => x.Method == RegistrationMethod.Email)
            .EmailAddress().When(x => !string.IsNullOrEmpty(x.Email))
            .WithMessage("Valid email is required for Email registration.");

        RuleFor(x => x.Phone)
            .NotEmpty().When(x => x.Method == RegistrationMethod.Phone)
            .Matches(@"^\+?[1-9]\d{1,14}$").When(x => !string.IsNullOrEmpty(x.Phone))
            .WithMessage("Valid E.164 phone number is required.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one number.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage("Passwords do not match.");

        RuleFor(x => x.TermsAccepted)
            .Equal(true).WithMessage("You must accept terms and conditions.");
    }
}
