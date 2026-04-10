using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Filters;

public class OwnershipFilter : IAsyncAuthorizationFilter
{
    private readonly IRepository<License> _licenseRepository;
    private readonly IRepository<Application> _applicationRepository;
    private static readonly string[] AllowedRoles = { "Admin", "Manager", "Security" };

    public OwnershipFilter(
        IRepository<License> licenseRepository,
        IRepository<Application> applicationRepository)
    {
        _licenseRepository = licenseRepository;
        _applicationRepository = applicationRepository;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        
        // Skip for admin roles
        if (user.IsInRole("Admin") || user.IsInRole("Manager") || user.IsInRole("Security"))
        {
            return;
        }

        // Get route parameters
        var routeValues = context.HttpContext.Request.RouteValues;
        
        // Check for applicationId in route
        if (routeValues.TryGetValue("applicationId", out var applicationIdObj) || 
            routeValues.TryGetValue("id", out applicationIdObj))
        {
            if (applicationIdObj is Guid applicationId)
            {
                var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var userId))
                {
                    var application = await _applicationRepository.GetByIdAsync(applicationId);
                    if (application != null && application.ApplicantId != userId)
                    {
                        context.Result = new ForbidResult();
                        return;
                    }
                }
            }
        }
        
        // Check for oldLicenseId in request body
        var request = context.HttpContext.Request;
        // Additional ownership checks can be added here based on request body
    }
}

public class LicenseOwnershipFilter : IAsyncAuthorizationFilter
{
    private readonly IRepository<License> _licenseRepository;

    public LicenseOwnershipFilter(IRepository<License> licenseRepository)
    {
        _licenseRepository = licenseRepository;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        // For license-owned endpoints, check if user owns the license
        var routeValues = context.HttpContext.Request.RouteValues;
        
        if (routeValues.TryGetValue("oldLicenseId", out var licenseIdObj))
        {
            if (licenseIdObj is Guid licenseId)
            {
                var license = await _licenseRepository.GetByIdAsync(licenseId);
                if (license != null && license.HolderId != userId)
                {
                    context.Result = new ForbidResult();
                    return;
                }
            }
        }
    }
}

public static class OwnershipFilterExtensions
{
    public static MvcOptions AddOwnershipFilters(this MvcOptions options)
    {
        return options;
    }
}