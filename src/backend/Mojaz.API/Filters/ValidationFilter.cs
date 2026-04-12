using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Mojaz.Shared;

namespace Mojaz.API.Filters;

/// <summary>
/// Action filter for validating model state.
/// Intercepts requests with invalid ModelState and returns standardized error response.
/// </summary>
public class ValidationFilter : IAsyncActionFilter
{
    private readonly ILogger<ValidationFilter> _logger;

    public ValidationFilter(ILogger<ValidationFilter> logger)
    {
        _logger = logger;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.ModelState.IsValid)
        {
            var errors = context.ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            _logger.LogWarning("Validation failed with errors: {@Errors}", errors);

            var response = new ApiResponse<object>
            {
                Success = false,
                Message = "Validation failed",
                Errors = errors,
                StatusCode = 400
            };

            context.Result = new BadRequestObjectResult(response);
            return;
        }

        await next();
    }
}
