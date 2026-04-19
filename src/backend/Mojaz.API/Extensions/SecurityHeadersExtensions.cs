using Microsoft.AspNetCore.Builder;
using DrivingLicenseIssuanceSystem.Infrastructure.Security.Middleware;

namespace DrivingLicenseIssuanceSystem.API.Extensions;

public static class SecurityHeadersExtensions
{
    public static IApplicationBuilder UseDrivingLicenseIssuanceSystemSecurityHeaders(this IApplicationBuilder app)
    {
        return app.UseMiddleware<SecurityHeadersMiddleware>();
    }
}
