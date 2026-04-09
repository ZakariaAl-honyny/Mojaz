using FluentValidation;
using Mojaz.Application.DTOs.Training;

namespace Mojaz.Application.Validators
{
    public class CreateTrainingRecordValidator : AbstractValidator<CreateTrainingRecordRequest>
    {
        public CreateTrainingRecordValidator()
        {
            RuleFor(x => x.ApplicationId)
                .NotEmpty().WithMessage("ApplicationId is required");

            RuleFor(x => x.SchoolName)
                .NotEmpty().WithMessage("School name is required")
                .MaximumLength(200).WithMessage("School name must not exceed 200 characters");

            RuleFor(x => x.HoursCompleted)
                .GreaterThan(0).WithMessage("Hours completed must be greater than zero");

            RuleFor(x => x.TrainingDate)
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("Training date cannot be in the future");

            RuleFor(x => x.CertificateNumber)
                .MaximumLength(64).When(x => !string.IsNullOrEmpty(x.CertificateNumber))
                .WithMessage("Certificate number must not exceed 64 characters");

            RuleFor(x => x.TrainerName)
                .MaximumLength(200).When(x => !string.IsNullOrEmpty(x.TrainerName))
                .WithMessage("Trainer name must not exceed 200 characters");

            RuleFor(x => x.CenterName)
                .MaximumLength(200).When(x => !string.IsNullOrEmpty(x.CenterName))
                .WithMessage("Center name must not exceed 200 characters");

            RuleFor(x => x.Notes)
                .MaximumLength(1000).When(x => !string.IsNullOrEmpty(x.Notes))
                .WithMessage("Notes must not exceed 1000 characters");
        }
    }
}