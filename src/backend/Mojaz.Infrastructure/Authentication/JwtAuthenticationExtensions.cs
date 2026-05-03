using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace Mojaz.Infrastructure.Authentication;

public static class JwtAuthenticationExtensions
{
    public static IServiceCollection AddMojazAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>();
        if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.SecretKey))
        {
            throw new InvalidOperationException("JwtSettings:SecretKey is required.");
        }

        // Allow environment variable override for secret key
        var envSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
        if (!string.IsNullOrEmpty(envSecretKey))
        {
            jwtSettings.SecretKey = envSecretKey;
        }

        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

        // Debug: Log the JWT settings being used
        Console.WriteLine($"[JWT CONFIG] SecretKey: {jwtSettings.SecretKey?.Substring(0, Math.Min(10, jwtSettings.SecretKey.Length))}...");
        Console.WriteLine($"[JWT CONFIG] Issuer: '{jwtSettings.Issuer}', Audience: '{jwtSettings.Audience}'");
        Console.WriteLine($"[JWT CONFIG] ExpirationMinutes: {jwtSettings.AccessTokenExpirationMinutes}");

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);
            
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false, // TEMP DISABLED FOR DEBUGGING
                ValidateAudience = false, // TEMP DISABLED FOR DEBUGGING
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.FromMinutes(5),
                RoleClaimType = ClaimTypes.Role,
                NameClaimType = JwtRegisteredClaimNames.Name
            };
            
            Console.WriteLine("[JWT] TokenValidationParameters configured with Issuer/Audience VALIDATION DISABLED for debugging");
            
            // Force include all JWT claims in the principal
            options.IncludeErrorDetails = true;

            // Map JWT claims to standard ASP.NET Core claims so role-based authorization works
            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = context =>
                {
                    var logger = context.HttpContext.RequestServices.GetService<ILoggerFactory>()?.CreateLogger("JWT");
                    logger?.LogInformation("[JWT] Token validated for user: {User}", context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                    
                    // Add role claim with simple name for proper IsInRole() functionality
                    if (context.Principal?.Identity is ClaimsIdentity claimsIdentity)
                    {
                        // First try ClaimTypes.Role (URI format), then try simple "role"
                        var roleClaim = claimsIdentity.FindFirst(ClaimTypes.Role) 
                                    ?? claimsIdentity.FindFirst("role");
                        
                        logger?.LogInformation("[JWT] Found role claim: {Role}", roleClaim?.Value);
                        
                        if (roleClaim != null)
                        {
                            // Remove any existing simple "role" claim to avoid duplicates
                            var existingRoleClaims = claimsIdentity.FindAll("role").ToList();
                            foreach (var existing in existingRoleClaims)
                            {
                                claimsIdentity.RemoveClaim(existing);
                            }
                            
                            // Add a fresh claim with simple "role" type name for ASP.NET Core authorization
                            claimsIdentity.AddClaim(new Claim("role", roleClaim.Value, ClaimValueTypes.String));
                            
                            // Also add as Role type for compatibility with other authorization mechanisms
                            claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, roleClaim.Value));
                            
                            logger?.LogInformation("[JWT] Added role claims: {Roles}", string.Join(", ", claimsIdentity.FindAll("role").Select(c => c.Value)));
                        }
                    }
                    return Task.CompletedTask;
                },
                OnAuthenticationFailed = context =>
                {
                    var logger = context.HttpContext.RequestServices.GetService<ILoggerFactory>()?.CreateLogger("JWT");
                    var errorMsg = $"[JWT ERROR] Auth failed: {context.Exception.Message}";
                    Console.WriteLine(errorMsg);
                    Console.WriteLine($"[JWT ERROR] Exception Type: {context.Exception.GetType().Name}");
                    Console.WriteLine($"[JWT ERROR] Stack Trace: {context.Exception.StackTrace}");
                    
                    logger?.LogError(context.Exception, "[JWT] Authentication failed: {Message} | Exception: {Exception}", 
                        context.Exception.Message, context.Exception.GetType().Name);
                    
                    if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                    {
                        context.Response.Headers.Append("Token-Expired", "true");
                    }
                    return Task.CompletedTask;
                },
                OnMessageReceived = context =>
                {
                    var logger = context.HttpContext.RequestServices.GetService<ILoggerFactory>()?.CreateLogger("JWT");
                    var token = context.Token;
                    Console.WriteLine($"[JWT] Received token: {token?.Length ?? 0} chars");
                    logger?.LogInformation("[JWT] Received token: {TokenLength} chars", token?.Length ?? 0);
                    return Task.CompletedTask;
                }
            };
        });

        // Add Mojaz role-based authorization policies
        // Admin has access to EVERYTHING - include Admin in all employee policies
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            options.AddPolicy("EmployeeOnly", policy => policy.RequireRole("Admin", "Receptionist", "Doctor", "Examiner", "Manager", "Security"));
            options.AddPolicy("ApplicantOnly", policy => policy.RequireRole("Applicant"));
            options.AddPolicy("ReceptionistOrAbove", policy => policy.RequireRole("Admin", "Receptionist", "Doctor", "Manager"));
            options.AddPolicy("ExaminerOrAbove", policy => policy.RequireRole("Admin", "Receptionist", "Doctor", "Examiner", "Manager"));
            options.AddPolicy("ManagerOrAbove", policy => policy.RequireRole("Admin", "Manager"));
            options.AddPolicy("RequiresAdmin", policy => policy.RequireRole("Admin"));
            options.AddPolicy("RequiresApplicant", policy => policy.RequireRole("Applicant"));
            options.AddPolicy("RequiresEmployee", policy => policy.RequireRole("Admin", "Receptionist", "Doctor", "Examiner", "Manager", "Security"));
        });

        return services;
    }
}
