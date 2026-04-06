namespace Mojaz.Infrastructure.Data.Seeders;

using Mojaz.Domain.Entities.Config;

/// <summary>
/// Seeder for system lookup data including settings, license categories, and fees.
/// Populates reference data required for the application to function.
/// </summary>
public class LookupSeeder
{
    /// <summary>
    /// Seeds system settings with default configuration values.
    /// </summary>
    public static List<SystemSetting> SeedSystemSettings()
    {
        return new List<SystemSetting>
        {
            new SystemSetting
            {
                Id = 1,
                Key = "MAX_APPOINTMENT_DAYS_AHEAD",
                Value = "30",
                Description = "Maximum number of days ahead to book an appointment",
                DataType = "int",
                IsPublic = false
            },
            new SystemSetting
            {
                Id = 2,
                Key = "MIN_APPOINTMENT_DAYS_AHEAD",
                Value = "1",
                Description = "Minimum number of days ahead to book an appointment",
                DataType = "int",
                IsPublic = false
            },
            new SystemSetting
            {
                Id = 3,
                Key = "APPLICATION_EXPIRATION_DAYS",
                Value = "90",
                Description = "Number of days an application remains valid",
                DataType = "int",
                IsPublic = false
            },
            new SystemSetting
            {
                Id = 4,
                Key = "THEORY_TEST_PASSING_SCORE",
                Value = "70",
                Description = "Minimum passing score for theory test (out of 100)",
                DataType = "int",
                IsPublic = false
            },
            new SystemSetting
            {
                Id = 5,
                Key = "PRACTICAL_TEST_PASSING_SCORE",
                Value = "75",
                Description = "Minimum passing score for practical test (out of 100)",
                DataType = "int",
                IsPublic = false
            },
            new SystemSetting
            {
                Id = 6,
                Key = "LICENSE_RENEWAL_REMINDER_DAYS",
                Value = "30",
                Description = "Days before expiry to send renewal reminder",
                DataType = "int",
                IsPublic = false
            },
            new SystemSetting
            {
                Id = 7,
                Key = "SYSTEM_CURRENCY",
                Value = "SAR",
                Description = "Default currency for the system",
                DataType = "string",
                IsPublic = true
            },
            new SystemSetting
            {
                Id = 8,
                Key = "SYSTEM_LANGUAGE",
                Value = "ar",
                Description = "Default system language (ar for Arabic, en for English)",
                DataType = "string",
                IsPublic = true
            },
            new SystemSetting
            {
                Id = 9,
                Key = "MAINTENANCE_MODE",
                Value = "false",
                Description = "Enable or disable maintenance mode",
                DataType = "bool",
                IsPublic = false
            },
            new SystemSetting
            {
                Id = 10,
                Key = "MAX_LOGIN_ATTEMPTS",
                Value = "5",
                Description = "Maximum failed login attempts before account lockout",
                DataType = "int",
                IsPublic = false
            }
        };
    }

    /// <summary>
    /// Seeds license categories with standard driving license types.
    /// </summary>
    public static List<LicenseCategory> SeedLicenseCategories()
    {
        return new List<LicenseCategory>
        {
            new LicenseCategory
            {
                Id = 1,
                Code = "A",
                NameAr = "œ——«Ã«  ‰«—Ì…",
                NameEn = "Motorcycles",
                Description = "Two and three-wheeled motorcycles",
                IsActive = true,
                ValidityYears = 5,
                RequiresX = null,
                MinAge = 18
            },
            new LicenseCategory
            {
                Id = 2,
                Code = "B",
                NameAr = "”Ì«—«  Œ«’…",
                NameEn = "Private Vehicles",
                Description = "Passenger cars up to 9 seats",
                IsActive = true,
                ValidityYears = 10,
                RequiresX = null,
                MinAge = 18
            },
            new LicenseCategory
            {
                Id = 3,
                Code = "C",
                NameAr = "«·‘«Õ‰« ",
                NameEn = "Light Trucks",
                Description = "Commercial vehicles over 3.5 tonnes",
                IsActive = true,
                ValidityYears = 5,
                RequiresX = "B",
                MinAge = 21
            },
            new LicenseCategory
            {
                Id = 4,
                Code = "D",
                NameAr = "Õ«›·« ",
                NameEn = "Buses",
                Description = "Vehicles designed for passenger transport",
                IsActive = true,
                ValidityYears = 5,
                RequiresX = "B",
                MinAge = 24
            },
            new LicenseCategory
            {
                Id = 5,
                Code = "BE",
                NameAr = "„ﬁÿÊ—… Œ›Ì›…",
                NameEn = "Light Trailer",
                Description = "Light trailer combination",
                IsActive = true,
                ValidityYears = 10,
                RequiresX = "B",
                MinAge = 18
            },
            new LicenseCategory
            {
                Id = 6,
                Code = "C1",
                NameAr = "‘«Õ‰… „ Ê”ÿ…",
                NameEn = "Medium Truck",
                Description = "Medium commercial vehicles",
                IsActive = true,
                ValidityYears = 5,
                RequiresX = "B",
                MinAge = 18
            },
            new LicenseCategory
            {
                Id = 7,
                Code = "AM",
                NameAr = "œ——«Ã«  ’€Ì—…",
                NameEn = "Mopeds",
                Description = "Motorized bicycles and mopeds",
                IsActive = true,
                ValidityYears = 5,
                RequiresX = null,
                MinAge = 16
            }
        };
    }

