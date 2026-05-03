using FluentValidation;
using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Validators.Application;

/// <summary>
/// Validator for creating application draft requests.
/// Validates the ServiceType is provided and is a valid enum value.
/// </summary>
public class CreateApplicationDraftRequestValidator : AbstractValidator<CreateApplicationDraftRequest>
{
    public CreateApplicationDraftRequestValidator()
    {
        RuleFor(x => x.ServiceType)
            .IsInEnum().WithMessage("نوع خدمة غير صالح");
    }
}