using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Mojaz.API.Extensions;

public static class SecurityHeadersExtensions
{
    public static IApplicationBuilder UseMojazSecurityHeaders(this IApplicationBuilder app)
    {
        app.Use(async (context, next) =>
        {
            context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
            context.Response.Headers.Append("X-Frame-Options", "DENY");
            context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
            context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
            context.Response.Headers.Append("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;");
            context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
            
            await next();
        });

        return app;
    }
}
