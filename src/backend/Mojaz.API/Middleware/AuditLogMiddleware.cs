using Microsoft.AspNetCore.Http;
using Mojaz.Application.Interfaces.Services;
using Microsoft.AspNetCore.Builder;
using System.Security.Claims;
using System.Text.Json;

namespace Mojaz.API.Middleware;

public class AuditLogMiddleware
{
    private readonly RequestDelegate _next;

    public AuditLogMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IAuditService auditService)
    {
        var method = context.Request.Method;
        
        // Only log mutating requests
        if (method == HttpMethods.Post || method == HttpMethods.Put || method == HttpMethods.Patch || method == HttpMethods.Delete)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var path = context.Request.Path;

            // Simple audit log capture for the scaffold
            // In a real app, you might want to capture the body or the before/after state
            await auditService.LogAsync(
                action: $"{method} {path}",
                entityType: "API_REQUEST",
                entityId: userId ?? "Anonymous",
                newValues: $"Request from IP {context.Connection.RemoteIpAddress}"
            );
        }

        await _next(context);
    }
}

public static class AuditLoggingExtensions
{
    public static IApplicationBuilder UseMojazAuditLogging(this IApplicationBuilder app)
    {
        return app.UseMiddleware<AuditLogMiddleware>();
    }
}
