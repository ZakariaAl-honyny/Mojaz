using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using System;
using System.Linq;

namespace Mojaz.API.Middleware
{
    /// <summary>
    /// Middleware to enforce that applicants can only access their own applications.
    /// Should be registered before MVC in the pipeline.
    /// </summary>
    public class OwnershipCheckMiddleware
    {
        private readonly RequestDelegate _next;

        public OwnershipCheckMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Only check for authenticated users
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var role = context.User.FindFirstValue(ClaimTypes.Role);
                if (string.Equals(role, "Applicant", StringComparison.OrdinalIgnoreCase))
                {
                    var routeData = context.GetRouteData();
                    var path = context.Request.Path.Value?.ToLower();

                    // Only check for application endpoints
                    if (path != null && path.Contains("/api/v1/applications"))
                    {
                        // Try to extract applicationId from route
                        var idString = routeData.Values["id"]?.ToString();
                        if (Guid.TryParse(idString, out var applicationId))
                        {
                            // Use DI to resolve IApplicationService
                            var appService = context.RequestServices.GetService(typeof(Mojaz.Application.Interfaces.Services.IApplicationService)) as Mojaz.Application.Interfaces.Services.IApplicationService;
                            if (appService != null)
                            {
                                var userId = Guid.Parse(context.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                                // Check if this application belongs to the user
                                var owns = await appService.IsOwnerAsync(applicationId, userId);
                                if (!owns)
                                {
                                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                                    await context.Response.WriteAsJsonAsync(new Mojaz.Shared.ApiResponse<object>
                                    {
                                        Success = false,
                                        Message = "You are not authorized to access this application.",
                                        StatusCode = StatusCodes.Status403Forbidden
                                    });
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            await _next(context);
        }
    }
}
