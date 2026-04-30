using Mojaz.Domain.Enums;

namespace Mojaz.Application.DTOs.FeeStructures;

public class FeeStructureDto
{
    public int Id { get; set; }
    public FeeType FeeType { get; set; }
    public string FeeTypeName { get; set; } = string.Empty;
    public int? LicenseCategoryId { get; set; }
    public string? LicenseCategoryName { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateFeeStructureRequest
{
    public FeeType FeeType { get; set; }
    public int? LicenseCategoryId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public string? Description { get; set; }
}

public class UpdateFeeStructureRequest
{
    public FeeType? FeeType { get; set; }
    public int? LicenseCategoryId { get; set; }
    public decimal? Amount { get; set; }
    public string? Currency { get; set; }
    public DateTime? EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool? IsActive { get; set; }
    public string? Description { get; set; }
}