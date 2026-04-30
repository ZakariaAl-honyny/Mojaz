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
                    // Age settings
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_A", SettingValue = "16", Description = "Minimum age for Motorcycle license" },
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_B", SettingValue = "18", Description = "Minimum age for Private Car license" },
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_C", SettingValue = "21", Description = "Minimum age for Commercial/Taxi license" },
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_D", SettingValue = "21", Description = "Minimum age for Bus license" },
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_E", SettingValue = "21", Description = "Minimum age for Heavy Vehicles license" },
                    new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_F", SettingValue = "18", Description = "Minimum age for Agricultural license" },
                    
                    // Test attempt settings
                    new SystemSetting { SettingKey = "MAX_THEORY_ATTEMPTS", SettingValue = "3", Description = "Maximum allowed theory test attempts" },
                    new SystemSetting { SettingKey = "MAX_PRACTICAL_ATTEMPTS", SettingValue = "3", Description = "Maximum allowed practical test attempts" },
                    new SystemSetting { SettingKey = "COOLING_PERIOD_DAYS", SettingValue = "7", Description = "Days to wait between test attempts" },
                    
                    // Medical & Application validity
                    new SystemSetting { SettingKey = "MEDICAL_VALIDITY_DAYS", SettingValue = "90", Description = "Validity period of medical exams" },
                    new SystemSetting { SettingKey = "APPLICATION_VALIDITY_MONTHS", SettingValue = "6", Description = "Validity period of a license application" },
                    
                    // OTP Settings (Required for AuthService)
                    new SystemSetting { SettingKey = "OTP_VALIDITY_MINUTES_SMS", SettingValue = "5", Description = "OTP validity period for SMS (minutes)" },
                    new SystemSetting { SettingKey = "OTP_VALIDITY_MINUTES_EMAIL", SettingValue = "15", Description = "OTP validity period for Email (minutes)" },
                    new SystemSetting { SettingKey = "OTP_MAX_ATTEMPTS", SettingValue = "3", Description = "Maximum OTP verification attempts" },
                    new SystemSetting { SettingKey = "OTP_RESEND_COOLDOWN_SECONDS", SettingValue = "60", Description = "Cooldown between OTP resend requests (seconds)" },
                    new SystemSetting { SettingKey = "OTP_MAX_RESEND_PER_HOUR", SettingValue = "3", Description = "Maximum OTP resend requests per hour" },
                    
                    // Security & Account Settings
                    new SystemSetting { SettingKey = "PASSWORD_MIN_LENGTH", SettingValue = "8", Description = "Minimum password length" },
                    new SystemSetting { SettingKey = "ACCOUNT_LOCKOUT_ATTEMPTS", SettingValue = "5", Description = "Failed login attempts before lockout" },
                    new SystemSetting { SettingKey = "ACCOUNT_LOCKOUT_MINUTES", SettingValue = "15", Description = "Account lockout duration (minutes)" },
                    
                    // JWT Settings
                    new SystemSetting { SettingKey = "JWT_ACCESS_TOKEN_MINUTES", SettingValue = "60", Description = "JWT access token expiration (minutes)" },
                    new SystemSetting { SettingKey = "JWT_REFRESH_TOKEN_DAYS", SettingValue = "7", Description = "JWT refresh token expiration (days)" },
                    
                    // File Upload Settings
                    new SystemSetting { SettingKey = "MAX_FILE_SIZE_MB", SettingValue = "5", Description = "Maximum file upload size (MB)" }
                };
                await context.SystemSettings.AddRangeAsync(settings);
            }

            // 3. Seed Fee Structures
            if (!context.FeeStructures.Any())
            {
                Log.Information("Seeding Fee Structures...");
                // Wait for LicenseCategories to be saved first
                await context.SaveChangesAsync();
                
                // Get all categories
                var catA = await context.LicenseCategories.FirstOrDefaultAsync(c => c.Code == LicenseCategoryCode.A);
                var catB = await context.LicenseCategories.FirstOrDefaultAsync(c => c.Code == LicenseCategoryCode.B);
                var catC = await context.LicenseCategories.FirstOrDefaultAsync(c => c.Code == LicenseCategoryCode.C);
                var catD = await context.LicenseCategories.FirstOrDefaultAsync(c => c.Code == LicenseCategoryCode.D);
                var catE = await context.LicenseCategories.FirstOrDefaultAsync(c => c.Code == LicenseCategoryCode.E);
                var catF = await context.LicenseCategories.FirstOrDefaultAsync(c => c.Code == LicenseCategoryCode.F);
                
                var fees = new List<FeeStructure>();
                
                // Application fees for all categories
                if (catA != null) fees.Add(new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catA.Id, Amount = 5000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catB != null) fees.Add(new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catB.Id, Amount = 10000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catC != null) fees.Add(new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catC.Id, Amount = 15000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catD != null) fees.Add(new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catD.Id, Amount = 15000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catE != null) fees.Add(new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catE.Id, Amount = 20000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catF != null) fees.Add(new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catF.Id, Amount = 8000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                
                // Medical exam fees for all categories
                if (catA != null) fees.Add(new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catA.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catB != null) fees.Add(new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catB.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catC != null) fees.Add(new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catC.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catD != null) fees.Add(new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catD.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catE != null) fees.Add(new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catE.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catF != null) fees.Add(new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catF.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                
                // Theory test fees for all categories
                if (catA != null) fees.Add(new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catA.Id, Amount = 2000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catB != null) fees.Add(new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catB.Id, Amount = 2000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catC != null) fees.Add(new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catC.Id, Amount = 2500, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catD != null) fees.Add(new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catD.Id, Amount = 2500, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catE != null) fees.Add(new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catE.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catF != null) fees.Add(new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catF.Id, Amount = 2000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                
                // Practical test fees for all categories
                if (catA != null) fees.Add(new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catA.Id, Amount = 5000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catB != null) fees.Add(new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catB.Id, Amount = 5000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catC != null) fees.Add(new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catC.Id, Amount = 7000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catD != null) fees.Add(new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catD.Id, Amount = 7000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catE != null) fees.Add(new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catE.Id, Amount = 10000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catF != null) fees.Add(new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catF.Id, Amount = 5000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                
                // Issuance fees for all categories
                if (catA != null) fees.Add(new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catA.Id, Amount = 15000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catB != null) fees.Add(new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catB.Id, Amount = 20000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catC != null) fees.Add(new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catC.Id, Amount = 25000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catD != null) fees.Add(new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catD.Id, Amount = 25000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catE != null) fees.Add(new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catE.Id, Amount = 30000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                if (catF != null) fees.Add(new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catF.Id, Amount = 15000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow });
                
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
