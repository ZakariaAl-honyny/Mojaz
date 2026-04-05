using System.Threading.Tasks;

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
}
