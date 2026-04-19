using FluentValidation;
using DrivingLicenseIssuanceSystem.Application.DTOs.Payment;
using DrivingLicenseIssuanceSystem.Domain.Enums;

namespace DrivingLicenseIssuanceSystem.Application.Validators.Payments;

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