    /// <summary>
    /// Seeds fee structures for various services and license categories.
    /// </summary>
    public static List<FeeStructure> SeedFeeStructures()
    {
        return new List<FeeStructure>
        {
            // Application Fees
            new FeeStructure
            {
                Id = 1,
                Code = "APP_FEE_B",
                NameAr = "—”„ «· ﬁœÌ„ (›∆… »)",
                NameEn = "Application Fee (Category B)",
                Category = "Application",
                Amount = 100,
                Currency = "SAR",
                LicenseCategoryId = 2,
                EffectiveFrom = new DateTime(2024, 1, 1),
                EffectiveTo = null
            },
            new FeeStructure
            {
                Id = 2,
                Code = "APP_FEE_A",
                NameAr = "—”„ «· ﬁœÌ„ (›∆… √)",
                NameEn = "Application Fee (Category A)",
                Category = "Application",
                Amount = 80,
                Currency = "SAR",
                LicenseCategoryId = 1,
                EffectiveFrom = new DateTime(2024, 1, 1),
                EffectiveTo = null
            },
            
            // Theory Test Fees
            new FeeStructure
            {
                Id = 3,
                Code = "THEORY_TEST_FEE",
                NameAr = "—”„ «Œ »«— «·‰Ÿ—Ì",
                NameEn = "Theory Test Fee",
                Category = "Exam",
                Amount = 50,
                Currency = "SAR",
                LicenseCategoryId = null,
                EffectiveFrom = new DateTime(2024, 1, 1),
                EffectiveTo = null
            },
            
            // Practical Test Fees
            new FeeStructure
            {
                Id = 4,
                Code = "PRACTICAL_TEST_FEE",
                NameAr = "—”„ «Œ »«— «·⁄„·Ì",
                NameEn = "Practical Test Fee",
                Category = "Exam",
                Amount = 75,
                Currency = "SAR",
                LicenseCategoryId = null,
                EffectiveFrom = new DateTime(2024, 1, 1),
                EffectiveTo = null
            },
            
            // Medical Examination Fee
            new FeeStructure
            {
                Id = 5,
                Code = "MEDICAL_FEE",
                NameAr = "—”„ «·›Õ’ «·ÿ»Ì",
                NameEn = "Medical Examination Fee",
                Category = "Medical",
                Amount = 120,
                Currency = "SAR",
                LicenseCategoryId = null,
                EffectiveFrom = new DateTime(2024, 1, 1),
                EffectiveTo = null
            },
            
            // License Issuance Fees
            new FeeStructure
            {
                Id = 6,
                Code = "LICENSE_ISSUE_FEE_B",
                NameAr = "—”„ ≈’œ«— «·—Œ’… (›∆… »)",
                NameEn = "License Issuance Fee (Category B)",
                Category = "Issuance",
                Amount = 200,
                Currency = "SAR",
                LicenseCategoryId = 2,
                EffectiveFrom = new DateTime(2024, 1, 1),
                EffectiveTo = null
            },
            new FeeStructure
            {
                Id = 7,
                Code = "LICENSE_ISSUE_FEE_A",
                NameAr = "—”„ ≈’œ«— «·—Œ’… (›∆… √)",
                NameEn = "License Issuance Fee (Category A)",
                Category = "Issuance",
                Amount = 150,
                Currency = "SAR",
                LicenseCategoryId = 1,
                EffectiveFrom = new DateTime(2024, 1, 1),
                EffectiveTo = null
            },
            
            // Renewal Fees
            new FeeStructure
            {
                Id = 8,
                Code = "RENEWAL_FEE_B",
                NameAr = "—”„ «· ÃœÌœ (›∆… »)",
                NameEn = "Renewal Fee (Category B)",
                Category = "Renewal",
                Amount = 180,
                Currency = "SAR",
                LicenseCategoryId = 2,
                EffectiveFrom = new DateTime(2024, 1, 1),
                EffectiveTo = null
            },
            new FeeStructure
            {
                Id = 9,
                Code = "RENEWAL_FEE_A",
                NameAr = "—”„ «· ÃœÌœ (›∆… √)",
                NameEn = "Renewal Fee (Category A)",
                Category = "Renewal",
                Amount = 130,
                Currency = "SAR",
                LicenseCategoryId = 1,
                EffectiveFrom = new DateTime(2024, 1, 1),
                EffectiveTo = null
            },
            
            // Replacement/Duplicate Fees
            new FeeStructure
            {
                Id = 10,
                Code = "REPLACEMENT_FEE",
                NameAr = "—”„ «·«” Œ—«Ã «·„ﬂ——",
                NameEn = "Replacement Fee",
                Category = "Replacement",
                Amount = 75,
                Currency = "SAR",
                LicenseCategoryId = null,
                EffectiveFrom = new DateTime(2024, 1, 1),
                EffectiveTo = null
            }
        };
    }
}
