
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
        var appId = 6;
        using var scope = services.CreateScope();
        var applicationRepo = scope.ServiceProvider.GetRequiredService<IRepository<Mojaz.Domain.Entities.Application>>();
        var medicalRepo = scope.ServiceProvider.GetRequiredService<IRepository<MedicalExamination>>();
        
        var app = await applicationRepo.Query()
            .Include(a => a.LicenseCategory)
            .Include(a => a.Applicant)
            .FirstOrDefaultAsync(a => a.Id == appId);
            
        if (app == null)
        {
            Console.WriteLine($"Application ID {appId} NOT FOUND.");
            return;
        }
        
        Console.WriteLine("--- Application Info ---");
        Console.WriteLine($"ID: {app.Id}");
        Console.WriteLine($"Number: {app.ApplicationNumber}");
        Console.WriteLine($"Status: {app.Status}");
        Console.WriteLine($"Stage: {app.CurrentStage}");
        Console.WriteLine($"Applicant: {app.Applicant?.FullNameAr}");
        
        Console.WriteLine("\n--- Medical Examination ---");
        var medical = await medicalRepo.Query()
            .FirstOrDefaultAsync(m => m.ApplicationId == appId);
        if (medical != null)
        {
            Console.WriteLine($"- Result: {medical.FitnessResult}");
            Console.WriteLine($"- Notes: {medical.Notes}");
            Console.WriteLine($"- Date: {medical.CreatedAt}");
        }
        else
        {
            Console.WriteLine("- No medical examination found.");
        }
    }
}
