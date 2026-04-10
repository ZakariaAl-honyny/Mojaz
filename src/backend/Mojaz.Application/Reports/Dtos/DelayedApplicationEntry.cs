using System;

namespace Mojaz.Application.Reports.Dtos;

public class DelayedApplicationEntry
{
    public Guid ApplicationId { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public string CurrentStatus { get; set; } = string.Empty;
    public int DaysInStage { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string BranchName { get; set; } = string.Empty;
}
