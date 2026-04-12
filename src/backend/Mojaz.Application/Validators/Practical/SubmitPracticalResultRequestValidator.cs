using FluentValidation;
using Mojaz.Application.DTOs.Practical;

namespace Mojaz.Application.Validators.Practical
{
    public class SubmitPracticalResultRequestValidator : AbstractValidator<SubmitPracticalResultRequest>
    {
        public SubmitPracticalResultRequestValidator()
        {
            RuleFor(x => x.Score)
                .NotNull()
                .When(x => !x.IsAbsent)
                .WithMessage("Score is required when applicant is not absent")
                .InclusiveBetween(0, 100)
                .When(x => x.Score.HasValue)
                .WithMessage("Score must be between 0 and 100");

            RuleFor(x => x.AdditionalHoursRequired)
                .NotNull()
                .GreaterThan(0)
                .When(x => x.RequiresAdditionalTraining)
                .WithMessage("Additional hours are required when training is mandated");

            RuleFor(x => x.Notes)
                .MaximumLength(1000)
                .WithMessage("Notes cannot exceed 1000 characters");

            RuleFor(x => x.VehicleUsed)
                .MaximumLength(200)
                .WithMessage("Vehicle description cannot exceed 200 characters");
        }
    }
}
