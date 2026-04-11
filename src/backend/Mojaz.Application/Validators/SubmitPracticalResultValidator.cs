using FluentValidation;
using Mojaz.Application.DTOs.Practical;

namespace Mojaz.Application.Validators;

/// <summary>
/// Validator for SubmitPracticalResultRequest
/// </summary>
public class SubmitPracticalResultValidator : AbstractValidator<SubmitPracticalResultRequest>
{
    public SubmitPracticalResultValidator()
    {
        RuleFor(x => x.Score)
            .Must((request, score) => 
                (request.IsAbsent && score == null) || 
                (!request.IsAbsent && score.HasValue))
            .WithMessage("Score is required when not absent, and must be null when absent");

        When(x => !x.IsAbsent, () =>
        {
            RuleFor(x => x.Score)
                .NotNull()
                .WithMessage("Score is required when not absent");

            RuleFor(x => x.Score)
                .InclusiveBetween(0, 100)
                .WithMessage("Score must be between 0 and 100");
        });

        RuleFor(x => x.RequiresAdditionalTraining)
            .NotNull()
            .WithMessage("RequiresAdditionalTraining is required");

        When(x => x.RequiresAdditionalTraining, () =>
        {
            RuleFor(x => x.AdditionalHoursRequired)
                .GreaterThan(0)
                .WithMessage("AdditionalHoursRequired must be greater than 0 when RequiresAdditionalTraining is true");
        });

        When(x => !x.RequiresAdditionalTraining, () =>
        {
            RuleFor(x => x.AdditionalHoursRequired)
                .Equal(0)
                .WithMessage("AdditionalHoursRequired must be 0 when RequiresAdditionalTraining is false");
        });

        RuleFor(x => x.Notes)
            .MaximumLength(1000)
            .WithMessage("Notes must not exceed 1000 characters");

        RuleFor(x => x.VehicleUsed)
            .MaximumLength(200)
            .WithMessage("VehicleUsed must not exceed 200 characters");
    }
}