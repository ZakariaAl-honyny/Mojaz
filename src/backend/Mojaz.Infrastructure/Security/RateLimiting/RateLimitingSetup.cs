using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.DependencyInjection;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared.Constants;
using System.Threading.RateLimiting;

namespace Mojaz.Infrastructure.Security.RateLimiting;

public static class RateLimitingSetup
{
    public static IServiceCollection AddMojazRateLimiting(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            // Authentication Rate Limit (e.g., login, register, OTP)
            options.AddPolicy(SecurityConstants.Policies.AuthRateLimit, context =>
            {
                var settingsService = context.RequestServices.GetRequiredService<ISystemSettingsService>();
                
                // We use Task.Run because the limiter factory is synchronous but the service is async
                // Better: Use a synchronous cache or block (usually settings are small and cached)
                var permitLimit = settingsService.GetIntAsync(SecurityConstants.Settings.AuthPermitLimit).Result ?? 10;
                var windowSeconds = settingsService.GetIntAsync(SecurityConstants.Settings.AuthWindowSeconds).Result ?? 60;

                return RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = permitLimit,
                        Window = TimeSpan.FromSeconds(windowSeconds),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
            });

            // Global API Rate Limit
            options.AddPolicy(SecurityConstants.Policies.GlobalRateLimit, context =>
            {
                var settingsService = context.RequestServices.GetRequiredService<ISystemSettingsService>();
                
                var permitLimit = settingsService.GetIntAsync(SecurityConstants.Settings.GlobalPermitLimit).Result ?? 100;
                var windowSeconds = settingsService.GetIntAsync(SecurityConstants.Settings.GlobalWindowSeconds).Result ?? 60;

                return RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = permitLimit,
                        Window = TimeSpan.FromSeconds(windowSeconds),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
            });
        });

        return services;
    }
}
