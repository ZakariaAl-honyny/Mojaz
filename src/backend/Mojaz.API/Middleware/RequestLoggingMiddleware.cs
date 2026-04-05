using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Builder;
using System.Diagnostics;

namespace Mojaz.API.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        var request = context.Request;

        try
        {
            await _next(context);
            sw.Stop();

            var statusCode = context.Response.StatusCode;
            var level = statusCode >= 500 ? LogLevel.Error : (statusCode >= 400 ? LogLevel.Warning : LogLevel.Information);

            _logger.Log(level, "HTTP {Method} {Path} responded {StatusCode} in {Elapsed:0.0000} ms",
                request.Method, request.Path, statusCode, sw.Elapsed.TotalMilliseconds);
        }
        catch (Exception)
        {
            sw.Stop();
            _logger.LogError("HTTP {Method} {Path} failed in {Elapsed:0.0000} ms",
                request.Method, request.Path, sw.Elapsed.TotalMilliseconds);
            throw;
        }
    }
}

public static class RequestLoggingExtensions
{
    public static IApplicationBuilder UseMojazRequestLogging(this IApplicationBuilder app)
    {
        return app.UseMiddleware<RequestLoggingMiddleware>();
    }
}
