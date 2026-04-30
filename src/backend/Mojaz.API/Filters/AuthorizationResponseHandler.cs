using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Mojaz.Shared;
using System.Text.Json;

namespace Mojaz.API.Filters;

/// <summary>
/// Custom role requirement for authorization handler.
/// </summary>
public class RoleRequirement : IAuthorizationRequirement
{
    public string RequiredRole { get; }

    public RoleRequirement(string requiredRole)
    {
        RequiredRole = requiredRole;
    }
}

/// <summary>
/// Custom authorization handler for role-based authorization that returns proper JSON ApiResponse on failures.
/// Handles 403 Forbidden responses when user is authenticated but lacks required role.
/// </summary>
public class AuthorizationHandler : AuthorizationHandler<RoleRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthorizationHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        RoleRequirement requirement)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            context.Fail();
            return Task.CompletedTask;
        }

        if (!context.User.Identity?.IsAuthenticated ?? true)
        {
            // User is not authenticated - return 401
            context.Fail();
            return Task.CompletedTask;
        }

        // Check if user has the required role
        if (!string.IsNullOrEmpty(requirement.RequiredRole) && !context.User.IsInRole(requirement.RequiredRole))
        {
            // User is authenticated but lacks required role - should return 403
            context.Fail();
            return Task.CompletedTask;
        }

        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}

/// <summary>
/// Custom authorization middleware result handler that returns proper JSON ApiResponse on authorization failures.
/// Handles both 401 Unauthorized and 403 Forbidden responses.
/// </summary>
public class AuthorizationResponseHandler : IAuthorizationMiddlewareResultHandler
{
    private readonly AuthorizationMiddlewareResultHandler _defaultHandler = new();

    public async Task HandleAsync(RequestDelegate next, HttpContext context, AuthorizationPolicy policy, PolicyAuthorizationResult policyResult)
    {
        // Check if authorization failed
        if (policyResult.Forbidden || policyResult.Challenged)
        {
            // Set response content type to JSON
            context.Response.ContentType = "application/json";

            // Determine the status code and message
            var (statusCode, message) = policyResult.Forbidden
                ? (StatusCodes.Status403Forbidden, "غير مصرح لك بالوصول إلى هذا المورد")
                : (StatusCodes.Status401Unauthorized, "يرجى تسجيل الدخول للوصول إلى هذا المورد");

            context.Response.StatusCode = statusCode;

            // Create proper ApiResponse
            var apiResponse = new ApiResponse<object>
            {
                Success = false,
                Message = message,
                Data = null,
                Errors = null,
                StatusCode = statusCode
            };

            // Write JSON response
            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(apiResponse, jsonOptions));
            return;
        }

        // Let default handler process successful authorization
        await _defaultHandler.HandleAsync(next, context, policy, policyResult);
    }
}