using Microsoft.AspNetCore.Builder;
using Mojaz.Infrastructure.Security.Middleware;

namespace Mojaz.API.Extensions;

public static class SecurityHeadersExtensions
{
    public static IApplicationBuilder UseMojazSecurityHeaders(this IApplicationBuilder app)
    {
        return app.UseMiddleware<SecurityHeadersMiddleware>();
    }
}
