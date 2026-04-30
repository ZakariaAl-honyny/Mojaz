using FluentValidation;
using Mojaz.Application.DTOs.Auth;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Validators.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("الاسم الكامل مطلوب")
            .MinimumLength(5).MaximumLength(150);

        RuleFor(x => x.Email)
            .NotEmpty().When(x => x.Method == RegistrationMethod.Email)
            .EmailAddress().When(x => !string.IsNullOrEmpty(x.Email))
            .WithMessage("يرجى إدخال بريد إلكتروني صحيح");

        RuleFor(x => x.Phone)
            .NotEmpty().When(x => x.Method == RegistrationMethod.Phone)
            .Matches(@"^\+?[1-9]\d{1,14}$").When(x => !string.IsNullOrEmpty(x.Phone))
            .WithMessage("يرجى إدخال رقم جوال صحيح");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("كلمة المرور مطلوبة")
            .MinimumLength(8).WithMessage("يجب أن تكون كلمة المرور 8 أحرف على الأقل")
            .Matches("[A-Z]").WithMessage("يجب أن تحتوي كلمة المرور على حرف كبير")
            .Matches("[a-z]").WithMessage("يجب أن تحتوي كلمة المرور على حرف صغير")
            .Matches("[0-9]").WithMessage("يجب أن تحتوي كلمة المرور على رقم")
            .Matches("[^a-zA-Z0-9]").WithMessage("يجب أن تحتوي كلمة المرور على رمز خاص");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage("كلمتا المرور غير متطابقتين");

        RuleFor(x => x.TermsAccepted)
            .Equal(true).WithMessage("يجب قبول الشروط والأحكام");
    }
}
