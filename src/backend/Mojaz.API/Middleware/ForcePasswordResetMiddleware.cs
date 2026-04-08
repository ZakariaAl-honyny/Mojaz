using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Mojaz.API.Middleware;

public class ForcePasswordResetMiddleware : IMiddleware
{
    private readonly IConfiguration _configuration;

    public ForcePasswordResetMiddleware(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // Only check for authenticated users
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var requiresPasswordResetClaim = context.User.FindFirst("RequiresPasswordReset");
            if (requiresPasswordResetClaim != null && 
                bool.TryParse(requiresPasswordResetClaim.Value, out var requiresReset) && 
                requiresReset)
            {
                // Check if the user is trying to access the password reset endpoint
                var path = context.Request.Path.Value?.ToLower() ?? "";
                var isResetEndpoint = path.Contains("/auth/change-password") || 
                                     path.Contains("/auth/reset-password");

                if (!isResetEndpoint)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonSerializer.Serialize(new
                    {
                        success = false,
                        message = "Password reset required",
                        statusCode = StatusCodes.Status403Forbidden
                    }));
                    return;
                }
            }
        }

        await next(context);
    }
}

public class ForcePasswordResetAttribute : TypeFilterAttribute
{
    public ForcePasswordResetAttribute() : base(typeof(ForcePasswordResetFilter))
    {
    }
}

public class ForcePasswordResetFilter : IAsyncAuthorizationFilter
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ForcePasswordResetFilter(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        
        if (user.Identity?.IsAuthenticated == true)
        {
            var requiresPasswordResetClaim = user.FindFirst("RequiresPasswordReset");
            if (requiresPasswordResetClaim != null && 
                bool.TryParse(requiresPasswordResetClaim.Value, out var requiresReset) && 
                requiresReset)
            {
                var path = context.HttpContext.Request.Path.Value?.ToLower() ?? "";
                var isResetEndpoint = path.Contains("/auth/change-password") || 
                                     path.Contains("/auth/reset-password");

                if (!isResetEndpoint)
                {
                    context.Result = new ObjectResult(new
                    {
                        success = false,
                        message = "Password reset required",
                        statusCode = StatusCodes.Status403Forbidden
                    })
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                }
            }
        }

        return Task.CompletedTask;
    }
}