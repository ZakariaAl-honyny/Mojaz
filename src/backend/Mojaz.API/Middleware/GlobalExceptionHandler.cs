using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Mojaz.Shared.Exceptions;
using Mojaz.Shared.Models;
using Microsoft.AspNetCore.Builder;
using System.Net;
using System.Text.Json;
using System.Data;

namespace Mojaz.API.Middleware;

public class GlobalExceptionHandler
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IHostEnvironment _env;

    public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var (statusCode, message, errors) = ExtractExceptionDetails(exception);

        var response = ApiResponse<object>.Fail(statusCode, message, errors);
        context.Response.StatusCode = statusCode;
        
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
    }

    private (int statusCode, string message, List<string>? errors) ExtractExceptionDetails(Exception exception)
    {
        // Handle known custom exceptions first
        if (exception is NotFoundException)
            return ((int)HttpStatusCode.NotFound, exception.Message, null);
        if (exception is ValidationException valEx)
            return ((int)HttpStatusCode.BadRequest, valEx.Message, valEx.Errors);
        if (exception is UnauthorizedException)
            return ((int)HttpStatusCode.Unauthorized, exception.Message, null);
        if (exception is ForbiddenException)
            return ((int)HttpStatusCode.Forbidden, exception.Message, null);
        if (exception is ConflictException)
            return ((int)HttpStatusCode.Conflict, exception.Message, null);

        // Handle Entity Framework Core database exceptions
        var efCoreException = GetUnderlyingException(exception);
        
        if (_env.IsDevelopment())
        {
            // In development, provide detailed error information
            var detailedMessage = efCoreException.Message;
            
            // Check for specific database constraint violations
            if (efCoreException.Message.Contains("UNIQUE constraint") || efCoreException.Message.Contains("duplicate key"))
            {
                return ((int)HttpStatusCode.Conflict, "A record with this value already exists. Please use a different value.", new List<string> { detailedMessage });
            }
            if (efCoreException.Message.Contains("REFERENCE constraint") || efCoreException.Message.Contains("foreign key"))
            {
                return ((int)HttpStatusCode.BadRequest, "Related record not found or cannot be deleted.", new List<string> { detailedMessage });
            }
            if (efCoreException.Message.Contains("CHECK constraint") || efCoreException.Message.Contains("violates check constraint"))
            {
                return ((int)HttpStatusCode.BadRequest, "Invalid data value. Please check the input data.", new List<string> { detailedMessage });
            }
            if (efCoreException.Message.Contains("Cannot insert the value NULL") || efCoreException.Message.Contains("cannot be null"))
            {
                var match = System.Text.RegularExpressions.Regex.Match(efCoreException.Message, @"column '(\w+)'");
                var column = match.Success ? match.Groups[1].Value : "required field";
                return ((int)HttpStatusCode.BadRequest, $"The field '{column}' is required.", new List<string> { detailedMessage });
            }
            
            return ((int)HttpStatusCode.InternalServerError, $"Database error: {detailedMessage}", new List<string> { efCoreException.StackTrace ?? "" });
        }
        else
        {
            // In production, provide generic message but log details
            _logger.LogError("Database error in {Environment}: {Message}", _env.EnvironmentName, efCoreException.Message);
            return ((int)HttpStatusCode.InternalServerError, "An error occurred while saving your changes. Please try again.", null);
        }
    }

    private Exception GetUnderlyingException(Exception exception)
    {
        // Walk the InnerException chain to find the root cause
        var current = exception;
        while (current.InnerException != null)
        {
            current = current.InnerException;
        }
        return current;
    }
}

public static class GlobalExceptionHandlerExtensions
{
    public static IApplicationBuilder UseMojazExceptionHandler(this IApplicationBuilder app)
    {
        return app.UseMiddleware<GlobalExceptionHandler>();
    }
}
