using System.Text;
using Microsoft.EntityFrameworkCore;
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
using Mojaz.Infrastructure.Persistence;
using Mojaz.Infrastructure.Data.Seeding;
using Mojaz.Infrastructure.Extensions;
using Serilog;
using Mojaz.Infrastructure.Security.RateLimiting;
using QuestPDF.Infrastructure;
using QuestPDF.Helpers;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

// ─── QuestPDF Configuration ───
QuestPDF.Settings.License = LicenseType.Community;

// ─── Configuration Validation (Zero Trust) ───
var requiredSettings = new[] { "ConnectionStrings:DefaultConnection", "JwtSettings:SecretKey", "Firebase:ProjectId" };
foreach (var setting in requiredSettings)
{
    if (string.IsNullOrEmpty(builder.Configuration[setting]))
    {
        throw new InvalidOperationException($"CRITICAL: Required configuration '{setting}' is missing. Check Environment Variables.");
    }
}


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
        .Enrich.With<Mojaz.Infrastructure.Logging.LogMaskingEnricher>()
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

// ─── Global Error Handling ───
builder.Services.AddExceptionHandler<Mojaz.Infrastructure.Security.Middleware.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// ─── Controllers & Filters ───
builder.Services.AddControllers(options => 
{
    // Note: ValidationFilter logic is typically wired via Application assembly scanning + FluentValidation
});

// ─── Request Size Limits (Global Security) ───
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 5 * 1024 * 1024; // 5MB
});

builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 5 * 1024 * 1024; // 5MB
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
builder.Services.AddHealthChecks()
    .AddCheck("Self", () => HealthCheckResult.Healthy())
    .AddSqlServer(
        connectionString: builder.Configuration.GetConnectionString("DefaultConnection")!,
        name: "SQLServer",
        tags: new[] { "db", "sql", "sqlserver" })
    .AddDiskStorageHealthCheck(options =>
    {
        options.AddDrive("C", 1024); // Check drive C for at least 1GB free space (placeholder for production path)
    }, name: "DiskStorage", tags: new[] { "storage" });

// ─── Rate Limiting ───
builder.Services.AddMojazRateLimiting();

// ─── Email Services Registration ───
builder.Services.AddMojazEmail(builder.Configuration);

var app = builder.Build();

// ─── Middleware Pipeline (Modularized) ───

app.UseMojazSecurityHeaders();
app.UseExceptionHandler(); // Enable global exception handler

if (app.Environment.IsDevelopment())
{
    // app.UseDeveloperExceptionPage(); // Disabled in favor of our consistent error handler
    app.UseMojazSwagger();
}

app.UseMojazExceptionHandler();
app.UseMojazRequestLogging();

app.UseHttpsRedirection();
app.UseMojazCors();

// ─── Monitoring Middleware ───
app.UseHttpMetrics();

app.UseAuthentication();
app.UseAuthorization();

app.UseMojazAuditLogging();

app.UseRateLimiter();

app.MapControllers();
app.MapHealthChecks("/health").AllowAnonymous();
app.MapMetrics().AllowAnonymous();

// ─── Auto-Migration (Production Safe) ───
if (app.Environment.IsProduction() || app.Configuration.GetValue<bool>("AutoMigrate"))
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<MojazDbContext>();
            if (context.Database.GetPendingMigrations().Any())
            {
                Log.Information("Applying pending migrations...");
                context.Database.Migrate();
                Log.Information("Migrations applied successfully.");
            }

            // Always run seeding to ensure mandatory data (settings, roles) exists
            await DbInitializer.SeedAsync(context, app.Environment.IsProduction());
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error occurred while migrating the database.");
        }
    }
}

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

        recurringJobManager.AddOrUpdate<Mojaz.Infrastructure.Security.Background.AuditLogCleanupJob>(
            "mojaz-auditlog-cleanup",
            job => job.ExecuteAsync(),
            Cron.Daily(3));
    }
}
catch (Exception ex)
{
    Log.Error(ex, "Failed to register Hangfire recurring jobs");
}

app.Run();

// Make Program public for testing
public partial class Program;