using Mojaz.Domain.Enums;

namespace Mojaz.Application.Applications.Dtos;

public class ApplicationSummaryDto
{
    public int Id { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public string ApplicantName { get; set; } = string.Empty;
    public string LicenseCategoryCode { get; set; } = string.Empty;
    public string ServiceType { get; set; } = string.Empty;
    public string CurrentStage { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; }
    public DateTime SubmittedDate { get; set; }
    public DateTime UpdatedAt { get; set; }
}
