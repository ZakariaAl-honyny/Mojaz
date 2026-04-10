using FluentValidation;
using Mojaz.Application.DTOs.Renewal;

namespace Mojaz.Application.Validators;

public class RenewalPaymentRequestValidator : AbstractValidator<PaymentRequest>
{
    public RenewalPaymentRequestValidator()
    {
        RuleFor(x => x.PaymentMethod)
            .NotEmpty()
            .WithMessage("Payment method is required")
            .MaximumLength(50)
            .WithMessage("Payment method must not exceed 50 characters");

        RuleFor(x => x.TransactionId)
            .NotEmpty()
            .WithMessage("Transaction ID is required")
            .MaximumLength(100)
            .WithMessage("Transaction ID must not exceed 100 characters");

        RuleFor(x => x.Amount)
            .GreaterThan(0)
            .WithMessage("Amount must be greater than zero");
    }
}