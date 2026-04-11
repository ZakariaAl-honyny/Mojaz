using System.Collections.Generic;

namespace Mojaz.Application.Reports.Dtos;

public class ReportSummaryDto
{
    public int TotalApplications { get; set; }
    public List<StatusDistributionDto> StatusCounts { get; set; } = new();
    public List<ServiceStatsDto> ServiceDistribution { get; set; } = new();
    public int LateApplicationsCount { get; set; }
}
