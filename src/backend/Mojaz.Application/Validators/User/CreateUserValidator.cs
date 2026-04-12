using FluentValidation;
using Mojaz.Application.DTOs.User;

namespace Mojaz.Application.Validators.User;

public class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MaximumLength(200).WithMessage("Full name cannot exceed 200 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\+?[\d\s\-]+$").WithMessage("Invalid phone number format");

        RuleFor(x => x.AppRole)
            .IsInEnum().WithMessage("Invalid role");
    }
}

public class UpdateUserStatusValidator : AbstractValidator<UpdateUserStatusRequest>
{
    public UpdateUserStatusValidator()
    {
        RuleFor(x => x.IsActive)
            .NotNull().WithMessage("IsActive is required");
    }
}

public class UpdateUserRoleValidator : AbstractValidator<UpdateUserRoleRequest>
{
    public UpdateUserRoleValidator()
    {
        RuleFor(x => x.AppRole)
            .IsInEnum().WithMessage("Invalid role");
    }
}