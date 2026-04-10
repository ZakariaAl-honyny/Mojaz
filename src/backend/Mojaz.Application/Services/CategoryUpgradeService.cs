using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;

namespace Mojaz.Application.Services;

public class CategoryUpgradeService : ICategoryUpgradeService
{
    private readonly ISystemSettingsService _settingsService;
    private readonly IFeeStructureRepository _feeRepository;
    private readonly ILicenseRepository _licenseRepository;
    private readonly IRepository<Mojaz.Domain.Entities.LicenseCategory> _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CategoryUpgradeService(
        ISystemSettingsService settingsService,
        IFeeStructureRepository feeRepository,
        ILicenseRepository licenseRepository,
        IRepository<Mojaz.Domain.Entities.LicenseCategory> categoryRepository,
        IUnitOfWork unitOfWork)
    {
        _settingsService = settingsService;
        _feeRepository = feeRepository;
        _licenseRepository = licenseRepository;
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> ValidateUpgradePathAsync(LicenseCategoryCode from, LicenseCategoryCode to)
    {
        var pathsValue = await _settingsService.GetAsync("ALLOWED_UPGRADE_PATHS");
        if (string.IsNullOrEmpty(pathsValue))
        {
            // Fallback hardcoded paths if setting is missing
            return (from, to) switch
            {
                (LicenseCategoryCode.B, LicenseCategoryCode.C) => true,
                (LicenseCategoryCode.C, LicenseCategoryCode.D) => true,
                (LicenseCategoryCode.D, LicenseCategoryCode.E) => true,
                (LicenseCategoryCode.F, LicenseCategoryCode.B) => true,
                _ => false
            };
        }

        var requestedPath = $"{from}-{to}";
        var allowedPaths = pathsValue.Split(',', StringSplitOptions.RemoveEmptyEntries);
        return allowedPaths.Contains(requestedPath);
    }

    public async Task<bool> CheckHoldingPeriodAsync(Guid licenseId, Guid currentUserId)
    {
        var license = await _licenseRepository.GetByIdAsync(licenseId);
        if (license == null || license.HolderId != currentUserId) return false;

        var settingValue = await _settingsService.GetAsync("MIN_HOLDING_PERIOD_UPGRADE_MONTHS");
        if (!int.TryParse(settingValue, out int minMonths))
        {
            minMonths = 12; // Default fallback
        }

        var now = DateTime.UtcNow;
        var issuedAt = license.IssuedAt;

        int months = ((now.Year - issuedAt.Year) * 12) + now.Month - issuedAt.Month;
        if (now.Day < issuedAt.Day) months--;

        return months >= minMonths;
    }

    public async Task<decimal> CalculateUpgradeFeesAsync(LicenseCategoryCode targetCategory)
    {
        var category = (await _categoryRepository.FindAsync(c => c.Code == targetCategory)).FirstOrDefault();
        var fee = await _feeRepository.GetActiveFeeAsync(FeeType.CategoryUpgrade, category?.Id);
        return fee?.Amount ?? 0;
    }

    public async Task<int> GetReducedTrainingHoursAsync(LicenseCategoryCode from, LicenseCategoryCode to)
    {
        var baseHoursStr = await _settingsService.GetAsync($"MIN_TRAINING_HOURS_CATEGORY_{to}");
        var reductionStr = await _settingsService.GetAsync("UPGRADE_TRAINING_REDUCTION_PCNT");

        if (!int.TryParse(baseHoursStr, out int baseHours) || !int.TryParse(reductionStr, out int reductionPercent))
        {
            baseHours = 20;
            reductionPercent = 0;
        }

        double reducedHours = baseHours * (1 - reductionPercent / 100.0);
        return (int)Math.Ceiling(reducedHours);
    }

     public async Task<bool> ArchiveExistingLicenseAsync(Guid licenseId)
     {
         var license = await _licenseRepository.GetByIdAsync(licenseId);
         if (license != null)
         {
             license.Status = LicenseStatus.Superseded;
             license.IsDeleted = true;
             license.UpdatedAt = DateTime.UtcNow;
             await _licenseRepository.UpdateAsync(license);
             await _unitOfWork.SaveChangesAsync();
             return true;
         }
         return false;
     }
}
