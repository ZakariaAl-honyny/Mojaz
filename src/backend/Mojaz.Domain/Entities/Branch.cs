namespace Mojaz.Domain.Entities;

public class Branch : SoftDeletableEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
}