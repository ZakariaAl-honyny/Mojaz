using FluentValidation;
using Mojaz.Application.DTOs.Application;

namespace Mojaz.Application.Validators.Application;

public class UpdateDraftValidator : AbstractValidator<UpdateDraftRequest>
{
    public UpdateDraftValidator()
    {
        RuleFor(x => x.ServiceType)
            .IsInEnum().When(x => x.ServiceType.HasValue);

        RuleFor(x => x.LicenseCategoryId)
            .NotEmpty().When(x => x.LicenseCategoryId.HasValue);
            
        RuleFor(x => x.PreferredLanguage)
            .Must(l => l == "ar" || l == "en")
            .When(x => !string.IsNullOrEmpty(x.PreferredLanguage))
            .WithMessage("Preferred language must be 'ar' or 'en'.");
    }
}
