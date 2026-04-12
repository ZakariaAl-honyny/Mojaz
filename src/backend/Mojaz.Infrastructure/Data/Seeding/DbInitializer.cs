using Microsoft.EntityFrameworkCore;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Infrastructure.Persistence;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Data.Seeding
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(MojazDbContext context, bool isProduction)
        {
            Log.Information("Starting database initialization...");

            // 1. Seed License Categories
            if (!context.LicenseCategories.Any())
            {
                Log.Information("Seeding License Categories...");
                var categories = new List<LicenseCategory>
                {
                    new LicenseCategory { Code = LicenseCategoryCode.A, NameAr = "دراجة نارية", NameEn = "Motorcycle", MinimumAge = 16, ValidityYears = 10 },
                    new LicenseCategory { Code = LicenseCategoryCode.B, NameAr = "سيارة خاصة", NameEn = "Private Car", MinimumAge = 18, ValidityYears = 10 },
                    new LicenseCategory { Code = LicenseCategoryCode.C, NameAr = "تجاري / أجرة", NameEn = "Commercial / Taxi", MinimumAge = 21, ValidityYears = 5 },
                    new LicenseCategory { Code = LicenseCategoryCode.D, NameAr = "حافلة / نقل ركاب", NameEn = "Bus / Transport", MinimumAge = 21, ValidityYears = 5 },
                    new LicenseCategory { Code = LicenseCategoryCode.E, NameAr = "مركبات ثقيلة", NameEn = "Heavy Vehicles", MinimumAge = 21, ValidityYears = 5 },
                    new LicenseCategory { Code = LicenseCategoryCode.F, NameAr = "مركبات زراعية", NameEn = "Agricultural", MinimumAge = 18, ValidityYears = 10 }
                };
                await context.LicenseCategories.AddRangeAsync(categories);
            }

            // 2. Seed System Settings
            if (!context.SystemSettings.Any())
            {
                Log.Information("Seeding System Settings...");
                var settings = new List<SystemSetting>
                {
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_A", SettingValue = "16", Description = "Minimum age for Motorcycle license" },
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_B", SettingValue = "18", Description = "Minimum age for Private Car license" },
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_C", SettingValue = "21", Description = "Minimum age for Commercial/Taxi license" },
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_D", SettingValue = "21", Description = "Minimum age for Bus license" },
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_E", SettingValue = "21", Description = "Minimum age for Heavy Vehicles license" },
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_F", SettingValue = "18", Description = "Minimum age for Agricultural license" },
                    new SystemSetting { SettingKey = "MAX_THEORY_ATTEMPTS", SettingValue = "3", Description = "Maximum allowed theory test attempts" },
                    new SystemSetting { SettingKey = "MAX_PRACTICAL_ATTEMPTS", SettingValue = "3", Description = "Maximum allowed practical test attempts" },
                    new SystemSetting { SettingKey = "COOLING_PERIOD_DAYS", SettingValue = "7", Description = "Days to wait between test attempts" },
                    new SystemSetting { SettingKey = "MEDICAL_VALIDITY_DAYS", SettingValue = "90", Description = "Validity period of medical exams" },
                    new SystemSetting { SettingKey = "APPLICATION_VALIDITY_MONTHS", SettingValue = "6", Description = "Validity period of a license application" }
                };
                await context.SystemSettings.AddRangeAsync(settings);
            }

            // 3. Seed Fee Structures
            if (!context.FeeStructures.Any())
            {
                Log.Information("Seeding Fee Structures...");
                var categoryB = context.LicenseCategories.Local.FirstOrDefault(c => c.Code == LicenseCategoryCode.B) ?? context.LicenseCategories.FirstOrDefault(c => c.Code == LicenseCategoryCode.B);
                var fees = new List<FeeStructure>
                {
                    new FeeStructure { FeeType = FeeType.ApplicationFee, Amount = 100.00m },
                    new FeeStructure { FeeType = FeeType.MedicalExamFee, Amount = 150.00m },
                    new FeeStructure { FeeType = FeeType.TheoryTestFee, Amount = 200.00m },
                    new FeeStructure { FeeType = FeeType.PracticalTestFee, Amount = 300.00m },
                    new FeeStructure { FeeType = FeeType.IssuanceFee, Amount = 400.00m, LicenseCategoryId = categoryB?.Id }
                };
                await context.FeeStructures.AddRangeAsync(fees);
            }

            // 4. Seed Test Data (only if not in strict production mode or if requested)
            if (!isProduction || context.Users.Count() < 10)
            {
                Log.Information("Seeding Additional Demo Data...");
                await TestDataSeeder.SeedAsync(context);
            }

            await context.SaveChangesAsync();
            Log.Information("Database initialization complete.");
        }
    }
}
