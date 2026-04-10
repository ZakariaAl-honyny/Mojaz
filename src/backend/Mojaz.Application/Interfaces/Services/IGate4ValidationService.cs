using Mojaz.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public class Gate4ValidationResult
{
    public bool IsFullyPassed { get; set; }
    public List<Gate4Condition> Conditions { get; set; } = new();
}

public class Gate4Condition
{
    public string Key { get; set; } = string.Empty;
    public string LabelAr { get; set; } = string.Empty;
    public string LabelEn { get; set; } = string.Empty;
    public bool IsPassed { get; set; }
    public string? FailureMessageAr { get; set; }
    public string? FailureMessageEn { get; set; }
}

public interface IGate4ValidationService
{
    Task<Gate4ValidationResult> ValidateAsync(Guid applicationId);
}