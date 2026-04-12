using System;

namespace Mojaz.Application.Reports.Dtos;

public class ReportingFilter
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid? BranchId { get; set; }
    public Guid? LicenseCategoryId { get; set; }
    public string? Role { get; set; }
}
