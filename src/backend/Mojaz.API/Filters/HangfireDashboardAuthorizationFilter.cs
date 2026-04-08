using Hangfire.Dashboard;

namespace Mojaz.API.Filters;

/// <summary>
/// Authorization filter for Hangfire Dashboard - only Admin role can access in production.
/// Allows local requests in development mode.
/// </summary>
public class DashboardAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();
        
        // In development, allow local requests
        if (httpContext?.Request.Host.Host == "localhost" || 
            httpContext?.Request.Host.Host == "127.0.0.1")
            return true;
        
        // Check for Admin role in production
        var user = httpContext?.User;
        return user?.IsInRole("Admin") == true;
    }
}