using FluentValidation;
using Mojaz.Application.DTOs.Payment;

namespace Mojaz.Application.Validators.Payments;

public class PaymentConfirmRequestValidator : AbstractValidator<PaymentConfirmRequest>
{
    public PaymentConfirmRequestValidator()
    {
        RuleFor(x => x.PaymentId)
            .NotEmpty()
            .WithMessage("Payment ID is required.");
            
        RuleFor(x => x.IsSuccessful)
            .NotNull()
            .WithMessage("Payment success status is required.");
    }
}