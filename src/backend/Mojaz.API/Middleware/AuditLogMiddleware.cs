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

            // Log concise action: "POST /applications" not full URL with UUID
            var actionName = $"{method} {GetConciseAction(path)}";
            
            await auditService.LogAsync(
                actionName,
                "API_REQUEST",
                userId ?? "Anonymous",
                null,
                $"IP: {context.Connection.RemoteIpAddress}"
            );
        }

        await _next(context);
    }

    /// <summary>
    /// Extract concise action from path, removing UUIDs and excessive detail.
    /// </summary>
    private static string GetConciseAction(string path)
    {
        // /api/v1/applications/8842620f.../wizard-data -> /applications/{id}/wizard-data
        var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length < 2) return path;

        // Build concise path
        var result = new List<string>();
        foreach (var seg in segments.Skip(1)) // Skip 'api' prefix
        {
            if (seg.Length > 36 && seg.Contains('-')) // Likely a UUID
                result.Add("{id}");
            else
                result.Add(seg);
        }
        return "/" + string.Join("/", result);
    }
}

public static class AuditLoggingExtensions
{
    public static IApplicationBuilder UseMojazAuditLogging(this IApplicationBuilder app)
    {
        return app.UseMiddleware<AuditLogMiddleware>();
    }
}
