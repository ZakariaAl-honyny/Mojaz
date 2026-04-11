using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;

namespace Mojaz.Application.DTOs.LicenseReplacement;

/// <summary>
/// DTO for replacement eligibility check response
/// </summary>
public class ReplacementEligibilityDto
{
    public bool IsEligible { get; set; }
    public Guid? LicenseId { get; set; }
    public string? LicenseNumber { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? Message { get; set; }
}

/// <summary>
/// Request to create a license replacement application
/// </summary>
public class CreateReplacementRequest
{
    public Guid LicenseId { get; set; }
    public ReplacementReason Reason { get; set; }
    public List<Guid> DocumentIds { get; set; } = new();
}

/// <summary>
/// Response for creating a license replacement application
/// </summary>
public class CreateReplacementResponse
{
    public Guid ApplicationId { get; set; }
    public string ApplicationNumber { get; set; } = default!;
    public decimal RequiredFee { get; set; }
}

public class LicenseReplacementDto
{
    public Guid Id { get; set; }
    public Guid LicenseId { get; set; }
    public Guid ApplicationId { get; set; }
    public ReplacementReason Reason { get; set; }
    public bool IsReportVerified { get; set; }
    public string? ReviewComments { get; set; }
    public DateTime ProcessedAt { get; set; }
    public Guid? ProcessedBy { get; set; }
    public string? LicenseNumber { get; set; }
    public string? CurrentStatus { get; set; }
    public DateTime? ExpiryDate { get; set; }
}