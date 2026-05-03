using Mojaz.Shared;
using System;
using System.Collections.Generic;

namespace Mojaz.Application.DTOs.TestRetake;

public class RetakeEligibilityDto
{
    public int ApplicationId { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public int? LicenseCategoryId { get; set; }
    public string LicenseCategoryCode { get; set; } = string.Empty;
    public string LicenseCategoryName { get; set; } = string.Empty;
    
    public int TheoryAttempts { get; set; }
    public int MaxTheoryAttempts { get; set; }
    public bool CanRetakeTheory { get; set; }
    public string? TheoryIneligibilityReason { get; set; }
    public DateTime? TheoryNextAvailableDate { get; set; }
    
    public int PracticalAttempts { get; set; }
    public int MaxPracticalAttempts { get; set; }
    public bool CanRetakePractical { get; set; }
    public string? PracticalIneligibilityReason { get; set; }
    public DateTime? PracticalNextAvailableDate { get; set; }
    
    public bool IsEligibleForRetake => CanRetakeTheory || CanRetakePractical;
}

public class RetakeRequest
{
    public bool RequestTheoryRetake { get; set; }
    public bool RequestPracticalRetake { get; set; }
}

public class RetakeEligibilityResponse
{
    public bool IsEligible { get; set; }
    public List<RetakeEligibilityDto> FailedTests { get; set; } = [];
    public string? Message { get; set; }
}