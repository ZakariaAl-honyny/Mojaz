namespace Mojaz.Application.DTOs.Email.Templates;

public class SecurityAlertEmailData
{
    public string UserFullName { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public string EventDetails { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
}
