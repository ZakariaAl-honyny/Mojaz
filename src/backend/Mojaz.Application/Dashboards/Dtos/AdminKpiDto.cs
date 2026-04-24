namespace Mojaz.Application.Dashboards.Dtos;

public class AdminKpiDto
{
    public AdminTodayStats TodayStats { get; set; } = new();
    public List<StatusData> StatusDistribution { get; set; } = new();
    public List<WeeklyTrend> WeeklyTrend { get; set; } = new();
    public List<ActivityItem> RecentActivity { get; set; } = new();
}

public class AdminTodayStats
{
    public int Applications { get; set; }
    public int Licenses { get; set; }
    public decimal Revenue { get; set; }
    public int ActiveUsers { get; set; }
    public decimal ApplicationsChange { get; set; }
    public decimal LicensesChange { get; set; }
    public decimal RevenueChange { get; set; }
    public decimal UsersChange { get; set; }
}

public class StatusData
{
    public string Name { get; set; } = string.Empty;
    public int Value { get; set; }
    public string Color { get; set; } = string.Empty;
}

public class WeeklyTrend
{
    public string Date { get; set; } = string.Empty;
    public int Applications { get; set; }
    public int Completed { get; set; }
}

public class ActivityItem
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
}