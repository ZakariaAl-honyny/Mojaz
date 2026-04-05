using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;

namespace Mojaz.API.Extensions;

public static class CorsExtensions
{
    private static readonly string[] DefaultAllowedOrigins = { "http://localhost:3000" };

    public static IServiceCollection AddMojazCors(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("MojazCors", policy =>
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

    public static IApplicationBuilder UseMojazCors(this IApplicationBuilder app)
    {
        app.UseCors("MojazCors");
        return app;
    }
}
