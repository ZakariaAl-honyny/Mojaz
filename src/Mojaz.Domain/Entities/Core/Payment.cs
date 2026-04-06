namespace Mojaz.Domain.Entities.Core;

using Base;

/// <summary>
/// Payment record for license application fees.
/// Tracks all financial transactions in the system.
/// </summary>
public class Payment : BaseEntity
{
    /// <summary>
    /// Unique payment reference number.
    /// </summary>
    public string PaymentReference { get; set; }

    /// <summary>
    /// ID of the application this payment is for.
    /// </summary>
    public int ApplicationId { get; set; }

    /// <summary>
    /// ID of the user who made the payment.
    /// </summary>
    public int PaidById { get; set; }

    /// <summary>
    /// ID of the fee type being paid for.
    /// </summary>
    public int FeeTypeId { get; set; }

    /// <summary>
    /// Payment amount.
    /// </summary>
    public decimal Amount { get; set; }

    /// <summary>
    /// Transaction ID from the payment gateway (if applicable).
    /// </summary>
    public string TransactionId { get; set; }

    /// <summary>
    /// Payment status (e.g., Pending, Completed, Failed, Refunded).
    /// </summary>
    public string Status { get; set; }

    /// <summary>
    /// Timestamp when the payment was processed.
    /// </summary>
    public DateTime PaidAt { get; set; }
}
