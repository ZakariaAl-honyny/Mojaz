using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Application.DTOs.Payment;

public class PaymentDto
{
    public int Id { get; set; }
    public int ApplicationId { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public string ApplicantFullName { get; set; } = string.Empty;
    public FeeType FeeType { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public PaymentStatus Status { get; set; }
    public string? DueDate { get; set; }
    public string? TransactionReference { get; set; }
    public string? ReceiptNumber { get; set; }
    public DateTime? PaidAt { get; set; }
    public string? PaymentMethod { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Success { get; set; }
}

public class PaymentQuery
{
    public int? ApplicationId { get; set; }
    public PaymentStatus? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class InitiatePaymentRequest
{
    public FeeType FeeType { get; set; }
    public int? LicenseCategoryId { get; set; }
}

public class PaymentInitiateRequest
{
    public int ApplicationId { get; set; }
    public int? LicenseCategoryId { get; set; }
    public FeeType FeeType { get; set; }
}

public class PaymentConfirmRequest
{
    public int PaymentId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public bool IsSuccessful { get; set; }
}

public class PaymentReceiptResponse
{
    public int PaymentId { get; set; }
    public int ApplicationId { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public string ApplicantName { get; set; } = string.Empty;
    public FeeType FeeType { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public PaymentStatus Status { get; set; }
    public string TransactionReference { get; set; } = string.Empty;
    public string ReceiptNumber { get; set; } = string.Empty;
    public DateTime PaidAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ServiceNameAr { get; set; } = string.Empty;
    public string ServiceNameEn { get; set; } = string.Empty;
}

public class PaymentCallback
{
    public string TransactionId { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string? Message { get; set; }
}
