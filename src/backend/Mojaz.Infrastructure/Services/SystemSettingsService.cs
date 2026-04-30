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
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;
    private readonly IAuditService _auditService;
    private const string CachePrefix = "SystemSetting_";

    public SystemSettingsService(
        IRepository<SystemSetting> settingsRepository,
        IUnitOfWork unitOfWork,
        IMemoryCache cache, 
        IAuditService auditService)
    {
        _settingsRepository = settingsRepository;
        _unitOfWork = unitOfWork;
        _cache = cache;
        _auditService = auditService;
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

        var oldValue = setting.SettingValue;
        setting.SettingValue = value;
        _settingsRepository.Update(setting);
        
        // Invalidate cache immediately
        InvalidateCache(key);

        // Audit log for setting modification
        await _auditService.LogAsync(
            "UPDATE_SYSTEM_SETTING",
            "SystemSetting",
            key,
            oldValue,
            value);

        return true;
    }

    public void InvalidateCache(string key)
    {
        var cacheKey = CachePrefix + key;
        _cache.Remove(cacheKey);
    }

    public async Task<bool> CreateAsync(CreateSettingRequest request)
    {
        // Check if setting already exists
        var existingSettings = await _settingsRepository.FindAsync(s => s.SettingKey == request.Key);
        if (existingSettings.Any())
        {
            return false; // Setting already exists
        }

        var setting = new SystemSetting
        {
            SettingKey = request.Key,
            SettingValue = request.Value,
            Category = request.Category,
            Description = request.Description,
            IsEncrypted = request.IsEncrypted,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _settingsRepository.AddAsync(setting);
        await _unitOfWork.SaveChangesAsync();

        // Audit log for setting creation
        await _auditService.LogAsync(
            "CREATE_SYSTEM_SETTING",
            "SystemSetting",
            request.Key,
            null,
            request.Value);

        return true;
    }
}
