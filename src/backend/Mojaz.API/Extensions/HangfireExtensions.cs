using Hangfire;
using Microsoft.AspNetCore.Builder;
using Mojaz.Infrastructure.Jobs;
using Serilog;
using WebApplication = Microsoft.AspNetCore.Builder.WebApplication;

namespace Mojaz.API.Extensions;

/// <summary>
/// Hangfire job registration extensions.
/// </summary>
public static class HangfireExtensions
{
    /// <summary>
    /// Registers all recurring Hangfire jobs (for WebApplication in minimal hosting).
    /// </summary>
    public static void RegisterRecurringJobs(WebApplication app)
    {
        Log.Information("Registering Hangfire recurring jobs...");

        // Process expired applications - runs daily at 2:00 AM UTC
        RecurringJob.AddOrUpdate<ProcessExpiredApplicationsJob>(
            "expire-applications",
            job => job.ExecuteAsync(),
            Cron.Daily(2),
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.Utc
            });

        Log.Information("Registered recurring job: expire-applications (daily at 02:00 UTC)");

        // Process appointment reminders - runs every hour
        RecurringJob.AddOrUpdate<ProcessAppointmentRemindersJob>(
            "process-appointment-reminders",
            job => job.ExecuteAsync(),
            Cron.Hourly,
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.Utc
            });

        Log.Information("Registered recurring job: process-appointment-reminders (hourly)");
    }
}