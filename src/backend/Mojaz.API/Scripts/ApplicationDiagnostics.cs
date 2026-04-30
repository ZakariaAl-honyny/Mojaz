
using System;
using Microsoft.Extensions.DependencyInjection;
using Mojaz.Domain.Interfaces;
using Mojaz.Domain.Entities;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Mojaz.Domain.Enums;

namespace Mojaz.API.Scripts;

public class ApplicationDiagnostics
{
    public static async Task Run(IServiceProvider services)
    {
        var appId = Guid.Parse("b0d15d6d-1bba-4bea-b336-08dea4f6ee2c");
        using var scope = services.CreateScope();
        var applicationRepo = scope.ServiceProvider.GetRequiredService<IRepository<Mojaz.Domain.Entities.Application>>();
        var paymentRepo = scope.ServiceProvider.GetRequiredService<IRepository<PaymentTransaction>>();
        var appointmentRepo = scope.ServiceProvider.GetRequiredService<IAppointmentRepository>();
        
        var app = await applicationRepo.Query()
            .Include(a => a.LicenseCategory)
            .FirstOrDefaultAsync(a => a.Id == appId);
            
        if (app == null)
        {
            Console.WriteLine("Application NOT FOUND.");
            return;
        }
        
        Console.WriteLine("--- Application Info ---");
        Console.WriteLine($"ID: {app.Id}");
        Console.WriteLine($"Number: {app.ApplicationNumber}");
        Console.WriteLine($"Status: {app.Status}");
        Console.WriteLine($"Stage: {app.CurrentStage}");
        Console.WriteLine($"Created: {app.CreatedAt}");
        
        Console.WriteLine("\n--- Payments ---");
        var payments = await paymentRepo.FindAsync(p => p.ApplicationId == appId);
        foreach (var p in payments)
        {
            Console.WriteLine($"- Type: {p.FeeType}, Status: {p.Status}, Date: {p.CreatedAt}");
        }
        
        Console.WriteLine("\n--- Appointments ---");
        var appointments = await appointmentRepo.GetByApplicationIdAsync(appId);
        foreach (var a in appointments)
        {
            Console.WriteLine($"- Type: {a.AppointmentType}, Status: {a.Status}, Date: {a.ScheduledDate}, Slot: {a.TimeSlot}");
        }
    }
}
