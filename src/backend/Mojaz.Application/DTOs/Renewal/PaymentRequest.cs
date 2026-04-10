using Mojaz.Shared;

namespace Mojaz.Application.DTOs.Renewal;

public class PaymentRequest
{
    public string PaymentMethod { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}