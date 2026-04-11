namespace Mojaz.Application.DTOs.Application;

public class Gate4ValidationResultDto
{
    public Guid ApplicationId { get; set; }
    public bool IsFullyPassed { get; set; }
    public List<Gate4ConditionDto> Conditions { get; set; } = new();
}

public class Gate4ConditionDto
{
    public string Key { get; set; } = string.Empty;
    public string LabelAr { get; set; } = string.Empty;
    public string LabelEn { get; set; } = string.Empty;
    public bool IsPassed { get; set; }
    public string? FailureMessageAr { get; set; }
    public string? FailureMessageEn { get; set; }
}