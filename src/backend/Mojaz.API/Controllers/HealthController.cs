using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Shared;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Mojaz.API.Controllers;

/// <summary>
/// Health check endpoint for monitoring API status.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[AllowAnonymous]
public class HealthController : ControllerBase
{
    private readonly ILogger<HealthController> _logger;

    public HealthController(ILogger<HealthController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Test auth - requires valid token but no role check
    /// </summary>
    [HttpGet("test-auth")]
    [Authorize]
    public IActionResult TestAuth()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);
        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var name = User.FindFirstValue(JwtRegisteredClaimNames.Name);
        
        // Get ALL claims for debugging
        var allClaims = User.Claims.Select(c => new { type = c.Type, value = c.Value }).ToList();
        
        return Ok(new { 
            success = true, 
            userId = userId, 
            role = role,
            sub = sub,
            name = name,
            totalClaims = allClaims.Count,
            claims = allClaims,
            message = "Authentication worked!" 
        });
    }

    /// <summary>
    /// Check API health status.
    /// </summary>
    /// <returns>Health status with timestamp and version</returns>
    [HttpGet]
    [AllowAnonymous]
    public IActionResult GetHealth()
    {
        var response = new ApiResponse<object>
        {
            Success = true,
            Message = "API is healthy",
            Data = new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0",
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
            },
            StatusCode = 200
        };

        _logger.LogInformation("Health check successful");
        return Ok(response);
    }

    /// <summary>
    /// Check database connectivity.
    /// </summary>
    /// <returns>Database health status</returns>
    [HttpGet("database")]
    public async Task<IActionResult> GetDatabaseHealth([FromServices] Mojaz.Infrastructure.Persistence.MojazDbContext dbContext)
    {
        try
        {
            var canConnect = await dbContext.Database.CanConnectAsync();
            var response = new ApiResponse<object>
            {
                Success = canConnect,
                Message = canConnect ? "Database connection successful" : "Database connection failed",
                Data = new { Database = canConnect ? "Connected" : "Disconnected" },
                StatusCode = canConnect ? 200 : 500
            };
            return canConnect ? Ok(response) : StatusCode(500, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database health check failed");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "Database health check failed",
                Errors = new List<string> { ex.Message },
                StatusCode = 500
            });
        }
    }
}
