using FluentValidation;
using Mojaz.Application.DTOs.Payment;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Validators.Payments;

public class PaymentInitiateRequestValidator : AbstractValidator<PaymentInitiateRequest>
{
    public PaymentInitiateRequestValidator()
    {
        RuleFor(x => x.ApplicationId)
            .NotEmpty()
            .WithMessage("Application ID is required.");
            
        RuleFor(x => x.FeeType)
            .IsInEnum()
            .WithMessage("Fee type is required.");
    }
}