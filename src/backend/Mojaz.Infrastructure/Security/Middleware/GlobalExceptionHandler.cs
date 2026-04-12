using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mojaz.Application.Interfaces.Security;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Security.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IServiceProvider _serviceProvider;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var traceId = httpContext.TraceIdentifier;
        
        // Log the full exception details internally (never expose to client)
        _logger.LogError(exception, "An unhandled exception occurred. TraceId: {TraceId}", traceId);

        var (statusCode, message) = exception switch
        {
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "Unauthorized access."),
            ArgumentException => (HttpStatusCode.BadRequest, "Invalid argument provided."),
            KeyNotFoundException => (HttpStatusCode.NotFound, "The requested resource was not found."),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred. Please contact support with your Trace ID.")
        };

        if (statusCode == HttpStatusCode.Unauthorized || statusCode == HttpStatusCode.Forbidden)
        {
            var securityAlertService = httpContext.RequestServices.GetRequiredService<ISecurityAlertService>();
            
            await securityAlertService.ProcessSecurityEventAsync(
                "UNAUTHORIZED_ACCESS_ATTEMPT", 
                $"Unauthorized access at {httpContext.Request.Path}", 
                null, 
                httpContext.Connection.RemoteIpAddress?.ToString());
        }

        httpContext.Response.StatusCode = (int)statusCode;
        httpContext.Response.ContentType = "application/problem+json";

        var response = new ApiResponse<object>
        {
            Success = false,
            Message = message,
            StatusCode = (int)statusCode,
            Errors = new List<string> { $"TraceId: {traceId}" }
        };

        await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

        return true;
    }
}
