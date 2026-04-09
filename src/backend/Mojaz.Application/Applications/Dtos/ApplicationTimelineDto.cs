namespace Mojaz.Application.Applications.Dtos;

public class ApplicationTimelineDto
{
    public int ApplicationId { get; set; }
    public int CurrentStageNumber { get; set; }
    public List<TimelineStageDto> Stages { get; set; } = new();
}

public class TimelineStageDto
{
    public int StageNumber { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty; // completed | current | failed | future
    public DateTime? CompletedAt { get; set; }
    public string? ActorName { get; set; }
    public string? ActorRole { get; set; }
    public string? OutcomeNote { get; set; }
}
