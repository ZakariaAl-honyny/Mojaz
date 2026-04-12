namespace Mojaz.Application.Dashboards.Dtos;

public class ManagerKpiDto
{
    public int TodayTotalApplications { get; set; }
    public double TodayPassRate { get; set; }
    public List<StatusDistributionDto> StatusDistribution { get; set; } = new();
    public List<DailyLoadDto> Last7DaysLoad { get; set; } = new();
    public int TotalStalledApplications { get; set; }
}

public class StatusDistributionDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class DailyLoadDto
{
    public string Date { get; set; } = string.Empty;
    public int Count { get; set; }
}
