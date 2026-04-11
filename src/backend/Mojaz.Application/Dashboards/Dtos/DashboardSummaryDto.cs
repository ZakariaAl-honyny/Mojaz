using Mojaz.Application.Applications.Dtos;

namespace Mojaz.Application.Dashboards.Dtos;

public class DashboardSummaryDto
{
    public int ActiveApplicationsCount { get; set; }
    public int PendingActionsCount { get; set; }
    public List<ApplicationSummaryDto> Applications { get; set; } = new();
    public List<AppointmentSummaryDto> UpcomingAppointments { get; set; } = new();
    public List<RecentNotificationDto> RecentNotifications { get; set; } = new();
    public UserDashboardStats Stats { get; set; } = new();
}

public class RecentNotificationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}

public class UserDashboardStats
{
    public int TotalSubmitted { get; set; }
    public int TestsPassed { get; set; }
}

public class AppointmentSummaryDto
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string ServiceType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
