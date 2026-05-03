using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Infrastructure.Persistence;

namespace Mojaz.Infrastructure.Data.Seeding
{
    public static class TestDataSeeder
    {
        /// <summary>
        /// Seeds test users with correct BCrypt hashes for "Password123!"
        /// Hash will be generated at runtime to ensure valid 60-character BCrypt hash
        /// </summary>
        private static readonly Lazy<string> _testPasswordHash = new(() => BCrypt.Net.BCrypt.HashPassword("Password123!", 12));

        private static string TestPasswordHash => _testPasswordHash.Value;

        private static async Task FixInvalidPasswordHashesAsync(MojazDbContext context)
        {
            // Find users with test email domains - ALWAYS fix their password hashes to ensure they match "Password123!"
            var testUsers = await context.Users
                .Where(u => u.Email != null && u.Email.EndsWith("@mojaz.gov.sa"))
                .ToListAsync();
            
            var fixedCount = 0;
            foreach (var user in testUsers)
            {
                // ALWAYS regenerate to ensure it's correct - don't check length
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!", 12);
                fixedCount++;
            }
            
            if (fixedCount > 0)
            {
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedFeeStructuresIfEmptyAsync(MojazDbContext context)
        {
            if (context.FeeStructures.Any()) return;
            
            // Get or create license categories
            var catA = await GetOrCreateCategoryAsync(context, LicenseCategoryCode.A, "دراجة نارية", "Motorcycle", 16);
            var catB = await GetOrCreateCategoryAsync(context, LicenseCategoryCode.B, "خصوصي", "Private", 18);
            var catC = await GetOrCreateCategoryAsync(context, LicenseCategoryCode.C, "حكومي", "Government", 21);
            var catD = await GetOrCreateCategoryAsync(context, LicenseCategoryCode.D, "أجرة", "Taxi", 21);
            var catE = await GetOrCreateCategoryAsync(context, LicenseCategoryCode.E, "حميل", "Heavy", 21);
            var catF = await GetOrCreateCategoryAsync(context, LicenseCategoryCode.F, "مزلق", "Learning", 18);
            
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
        }
        
        private static Task<LicenseCategory> GetOrCreateCategoryAsync(MojazDbContext context, LicenseCategoryCode code, string nameAr, string nameEn, int minAge)
        {
            var existing = context.LicenseCategories.FirstOrDefault(c => c.Code == code);
            if (existing != null) return Task.FromResult(existing);
            
            var cat = new LicenseCategory { Code = code, NameAr = nameAr, NameEn = nameEn, MinimumAge = minAge, RequiresTraining = false, IsActive = true, ValidityYears = 10 };
            context.LicenseCategories.Add(cat);
            context.SaveChanges();
            return Task.FromResult(cat);
        }

        public static async Task SeedAsync(MojazDbContext context)
        {
            // Seed branches first (required for appointments)
            if (!context.Branches.Any())
            {
                var branches = new List<Branch>
                {
                    new Branch { Name = "الفرع الرئيسي", Address = "الرياض، المملكة العربية السعودية", PhoneNumber = "0111234567" },
                    new Branch { Name = "فرع جدة", Address = "جدة، المملكة العربية السعودية", PhoneNumber = "0121234567" },
                    new Branch { Name = "فرع الدمام", Address = "الدمام، المملكة العربية السعودية", PhoneNumber = "0131234567" }
                };
                await context.Branches.AddRangeAsync(branches);
                await context.SaveChangesAsync();
            }

            // Always seed fees if they don't exist (do this FIRST so fees are always available)
            await SeedFeeStructuresIfEmptyAsync(context);
            
            // CRITICAL: Always fix invalid password hashes for test accounts BEFORE checking if users exist
            // This ensures even already-seeded accounts get their hashes fixed
            await FixInvalidPasswordHashesAsync(context);
            
            // Check if users already exist
            if (context.Users.Any(u => u.Email != null && u.Email.EndsWith("@mojaz.gov.sa"))) 
            {
                // Still try to seed appointments if they are missing
                var testUsers = await context.Users
                    .Where(u => u.Email != null && u.Email.EndsWith("@mojaz.gov.sa"))
                    .ToListAsync();
                await SeedTestAppointmentsAsync(context, testUsers);
                return;
            }

            var users = new List<User>
            {
                new User { 
                    FullNameAr = "متقدم تجريبي", 
                    FullNameEn = "Test Applicant", 
                    NationalId = "1000000001", 
                    Email = "applicant@mojaz.gov.sa", 
                    PhoneNumber = "0500000001", 
                    PasswordHash = TestPasswordHash, 
                    Role = UserRole.Applicant, 
                    AppRole = AppRole.Applicant,
                    DateOfBirth = new DateTime(1990, 1, 1),
                    PreferredLanguage = "ar",
                    RegistrationMethod = RegistrationMethod.Email,
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true,
                    EnableEmail = true,
                    EnableSms = true,
                    EnablePush = true
                },
                new User { 
                    FullNameAr = "موظف استقبال", 
                    FullNameEn = "Test Receptionist", 
                    NationalId = "1000000002", 
                    Email = "receptionist@mojaz.gov.sa", 
                    PhoneNumber = "0500000002", 
                    PasswordHash = TestPasswordHash, 
                    Role = UserRole.Receptionist, 
                    AppRole = AppRole.Receptionist,
                    DateOfBirth = new DateTime(1985, 1, 1),
                    PreferredLanguage = "ar",
                    RegistrationMethod = RegistrationMethod.Email,
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true,
                    EnableEmail = true,
                    EnableSms = true,
                    EnablePush = true
                },
                new User { 
                    FullNameAr = "طبيب تجريبي", 
                    FullNameEn = "Test Doctor", 
                    NationalId = "1000000003", 
                    Email = "doctor@mojaz.gov.sa", 
                    PhoneNumber = "0500000003", 
                    PasswordHash = TestPasswordHash, 
                    Role = UserRole.Doctor, 
                    AppRole = AppRole.Doctor,
                    DateOfBirth = new DateTime(1980, 1, 1),
                    PreferredLanguage = "ar",
                    RegistrationMethod = RegistrationMethod.Email,
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true,
                    EnableEmail = true,
                    EnableSms = true,
                    EnablePush = true
                },
                new User { 
                    FullNameAr = "فاحص تجريبي", 
                    FullNameEn = "Test Examiner", 
                    NationalId = "1000000004", 
                    Email = "examiner@mojaz.gov.sa", 
                    PhoneNumber = "0500000004", 
                    PasswordHash = TestPasswordHash, 
                    Role = UserRole.Examiner, 
                    AppRole = AppRole.Examiner,
                    DateOfBirth = new DateTime(1982, 1, 1),
                    PreferredLanguage = "ar",
                    RegistrationMethod = RegistrationMethod.Email,
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true,
                    EnableEmail = true,
                    EnableSms = true,
                    EnablePush = true
                },
                new User { 
                    FullNameAr = "مدير تجريبي", 
                    FullNameEn = "Test Manager", 
                    NationalId = "1000000005", 
                    Email = "manager@mojaz.gov.sa", 
                    PhoneNumber = "0500000005", 
                    PasswordHash = TestPasswordHash, 
                    Role = UserRole.Manager, 
                    AppRole = AppRole.Manager,
                    DateOfBirth = new DateTime(1978, 1, 1),
                    PreferredLanguage = "ar",
                    RegistrationMethod = RegistrationMethod.Email,
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true,
                    EnableEmail = true,
                    EnableSms = true,
                    EnablePush = true
                },
                new User { 
                    FullNameAr = "مسؤول نظام", 
                    FullNameEn = "Test Admin", 
                    NationalId = "1000000006", 
                    Email = "admin@mojaz.gov.sa", 
                    PhoneNumber = "0500000006", 
                    PasswordHash = TestPasswordHash, 
                    Role = UserRole.Admin, 
                    AppRole = AppRole.Admin,
                    DateOfBirth = new DateTime(1980, 1, 1),
                    PreferredLanguage = "ar",
                    RegistrationMethod = RegistrationMethod.Email,
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true,
                    EnableEmail = true,
                    EnableSms = true,
                    EnablePush = true
                },
                new User { 
                    FullNameAr = "أمن تجريبي", 
                    FullNameEn = "Test Security", 
                    NationalId = "1000000007", 
                    Email = "security@mojaz.gov.sa", 
                    PhoneNumber = "0500000007", 
                    PasswordHash = TestPasswordHash, 
                    Role = UserRole.Security, 
                    AppRole = AppRole.Security,
                    DateOfBirth = new DateTime(1983, 1, 1),
                    PreferredLanguage = "ar",
                    RegistrationMethod = RegistrationMethod.Email,
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true,
                    EnableEmail = true,
                    EnableSms = true,
                    EnablePush = true
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

            // Seed test applications with paid payment records
            await SeedTestApplicationsWithPaymentsAsync(context, users, categories);

            // Seed test appointments for the applicant
            await SeedTestAppointmentsAsync(context, users);
        }

        private static async Task SeedTestApplicationsWithPaymentsAsync(MojazDbContext context, List<User> users, List<LicenseCategory> categories)
        {
            var applicant = users.First(u => u.Role == UserRole.Applicant);
            var catA = categories.First(c => c.Code == LicenseCategoryCode.A);
            var catB = categories.First(c => c.Code == LicenseCategoryCode.B);
            var catC = categories.First(c => c.Code == LicenseCategoryCode.C);
            var catD = categories.First(c => c.Code == LicenseCategoryCode.D);
            var catE = categories.First(c => c.Code == LicenseCategoryCode.E);
            var catF = categories.First(c => c.Code == LicenseCategoryCode.F);

            // Get fee structures for creating payments
            var appFeeB = context.FeeStructures.First(f => f.FeeType == FeeType.ApplicationFee && f.LicenseCategoryId == catB.Id);
            var medicalFeeB = context.FeeStructures.First(f => f.FeeType == FeeType.MedicalExamFee && f.LicenseCategoryId == catB.Id);
            var theoryFeeB = context.FeeStructures.First(f => f.FeeType == FeeType.TheoryTestFee && f.LicenseCategoryId == catB.Id);
            var practicalFeeB = context.FeeStructures.First(f => f.FeeType == FeeType.PracticalTestFee && f.LicenseCategoryId == catB.Id);
            var issuanceFeeB = context.FeeStructures.First(f => f.FeeType == FeeType.IssuanceFee && f.LicenseCategoryId == catB.Id);

            var appFeeF = context.FeeStructures.First(f => f.FeeType == FeeType.ApplicationFee && f.LicenseCategoryId == catF.Id);
            var medicalFeeF = context.FeeStructures.First(f => f.FeeType == FeeType.MedicalExamFee && f.LicenseCategoryId == catF.Id);
            var theoryFeeF = context.FeeStructures.First(f => f.FeeType == FeeType.TheoryTestFee && f.LicenseCategoryId == catF.Id);
            var practicalFeeF = context.FeeStructures.First(f => f.FeeType == FeeType.PracticalTestFee && f.LicenseCategoryId == catF.Id);

            var applications = new List<Domain.Entities.Application>
            {
                // Application 1 - Category B - Submitted (waiting for document review)
                new Domain.Entities.Application
                {
                    ApplicationNumber = $"MOJ-{DateTime.UtcNow.Year}-11000001",
                    ApplicantId = applicant.Id,
                    ServiceType = ServiceType.NewLicense,
                    LicenseCategoryId = catB.Id,
                    Status = ApplicationStatus.Submitted,
                    CurrentStage = "DocumentReview",
                    DataAccuracyConfirmed = true,
                    SubmittedAt = DateTime.UtcNow.AddDays(-1),
                    ExpiresAt = DateTime.UtcNow.AddMonths(6)
                },
                // Application 2 - Category A - Submitted (waiting for document review)
                new Domain.Entities.Application
                {
                    ApplicationNumber = $"MOJ-{DateTime.UtcNow.Year}-11000002",
                    ApplicantId = applicant.Id,
                    ServiceType = ServiceType.NewLicense,
                    LicenseCategoryId = catA.Id,
                    Status = ApplicationStatus.Submitted,
                    CurrentStage = "DocumentReview",
                    DataAccuracyConfirmed = true,
                    SubmittedAt = DateTime.UtcNow.AddDays(-2),
                    ExpiresAt = DateTime.UtcNow.AddMonths(6)
                },
                // Application 3 - Category C - Submitted (waiting for document review)
                new Domain.Entities.Application
                {
                    ApplicationNumber = $"MOJ-{DateTime.UtcNow.Year}-11000003",
                    ApplicantId = applicant.Id,
                    ServiceType = ServiceType.NewLicense,
                    LicenseCategoryId = catC.Id,
                    Status = ApplicationStatus.Submitted,
                    CurrentStage = "DocumentReview",
                    DataAccuracyConfirmed = true,
                    SubmittedAt = DateTime.UtcNow.AddDays(-3),
                    ExpiresAt = DateTime.UtcNow.AddMonths(6)
                },
                // Application 4 - Category B - Document Review stage
                new Domain.Entities.Application
                {
                    ApplicationNumber = $"MOJ-{DateTime.UtcNow.Year}-11000004",
                    ApplicantId = applicant.Id,
                    ServiceType = ServiceType.NewLicense,
                    LicenseCategoryId = catB.Id,
                    Status = ApplicationStatus.DocumentReview,
                    CurrentStage = "DocumentReview",
                    DataAccuracyConfirmed = true,
                    SubmittedAt = DateTime.UtcNow.AddDays(-5),
                    ExpiresAt = DateTime.UtcNow.AddMonths(6)
                },
                // Application 5 - Category B - Medical Exam (from older seed)
                new Domain.Entities.Application
                {
                    ApplicationNumber = $"MOJ-{DateTime.UtcNow.Year}-10000005",
                    ApplicantId = applicant.Id,
                    ServiceType = ServiceType.NewLicense,
                    LicenseCategoryId = catB.Id,
                    Status = ApplicationStatus.MedicalExam,
                    CurrentStage = "MedicalExam",
                    DataAccuracyConfirmed = true,
                    SubmittedAt = DateTime.UtcNow.AddDays(-7),
                    ExpiresAt = DateTime.UtcNow.AddMonths(6)
                },
                // Application 6 - Category D - Theory Test (from older seed)
                new Domain.Entities.Application
                {
                    ApplicationNumber = $"MOJ-{DateTime.UtcNow.Year}-10000006",
                    ApplicantId = applicant.Id,
                    ServiceType = ServiceType.NewLicense,
                    LicenseCategoryId = catD.Id,
                    Status = ApplicationStatus.TheoryTest,
                    CurrentStage = "TheoryTest",
                    DataAccuracyConfirmed = true,
                    SubmittedAt = DateTime.UtcNow.AddDays(-10),
                    ExpiresAt = DateTime.UtcNow.AddMonths(6)
                },
                // Application 7 - Category E - In Review stage
                new Domain.Entities.Application
                {
                    ApplicationNumber = $"MOJ-{DateTime.UtcNow.Year}-11000007",
                    ApplicantId = applicant.Id,
                    ServiceType = ServiceType.NewLicense,
                    LicenseCategoryId = catE.Id,
                    Status = ApplicationStatus.InReview,
                    CurrentStage = "ReceptionReview",
                    DataAccuracyConfirmed = true,
                    SubmittedAt = DateTime.UtcNow.AddDays(-4),
                    ExpiresAt = DateTime.UtcNow.AddMonths(6)
                },
                // Application 8 - Category F - Training stage
                new Domain.Entities.Application
                {
                    ApplicationNumber = $"MOJ-{DateTime.UtcNow.Year}-11000008",
                    ApplicantId = applicant.Id,
                    ServiceType = ServiceType.NewLicense,
                    LicenseCategoryId = catF.Id,
                    Status = ApplicationStatus.Training,
                    CurrentStage = "Training",
                    DataAccuracyConfirmed = true,
                    SubmittedAt = DateTime.UtcNow.AddDays(-6),
                    ExpiresAt = DateTime.UtcNow.AddMonths(6)
                }
            };

            await context.Applications.AddRangeAsync(applications);
            await context.SaveChangesAsync();

            // Create Payment records for each application with Status = Paid
            var payments = new List<PaymentTransaction>();

            // App 1 - Paid Application Fee + Medical Exam Fee (ready for Medical Exam appointment)
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[0].Id,
                FeeType = FeeType.ApplicationFee,
                Amount = appFeeB.Amount,
                Currency = appFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000001:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-4),
                ReceiptNumber = $"RCP-{1000001:D4}"
            });
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[0].Id,
                FeeType = FeeType.MedicalExamFee,
                Amount = medicalFeeB.Amount,
                Currency = medicalFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000002:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-3),
                ReceiptNumber = $"RCP-{1000002:D4}"
            });

