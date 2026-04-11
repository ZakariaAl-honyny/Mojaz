using FluentValidation;
using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Validators;

public class FinalizeApplicationRequestValidator : AbstractValidator<FinalizeApplicationRequest>
{
    private static readonly HashSet<string> AllowedReturnStages = new(StringComparer.OrdinalIgnoreCase)
    {
        "02-Documents",
        "04-Medical",
        "06-Theory",
        "07-Practical"
    };

    public FinalizeApplicationRequestValidator()
    {
        RuleFor(x => x.Decision)
            .IsInEnum()
            .WithMessage("Invalid decision type.");

        RuleFor(x => x.Reason)
            .NotEmpty()
            .When(x => x.Decision == FinalDecisionType.Rejected || x.Decision == FinalDecisionType.Returned)
            .WithMessage("A reason is required when rejecting or returning an application.")
            .MaximumLength(1000)
            .WithMessage("Reason cannot exceed 1000 characters.");

        RuleFor(x => x.ReturnToStage)
            .NotEmpty()
            .When(x => x.Decision == FinalDecisionType.Returned)
            .WithMessage("Return stage is required when returning an application.")
            .Must(BeAValidReturnStage)
            .When(x => x.Decision == FinalDecisionType.Returned && !string.IsNullOrEmpty(x.ReturnToStage))
            .WithMessage("Return stage must be one of: 02-Documents, 04-Medical, 06-Theory, 07-Practical.");

        RuleFor(x => x.ManagerNotes)
            .MaximumLength(1000)
            .WithMessage("Manager notes cannot exceed 1000 characters.");
    }

    private static bool BeAValidReturnStage(string? stage)
    {
        return !string.IsNullOrEmpty(stage) && AllowedReturnStages.Contains(stage);
    }
}