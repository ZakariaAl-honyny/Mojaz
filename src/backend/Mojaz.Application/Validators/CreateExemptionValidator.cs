using FluentValidation;
using Mojaz.Application.DTOs.Training;

namespace Mojaz.Application.Validators
{
    public class CreateExemptionValidator : AbstractValidator<CreateExemptionRequest>
    {
        public CreateExemptionValidator()
        {
            RuleFor(x => x.ApplicationId)
                .NotEmpty().WithMessage("ApplicationId is required");

            RuleFor(x => x.ExemptionReason)
                .NotEmpty().WithMessage("Exemption reason is required")
                .MinimumLength(10).WithMessage("Exemption reason must be at least 10 characters")
                .MaximumLength(1000).WithMessage("Exemption reason must not exceed 1000 characters");

            RuleFor(x => x.ExemptionDocumentId)
                .NotEmpty().WithMessage("Exemption document ID is required");
        }
    }
}