            // App 2 - Paid Application Fee + Medical Exam Fee + Theory Test Fee (ready for Theory Test appointment)
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[1].Id,
                FeeType = FeeType.ApplicationFee,
                Amount = appFeeB.Amount,
                Currency = appFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000003:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-9),
                ReceiptNumber = $"RCP-{1000003:D4}"
            });
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[1].Id,
                FeeType = FeeType.MedicalExamFee,
                Amount = medicalFeeB.Amount,
                Currency = medicalFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000004:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-8),
                ReceiptNumber = $"RCP-{1000004:D4}"
            });
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[1].Id,
                FeeType = FeeType.TheoryTestFee,
                Amount = theoryFeeB.Amount,
                Currency = theoryFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000005:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-7),
                ReceiptNumber = $"RCP-{1000005:D4}"
            });

            // App 3 - Paid Application Fee + Medical Exam Fee (Category F - ready for Medical Exam)
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[2].Id,
                FeeType = FeeType.ApplicationFee,
                Amount = appFeeF.Amount,
                Currency = appFeeF.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000006:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-2),
                ReceiptNumber = $"RCP-{1000006:D4}"
            });
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[2].Id,
                FeeType = FeeType.MedicalExamFee,
                Amount = medicalFeeF.Amount,
                Currency = medicalFeeF.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000007:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-1),
                ReceiptNumber = $"RCP-{1000007:D4}"
            });

            // App 4 - Paid all fees through Practical Test (ready for Practical Test appointment)
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[3].Id,
                FeeType = FeeType.ApplicationFee,
                Amount = appFeeB.Amount,
                Currency = appFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000008:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-14),
                ReceiptNumber = $"RCP-{1000008:D4}"
            });
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[3].Id,
                FeeType = FeeType.MedicalExamFee,
                Amount = medicalFeeB.Amount,
                Currency = medicalFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000009:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-13),
                ReceiptNumber = $"RCP-{1000009:D4}"
            });
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[3].Id,
                FeeType = FeeType.TheoryTestFee,
                Amount = theoryFeeB.Amount,
                Currency = theoryFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000010:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-12),
                ReceiptNumber = $"RCP-{1000010:D4}"
            });
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[3].Id,
                FeeType = FeeType.PracticalTestFee,
                Amount = practicalFeeB.Amount,
                Currency = practicalFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000011:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-11),
                ReceiptNumber = $"RCP-{1000011:D4}"
            });

            // App 5 - Paid all fees except Issuance Fee (waiting for final payment)
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[4].Id,
                FeeType = FeeType.ApplicationFee,
                Amount = appFeeB.Amount,
                Currency = appFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000012:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-19),
                ReceiptNumber = $"RCP-{1000012:D4}"
            });
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[4].Id,
                FeeType = FeeType.MedicalExamFee,
                Amount = medicalFeeB.Amount,
                Currency = medicalFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000013:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-18),
                ReceiptNumber = $"RCP-{1000013:D4}"
            });
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[4].Id,
                FeeType = FeeType.TheoryTestFee,
                Amount = theoryFeeB.Amount,
                Currency = theoryFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000014:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-17),
                ReceiptNumber = $"RCP-{1000014:D4}"
            });
            payments.Add(new PaymentTransaction
            {
                ApplicationId = applications[4].Id,
                FeeType = FeeType.PracticalTestFee,
                Amount = practicalFeeB.Amount,
                Currency = practicalFeeB.Currency,
                Status = PaymentStatus.Paid,
                PaymentMethod = "Cash",
                TransactionReference = $"PAY-MOJ-2025-{1000015:D4}",
                PaidAt = DateTime.UtcNow.AddDays(-16),
                ReceiptNumber = $"RCP-{1000015:D4}"
            });

            await context.PaymentTransactions.AddRangeAsync(payments);
            await context.SaveChangesAsync();
        }

        private static async Task SeedTestAppointmentsAsync(MojazDbContext context, List<User> users)
        {
            var applicant = users.First(u => u.Role == UserRole.Applicant);
            var application = await context.Applications
                .FirstOrDefaultAsync(a => a.ApplicantId == applicant.Id);

            if (application == null || context.Appointments.Any(a => a.ApplicationId == application.Id)) return;

            var appointments = new List<Appointment>
            {
                new Appointment
                {
                    ApplicationId = application.Id,
                    AppointmentType = AppointmentType.MedicalExam,
                    ScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2)),
                    TimeSlot = "09:00",
                    BranchId = 1,
                    Status = AppointmentStatus.Scheduled,
                    Notes = "موعد فحص طبي تجريبي",
                    CreatedAt = DateTime.UtcNow
                },
                new Appointment
                {
                    ApplicationId = application.Id,
                    AppointmentType = AppointmentType.TheoryTest,
                    ScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7)),
                    TimeSlot = "10:30",
                    BranchId = 2,
                    Status = AppointmentStatus.Scheduled,
                    Notes = "موعد اختبار نظري تجريبي",
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Appointments.AddRangeAsync(appointments);
            await context.SaveChangesAsync();
        }

        /// <summary>
        /// Resets all locked test accounts (for use when test accounts get locked during development)
        /// </summary>
        public static async Task ResetLockedAccountsAsync(MojazDbContext context)
        {
            var lockedUsers = context.Users
                .Where(u => u.IsLocked && u.Email.EndsWith("@mojaz.gov.sa"))
                .ToList();
            
            foreach (var user in lockedUsers)
            {
                user.IsLocked = false;
                user.LockoutEnd = null;
                user.FailedLoginAttempts = 0;
            }
            
            if (lockedUsers.Any())
            {
                await context.SaveChangesAsync();
            }
        }
    }
}
