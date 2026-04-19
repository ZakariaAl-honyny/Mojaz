using FluentValidation;
using DrivingLicenseIssuanceSystem.Application.DTOs.Payment;

namespace DrivingLicenseIssuanceSystem.Application.Validators.Payments;

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