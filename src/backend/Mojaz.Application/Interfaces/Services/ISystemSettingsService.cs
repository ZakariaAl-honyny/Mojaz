using System.Threading.Tasks;
using Mojaz.Application.DTOs.SystemSettings;

namespace Mojaz.Application.Interfaces.Services;

public interface ISystemSettingsService
{
    /// <summary>
    /// Gets a system setting value by key (e.g., "MIN_AGE_CATEGORY_A").
    /// </summary>
    /// <param name="key">The setting key.</param>
    /// <returns>The setting value as string, or null if not found.</returns>
    Task<string?> GetAsync(string key);

    /// <summary>
    /// Gets a system setting value by key and converts to int.
    /// </summary>
    /// <param name="key">The setting key.</param>
    /// <returns>The setting value as int, or null if not found or not an int.</returns>
    Task<int?> GetIntAsync(string key);

    /// <summary>
    /// Gets all system settings.
    /// </summary>
    Task<IEnumerable<SystemSettingDto>> GetAllAsync();

    /// <summary>
    /// Updates a system setting value.
    /// </summary>
    /// <param name="key">The setting key.</param>
    /// <param name="value">The new value.</param>
    /// <returns>True if updated successfully.</returns>
    Task<bool> UpdateAsync(string key, string value);

    /// <summary>
    /// Invalidates the cache for a specific setting.
    /// </summary>
    void InvalidateCache(string key);
}
