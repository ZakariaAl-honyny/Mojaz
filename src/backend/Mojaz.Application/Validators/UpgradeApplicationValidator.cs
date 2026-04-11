using FluentValidation;
using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Domain.Entities;
using Mojaz.Application.Interfaces.Services;

namespace Mojaz.Application.Validators;

public class UpgradeApplicationValidator : AbstractValidator<UpgradeApplicationRequest>
{
    private readonly IRepository<LicenseCategory> _categoryRepository;
    private readonly IRepository<Domain.Entities.License> _licenseRepository;

    // Allowed upgrade paths from Category F
    private static readonly Dictionary<LicenseCategoryCode, List<LicenseCategoryCode>> AllowedUpgradesFromF = new()
    {
        { LicenseCategoryCode.F, new List<LicenseCategoryCode> { LicenseCategoryCode.B } } // F -> B only
    };

    public UpgradeApplicationValidator(
        IRepository<LicenseCategory> categoryRepository,
        IRepository<Domain.Entities.License> licenseRepository)
    {
        _categoryRepository = categoryRepository;
        _licenseRepository = licenseRepository;

        RuleFor(x => x.CurrentLicenseId)
            .NotEmpty().WithMessage("Current license ID is required.")
            .MustAsync(HaveValidActiveLicense).WithMessage("You must have a valid active license to upgrade.");

        RuleFor(x => x.TargetCategoryId)
            .NotEmpty().WithMessage("Target category is required.")
            .MustAsync(BeValidUpgradeTarget).WithMessage("This upgrade path is not allowed. Category F can only be upgraded to Category B (Private Car).");
    }

    private async Task<bool> HaveValidActiveLicense(Guid licenseId, CancellationToken cancellationToken)
    {
        var license = await _licenseRepository.GetByIdAsync(licenseId);
        return license != null && license.Status == LicenseStatus.Active && !license.IsDeleted;
    }

    private async Task<bool> BeValidUpgradeTarget(UpgradeApplicationRequest request, Guid targetCategoryId, CancellationToken cancellationToken)
    {
        // Get current license to find source category
        var currentLicense = await _licenseRepository.GetByIdAsync(request.CurrentLicenseId, cancellationToken);
        if (currentLicense == null || currentLicense.LicenseCategory == null) return false;

        var sourceCategoryCode = currentLicense.LicenseCategory.Code;

        // Get target category
        var targetCategory = await _categoryRepository.GetByIdAsync(targetCategoryId, cancellationToken);
        if (targetCategory == null) return false;

        // Check if this upgrade path is allowed
        if (AllowedUpgradesFromF.TryGetValue(sourceCategoryCode, out var allowedTargets))
        {
            return allowedTargets.Contains(targetCategory.Code);
        }

        // For other categories, default to allowing B, C, D upgrades if they have higher minimum ages
        // This is a simplified rule - in production, you'd have a full matrix
        return true;
    }
}