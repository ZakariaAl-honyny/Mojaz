using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Infrastructure.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace Mojaz.Infrastructure.Data.Seeding
{
    public static class TestDataSeeder
    {
        public static async Task SeedAsync(MojazDbContext context)
        {
            // Check if users already exist
            if (context.Users.Any(u => u.Email != null && u.Email.EndsWith("@mojaz.gov.sa"))) return;

            var passwordHash = BCrypt.Net.BCrypt.HashPassword("Password123!", 12);

            var users = new List<User>
            {
                new User { 
                    FullNameAr = "متقدم تجريبي", 
                    FullNameEn = "Test Applicant", 
                    NationalId = "1000000001", 
                    Email = "applicant@mojaz.gov.sa", 
                    PhoneNumber = "0500000001", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Applicant, 
                    AppRole = AppRole.Applicant,
                    DateOfBirth = new DateTime(1990, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                },
                new User { 
                    FullNameAr = "موظف استقبال", 
                    FullNameEn = "Test Receptionist", 
                    NationalId = "1000000002", 
                    Email = "receptionist@mojaz.gov.sa", 
                    PhoneNumber = "0500000002", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Receptionist, 
                    AppRole = AppRole.Receptionist,
                    DateOfBirth = new DateTime(1985, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                },
                new User { 
                    FullNameAr = "طبيب تجريبي", 
                    FullNameEn = "Test Doctor", 
                    NationalId = "1000000003", 
                    Email = "doctor@mojaz.gov.sa", 
                    PhoneNumber = "0500000003", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Doctor, 
                    AppRole = AppRole.Doctor,
                    DateOfBirth = new DateTime(1980, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                },
                new User { 
                    FullNameAr = "فاحص تجريبي", 
                    FullNameEn = "Test Examiner", 
                    NationalId = "1000000004", 
                    Email = "examiner@mojaz.gov.sa", 
                    PhoneNumber = "0500000004", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Examiner, 
                    AppRole = AppRole.Examiner,
                    DateOfBirth = new DateTime(1982, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                },
                new User { 
                    FullNameAr = "مدير تجريبي", 
                    FullNameEn = "Test Manager", 
                    NationalId = "1000000005", 
                    Email = "manager@mojaz.gov.sa", 
                    PhoneNumber = "0500000005", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Manager, 
                    AppRole = AppRole.Manager,
                    DateOfBirth = new DateTime(1978, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                },
                new User { 
                    FullNameAr = "مسؤول نظام", 
                    FullNameEn = "Test Admin", 
                    NationalId = "1000000006", 
                    Email = "admin@mojaz.gov.sa", 
                    PhoneNumber = "0500000006", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Admin, 
                    AppRole = AppRole.Admin,
                    DateOfBirth = new DateTime(1980, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();

            // Get category IDs for FeeStructures
            var catA = new LicenseCategory { Code = LicenseCategoryCode.A, NameAr = "دراجة نارية", NameEn = "Motorcycle", MinimumAge = 16, RequiresTraining = false, IsActive = true, ValidityYears = 10 };
            var catB = new LicenseCategory { Code = LicenseCategoryCode.B, NameAr = "خصوصي", NameEn = "Private", MinimumAge = 18, RequiresTraining = true, IsActive = true, ValidityYears = 10 };
            var catC = new LicenseCategory { Code = LicenseCategoryCode.C, NameAr = "حكومي", NameEn = "Government", MinimumAge = 21, RequiresTraining = true, IsActive = true, ValidityYears = 10 };
            var catD = new LicenseCategory { Code = LicenseCategoryCode.D, NameAr = "أجرة", NameEn = "Taxi", MinimumAge = 21, RequiresTraining = true, IsActive = true, ValidityYears = 10 };
            var catE = new LicenseCategory { Code = LicenseCategoryCode.E, NameAr = "حميل", NameEn = "Heavy", MinimumAge = 21, RequiresTraining = true, IsActive = true, ValidityYears = 10 };
            var catF = new LicenseCategory { Code = LicenseCategoryCode.F, NameAr = "مزلق", NameEn = "Learning", MinimumAge = 18, RequiresTraining = true, IsActive = true, ValidityYears = 1 };

            var categories = new List<LicenseCategory> { catA, catB, catC, catD, catE, catF };
            await context.LicenseCategories.AddRangeAsync(categories);
            await context.SaveChangesAsync();

            // Seed Fee Structures with correct field names
            var fees = new List<FeeStructure>
            {
                new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catA.Id, Amount = 5000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catB.Id, Amount = 10000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catC.Id, Amount = 15000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catD.Id, Amount = 15000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catE.Id, Amount = 20000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.ApplicationFee, LicenseCategoryId = catF.Id, Amount = 8000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catA.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catB.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catC.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catD.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catE.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.MedicalExamFee, LicenseCategoryId = catF.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catA.Id, Amount = 2000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catB.Id, Amount = 2000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catC.Id, Amount = 2500, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catD.Id, Amount = 2500, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catE.Id, Amount = 3000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.TheoryTestFee, LicenseCategoryId = catF.Id, Amount = 2000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catA.Id, Amount = 5000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catB.Id, Amount = 5000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catC.Id, Amount = 7000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catD.Id, Amount = 7000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catE.Id, Amount = 10000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.PracticalTestFee, LicenseCategoryId = catF.Id, Amount = 5000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catA.Id, Amount = 15000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catB.Id, Amount = 20000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catC.Id, Amount = 25000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catD.Id, Amount = 25000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catE.Id, Amount = 30000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow },
                new FeeStructure { FeeType = FeeType.IssuanceFee, LicenseCategoryId = catF.Id, Amount = 15000, Currency = "YER", IsActive = true, EffectiveFrom = DateTime.UtcNow }
            };

            await context.FeeStructures.AddRangeAsync(fees);
            await context.SaveChangesAsync();

            // Seed System Settings with correct field names
            var settings = new List<SystemSetting>
            {
                new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_A", SettingValue = "16", Description = "Minimum age for category A", IsEncrypted = false },
                new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_B", SettingValue = "18", Description = "Minimum age for category B", IsEncrypted = false },
                new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_C", SettingValue = "21", Description = "Minimum age for category C", IsEncrypted = false },
                new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_D", SettingValue = "21", Description = "Minimum age for category D", IsEncrypted = false },
                new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_E", SettingValue = "21", Description = "Minimum age for category E", IsEncrypted = false },
                new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_F", SettingValue = "18", Description = "Minimum age for category F", IsEncrypted = false },
                new SystemSetting { SettingKey = "MAX_THEORY_ATTEMPTS", SettingValue = "3", Description = "Maximum theory test attempts", IsEncrypted = false },
                new SystemSetting { SettingKey = "MAX_PRACTICAL_ATTEMPTS", SettingValue = "3", Description = "Maximum practical test attempts", IsEncrypted = false },
                new SystemSetting { SettingKey = "OTP_VALIDITY_MINUTES_EMAIL", SettingValue = "15", Description = "OTP validity for email", IsEncrypted = false },
                new SystemSetting { SettingKey = "OTP_VALIDITY_MINUTES_SMS", SettingValue = "5", Description = "OTP validity for SMS", IsEncrypted = false }
            };

            await context.SystemSettings.AddRangeAsync(settings);
            await context.SaveChangesAsync();
        }
    }
}
