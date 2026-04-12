using FluentValidation;
using Mojaz.Application.DTOs.Document;

namespace Mojaz.Application.Validators;

public class DocumentReviewValidator : AbstractValidator<DocumentReviewRequest>
{
    public DocumentReviewValidator()
    {
        When(x => !x.Approved, () =>
        {
            RuleFor(x => x.RejectionReason)
                .NotEmpty()
                .WithMessage("Rejection reason is required when rejecting a document.")
                .MaximumLength(1000)
                .WithMessage("Rejection reason must not exceed 1000 characters.");
        });

        When(x => x.Approved, () =>
        {
            RuleFor(x => x.RejectionReason)
                .Empty()
                .WithMessage("Rejection reason must not be provided when approving a document.");
        });
    }
}