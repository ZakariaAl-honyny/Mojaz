using Mojaz.Domain.Enums;

namespace Mojaz.Application.Applications.Dtos;

public class ApplicationSummaryDto
{
    public Guid Id { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public string ApplicantName { get; set; } = string.Empty;
    public LicenseCategoryCode LicenseCategoryCode { get; set; }
    public ServiceType ServiceType { get; set; }
    public string CurrentStage { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; }
    public DateTime SubmittedDate { get; set; }
    public DateTime UpdatedAt { get; set; }
}
