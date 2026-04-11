namespace Mojaz.Application.Reports.Dtos;

public class TestPerformanceDto
{
    public string TestType { get; set; } = string.Empty; // "Theory" | "Practical"
    public int TotalTaken { get; set; }
    public int PassedCount { get; set; }
    public int FailedCount { get; set; }
    public double PassRate { get; set; }
    public double AverageScore { get; set; }
}
