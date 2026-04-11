using FluentValidation;
using Mojaz.Application.DTOs.Theory;

namespace Mojaz.Application.Validators
{
    public class SubmitTheoryResultValidator : AbstractValidator<SubmitTheoryResultRequest>
    {
        public SubmitTheoryResultValidator()
        {
            RuleFor(x => x.Score)
                .NotEmpty()
                .When(x => !x.IsAbsent)
                .WithMessage("Score is required unless the applicant was absent.");

            RuleFor(x => x.Score)
                .InclusiveBetween(0, 100)
                .When(x => x.Score.HasValue)
                .WithMessage("Score must be between 0 and 100.");

            RuleFor(x => x.Notes)
                .MaximumLength(500)
                .WithMessage("Notes cannot exceed 500 characters.");
        }
    }
}
