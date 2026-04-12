namespace Mojaz.Application.DTOs.Application;

public class LicenseCategoryDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public int MinAge { get; set; }
    public string? Description { get; set; }
}
