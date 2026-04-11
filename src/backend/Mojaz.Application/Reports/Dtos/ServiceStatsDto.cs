namespace Mojaz.Application.Reports.Dtos;

public class ServiceStatsDto
{
    public string ServiceType { get; set; } = string.Empty;
    public int Count { get; set; }
    public double? GrowthRate { get; set; }
}
