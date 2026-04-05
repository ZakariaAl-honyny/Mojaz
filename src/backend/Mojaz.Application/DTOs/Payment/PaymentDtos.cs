using Mojaz.Domain.Enums;

namespace Mojaz.Application.DTOs.Payment;

public class InitiatePaymentRequest
{
    public FeeType FeeType { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
}

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public string PaymentMethod { get; set; } = string.Empty;
    public PaymentStatus Status { get; set; }
    public string? ReceiptNumber { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? RedirectUrl { get; set; }
    public bool Success { get; set; }
}

public class PaymentCallback
{
    public string TransactionId { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string? AuthCode { get; set; }
}
