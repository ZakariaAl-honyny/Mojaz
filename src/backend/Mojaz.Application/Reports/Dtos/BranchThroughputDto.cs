using System;
using System.Collections.Generic;

namespace Mojaz.Application.Reports.Dtos;

public class BranchThroughputDto
{
    public Guid BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public List<DailyLoadDto> DailyCounts { get; set; } = new();
    public int TotalIssued { get; set; }
    public int TotalProcessed { get; set; }
    public double ApprovalRate { get; set; }
    public double AverageProcessingDays { get; set; }
}
