using Mojaz.Application.Applications.Dtos;

namespace Mojaz.Application.Dashboards.Dtos;

public class EmployeeDashboardDto
{
    public int PendingAppointments { get; set; }
    public int CompletedToday { get; set; }
    public int WaitingInQueue { get; set; }
    public List<ApplicationSummaryDto> RecentApplications { get; set; } = new();
}

public class ReceptionistDashboardDto
{
    public int PendingApplications { get; set; }
    public int WaitingInQueue { get; set; }
    public int ProcessedToday { get; set; }
    public List<ApplicationSummaryDto> QueueApplications { get; set; } = new();
}