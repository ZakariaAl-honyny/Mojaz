using System;

namespace Mojaz.Application.Reports.Dtos;

public class EmployeeActivityDto
{
    public Guid EmployeeId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "Doctor" | "Examiner"
    public int TotalAssessments { get; set; }
    public int TotalFinalized { get; set; }
}
