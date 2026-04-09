using System.Text;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Hangfire;
using Hangfire.Dashboard;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Mojaz.API.Extensions;
using Mojaz.API.Filters;
using Mojaz.API.Middleware;
using Mojaz.Application;
using Mojaz.Infrastructure;
using Mojaz.Infrastructure.Extensions;
using Serilog;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Initialize Firebase Admin SDK
var firebaseConfig = builder.Configuration.GetSection("Firebase");
var serviceAccountPath = firebaseConfig["ServiceAccountPath"];
if (!string.IsNullOrEmpty(serviceAccountPath) && File.Exists(serviceAccountPath))
{
    FirebaseApp.Create(new AppOptions
    {
        Credential = GoogleCredential.FromFile(serviceAccountPath),
        ProjectId = firebaseConfig["ProjectId"]
    });
}
else
{
    Console.WriteLine("Warning: Firebase ServiceAccountPath not found or file does not exist. Push notifications will be disabled.");
}

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

// ─── Memory Cache (Required by SystemSettingsService) ───
builder.Services.AddMemoryCache();

// ─── Layer Registrations ───
// IMPORTANT: AddApplicationServices must come BEFORE AddInfrastructureServices
// because Infrastructure services (like ProcessAppointmentRemindersJob) depend on Application services
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

// ─── Authorization Policies ───
builder.Services.AddAuthorization(options =>
{
    options.AddPolicies();
});

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

// ─── Email Services Registration ───
builder.Services.AddMojazEmail(builder.Configuration);

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

// ─── Hangfire Dashboard (Phase 6) ───
// Dashboard accessible at /hangfire (requires authorization in production)
app.MapHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new DashboardAuthorizationFilter() }
});

// ─── File Storage Directory Setup ───
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
    Log.Information("Created uploads directory at: {Path}", uploadsPath);
}

// ─── Hangfire Jobs Registration (Phase 8) ───
try 
{
    using (var scope = app.Services.CreateScope())
    {
        var recurringJobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();
        recurringJobManager.AddOrUpdate<Mojaz.Infrastructure.Jobs.ProcessExpiredApplicationsJob>(
            "mojaz-expire-applications",
            job => job.ExecuteAsync(),
            Cron.Daily(2));
    }
}
catch (Exception ex)
{
    Log.Error(ex, "Failed to register Hangfire recurring jobs");
}

app.Run();

// Make Program public for testing
public partial class Program;