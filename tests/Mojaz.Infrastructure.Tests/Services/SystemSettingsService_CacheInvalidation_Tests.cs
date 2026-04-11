using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using FluentAssertions;
using Mojaz.Application.DTOs.SystemSettings;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using Mojaz.Infrastructure.Services;
using Moq;
using Xunit;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace Mojaz.Infrastructure.Tests.Services;

public class SystemSettingsService_CacheInvalidation_Tests
{
    private readonly Mock<IRepository<SystemSetting>> _settingsRepo = new();
    private readonly MemoryCache _memoryCache = new(Options.Create(new MemoryCacheOptions()));

    private SystemSettingsService CreateService() => new(
        _settingsRepo.Object,
        _memoryCache
    );

    [Fact]
    public async Task GetAsync_CachesValue_ReturnsCachedValueOnSecondCall()
    {
        // Arrange
        var service = CreateService();
        var key = "TEST_KEY";
        var value = "TEST_VALUE";
        var setting = new SystemSetting { SettingKey = key, SettingValue = value };

        _settingsRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<SystemSetting, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new SystemSetting[] { setting });

        // Act
        var result1 = await service.GetAsync(key);
        var result2 = await service.GetAsync(key);

        // Assert
        result1.Should().Be(value);
        result2.Should().Be(value);
        
        // Verify repository was called exactly once (first call misses cache and populates it, second call hits cache)
        _settingsRepo.Verify(r => r.FindAsync(It.IsAny<Expression<Func<SystemSetting, bool>>>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_InvalidatesCache_CacheMissAfterUpdate()
    {
        // Arrange
        var service = CreateService();
        var key = "TEST_KEY";
        var oldValue = "OLD_VALUE";
        var newValue = "NEW_VALUE";
        var setting = new SystemSetting { SettingKey = key, SettingValue = oldValue };

        _settingsRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<SystemSetting, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new SystemSetting[] { setting });

        // Act - First call populates cache
        await service.GetAsync(key);
        
        // Update should invalidate cache
        var updateResult = await service.UpdateAsync(key, newValue);
        
        // Second GetAsync should miss cache and go to DB
        var uncachedResult = await service.GetAsync(key);

        // Assert
        updateResult.Should().BeTrue();
        uncachedResult.Should().Be(newValue);
        
        // Verify repository was called three times:
        // 1. First GetAsync (populate cache)
        // 2. UpdateAsync (find setting to update)
        // 3. Second GetAsync (after cache invalidation)
        _settingsRepo.Verify(r => r.FindAsync(It.IsAny<Expression<Func<SystemSetting, bool>>>(), It.IsAny<CancellationToken>()), Times.Exactly(3));
    }

    [Fact]
    public void InvalidateCache_RemovesCorrectCacheEntry()
    {
        // Arrange
        var service = CreateService();
        var key = "TEST_KEY";
        
        // Populate cache
        _memoryCache.Set("SystemSetting_" + key, "test value");

        // Act
        service.InvalidateCache(key);

        // Assert
        _memoryCache.TryGetValue("SystemSetting_" + key, out string? cachedValue).Should().BeFalse();
    }
}