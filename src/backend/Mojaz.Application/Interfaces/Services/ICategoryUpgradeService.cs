using Mojaz.Domain.Enums;
using Mojaz.Shared;

namespace Mojaz.Application.Interfaces.Services;

public interface ICategoryUpgradeService
{
    /// <summary>
    /// Validates if an upgrade path from one category to another is permissible.
    /// </summary>
    Task<bool> ValidateUpgradePathAsync(LicenseCategoryCode from, LicenseCategoryCode to);

    /// <summary>
    /// Checks if the current license has been held for the minimum required period before an upgrade can be requested.
    /// </summary>
    Task<bool> CheckHoldingPeriodAsync(Guid licenseId, Guid currentUserId);

    /// <summary>
    /// Calculates the applicable fees for upgrading to the target category.
    /// </summary>
    Task<decimal> CalculateUpgradeFeesAsync(LicenseCategoryCode targetCategory);

    /// <summary>
    /// Determines the reduced training hours required when upgrading from a specific category.
    /// </summary>
    Task<int> GetReducedTrainingHoursAsync(LicenseCategoryCode from, LicenseCategoryCode to);

    /// <summary>
    /// Archives the existing license upon successful completion of the upgrade process.
    /// </summary>
    Task<bool> ArchiveExistingLicenseAsync(Guid licenseId);
}
