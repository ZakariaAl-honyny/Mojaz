using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Services;

public class SystemSettingsService : ISystemSettingsService
{
    private readonly IRepository<SystemSetting> _settingsRepository;

    public SystemSettingsService(IRepository<SystemSetting> settingsRepository)
    {
        _settingsRepository = settingsRepository;
    }

    public async Task<string?> GetAsync(string key)
    {
        var settings = await _settingsRepository.FindAsync(s => s.SettingKey == key);
        var setting = settings.FirstOrDefault();
        return setting?.SettingValue;
    }

    public async Task<int?> GetIntAsync(string key)
    {
        var value = await GetAsync(key);
        if (int.TryParse(value, out var result))
            return result;
        return null;
    }
}
