using Microsoft.Extensions.Caching.Memory;
using Mojaz.Application.DTOs.SystemSettings;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Services;

public class SystemSettingsService : ISystemSettingsService
{
    private readonly IRepository<SystemSetting> _settingsRepository;
    private readonly IMemoryCache _cache;
    private const string CachePrefix = "SystemSetting_";

    public SystemSettingsService(IRepository<SystemSetting> settingsRepository, IMemoryCache cache)
    {
        _settingsRepository = settingsRepository;
        _cache = cache;
    }

    public async Task<string?> GetAsync(string key)
    {
        // Try cache first
        var cacheKey = CachePrefix + key;
        if (_cache.TryGetValue(cacheKey, out string? cachedValue))
        {
            return cachedValue;
        }

        var settings = await _settingsRepository.FindAsync(s => s.SettingKey == key);
        var setting = settings.FirstOrDefault();
        if (setting != null)
        {
            var options = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(30))
                .SetSlidingExpiration(TimeSpan.FromMinutes(10));
            _cache.Set(cacheKey, setting.SettingValue, options);
            return setting.SettingValue;
        }
        return null;
    }

    public async Task<int?> GetIntAsync(string key)
    {
        var value = await GetAsync(key);
        if (int.TryParse(value, out var result))
            return result;
        return null;
    }

    public async Task<IEnumerable<SystemSettingDto>> GetAllAsync()
    {
        var settings = await _settingsRepository.GetAllAsync();
        return settings.Select(s => new SystemSettingDto
        {
            Key = s.SettingKey,
            Value = s.SettingValue,
            Description = s.Description,
            UpdatedAt = s.UpdatedAt
        });
    }

    public async Task<bool> UpdateAsync(string key, string value)
    {
        var settings = await _settingsRepository.FindAsync(s => s.SettingKey == key);
        var setting = settings.FirstOrDefault();
        
        if (setting == null)
            return false;

        setting.SettingValue = value;
        _settingsRepository.Update(setting);
        
        // Invalidate cache immediately
        InvalidateCache(key);
        
        return true;
    }

    public void InvalidateCache(string key)
    {
        var cacheKey = CachePrefix + key;
        _cache.Remove(cacheKey);
    }
}
