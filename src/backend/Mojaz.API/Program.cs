using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Mojaz.API.Extensions;
using Mojaz.API.Middleware;
using Mojaz.Application.Extensions;
using Mojaz.Infrastructure;
using Serilog;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// ─── Serilog Configuration ───
builder.Host.UseSerilog((context, config) =>
{
    config
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.File(
            "logs/mojaz_.log",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 30);
});

// ─── Layer Registrations ───
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// ─── Controllers & Filters ───
builder.Services.AddControllers(options => 
{
    // Note: ValidationFilter logic is typically wired via Application assembly scanning + FluentValidation
});

builder.Services.AddHttpContextAccessor();

// ─── Modular Extensions (Phase 3 Fix) ───
builder.Services.AddMojazCors(builder.Configuration);
builder.Services.AddMojazSwagger();

// ─── Health Checks ───
builder.Services.AddHealthChecks();

// ─── Rate Limiting ───
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("registration", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }
        )
    );
});

var app = builder.Build();

// ─── Middleware Pipeline (Modularized) ───

app.UseMojazSecurityHeaders();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseMojazSwagger();
}

app.UseMojazExceptionHandler();
app.UseMojazRequestLogging();

app.UseHttpsRedirection();
app.UseMojazCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseMojazAuditLogging();

app.UseRateLimiter();

app.MapControllers().RequireRateLimiting("registration");
app.MapHealthChecks("/health").AllowAnonymous();

app.Run();

// Make Program public for testing
public partial class Program;
