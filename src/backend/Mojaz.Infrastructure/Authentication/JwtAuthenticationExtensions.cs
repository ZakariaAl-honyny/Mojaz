using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
                ClockSkew = TimeSpan.FromMinutes(5) // Allow 5 minute clock skew for token validity
            };

            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                    {
                        context.Response.Headers.Append("Token-Expired", "true");
                    }
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
