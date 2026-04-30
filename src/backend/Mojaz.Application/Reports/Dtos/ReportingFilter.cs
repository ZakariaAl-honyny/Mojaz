using System;

namespace Mojaz.Application.Reports.Dtos;

public class ReportingFilter
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? BranchId { get; set; }
    public int? LicenseCategoryId { get; set; }
    public string? Role { get; set; }
}
