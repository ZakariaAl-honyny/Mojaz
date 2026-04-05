using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Domain.Entities;

public class Payment : AuditableEntity
{
    public Guid ApplicationId { get; set; }
    public FeeType FeeType { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public PaymentStatus Status { get; set; }
    public string? PaymentMethod { get; set; }
    public string? TransactionReference { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime? FailedAt { get; set; }
    public string? FailureReason { get; set; }
    public string? ReceiptPath { get; set; }

    public virtual Application Application { get; set; } = null!;
}
