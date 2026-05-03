using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Mojaz.Shared;
using System.Text.Json;

namespace Mojaz.API.Filters;

/// <summary>
/// Custom authorization middleware result handler that returns proper JSON ApiResponse on authorization failures.
/// </summary>
public class AuthorizationResponseHandler : IAuthorizationMiddlewareResultHandler
{
    private readonly AuthorizationMiddlewareResultHandler _defaultHandler = new();

    public async Task HandleAsync(RequestDelegate next, HttpContext context, AuthorizationPolicy policy, PolicyAuthorizationResult policyResult)
    {
        // Let default handler process authorization failures - it will handle 401/403 correctly
        // This ensures authentication and authorization pipelines work as expected
        await _defaultHandler.HandleAsync(next, context, policy, policyResult);
    }
}