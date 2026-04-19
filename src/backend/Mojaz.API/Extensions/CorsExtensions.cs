using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;

namespace DrivingLicenseIssuanceSystem.API.Extensions;

public static class CorsExtensions
{
    private static readonly string[] DefaultAllowedOrigins = { "http://localhost:3000" };

    public static IServiceCollection AddDrivingLicenseIssuanceSystemCors(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("DrivingLicenseIssuanceSystemCors", policy =>
            {
                policy.WithOrigins(
                        configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                        ?? DefaultAllowedOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        return services;
    }

    public static IApplicationBuilder UseDrivingLicenseIssuanceSystemCors(this IApplicationBuilder app)
    {
        app.UseCors("DrivingLicenseIssuanceSystemCors");
        return app;
    }
}
