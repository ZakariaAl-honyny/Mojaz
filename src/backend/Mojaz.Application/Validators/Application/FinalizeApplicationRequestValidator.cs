using FluentValidation;
using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Validators.Application;

public class FinalizeApplicationRequestValidator : AbstractValidator<FinalizeApplicationRequest>
{
    public FinalizeApplicationRequestValidator()
    {
        RuleFor(x => x.Decision)
            .IsInEnum().WithMessage("Invalid decision type.");

        RuleFor(x => x.Reason)
            .NotEmpty()
            .When(x => x.Decision == FinalDecisionType.Rejected || x.Decision == FinalDecisionType.Returned)
            .WithMessage("A reason is required when rejecting or returning an application.");

        RuleFor(x => x.Reason)
            .MaximumLength(1000).WithMessage("Reason cannot exceed 1000 characters.");

        RuleFor(x => x.ReturnToStage)
            .NotEmpty()
            .When(x => x.Decision == FinalDecisionType.Returned)
            .WithMessage("Return stage is required when returning an application.");

        RuleFor(x => x.ReturnToStage)
            .Must(stage => stage == "02-Documents" || stage == "04-Medical" || stage == "06-Theory" || stage == "07-Practical")
            .When(x => x.Decision == FinalDecisionType.Returned)
            .WithMessage("Invalid return stage.");

        RuleFor(x => x.ManagerNotes)
            .MaximumLength(1000).WithMessage("Manager notes cannot exceed 1000 characters.");
    }
}
