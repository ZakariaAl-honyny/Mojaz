using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Application.DTOs.Payment;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public FeeType FeeType { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public PaymentStatus Status { get; set; }
    public string? TransactionReference { get; set; }
    public string? ReceiptNumber { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Success { get; set; }
}

public class PaymentQuery
{
    public Guid? ApplicationId { get; set; }
    public PaymentStatus? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class PaymentInitiateRequest
{
    public Guid ApplicationId { get; set; }
    public Guid? LicenseCategoryId { get; set; }
    public FeeType FeeType { get; set; }
}

public class PaymentConfirmRequest
{
    public Guid PaymentId { get; set; }
    public bool IsSuccessful { get; set; }
}
