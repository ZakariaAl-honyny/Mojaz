using System.ComponentModel.DataAnnotations;

namespace Mojaz.Application.DTOs.SystemSettings;

public class UpdateSettingRequest
{
    [Required]
    public string Value { get; set; } = string.Empty;
}

public class SystemSettingDto
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? DataType { get; set; }
    public string? Description { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class UpdateSettingResponse
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
}