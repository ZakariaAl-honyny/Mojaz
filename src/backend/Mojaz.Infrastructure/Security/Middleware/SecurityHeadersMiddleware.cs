using Microsoft.AspNetCore.Http;
using Mojaz.Shared.Constants;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Security.Middleware;

public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // OWASP Recommended Headers
        context.Response.Headers[SecurityConstants.Headers.XContentTypeOptions] = "nosniff";
        context.Response.Headers[SecurityConstants.Headers.XFrameOptions] = "DENY";
        context.Response.Headers[SecurityConstants.Headers.StrictTransportSecurity] = "max-age=31536000; includeSubDomains";
        context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
        context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        
        // Basic Content Security Policy (Should be tightened in production based on needs)
        context.Response.Headers[SecurityConstants.Headers.ContentSecurityPolicy] = 
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';";

        await _next(context);
    }
}
