using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Infrastructure.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace DrivingLicenseIssuanceSystem.Infrastructure.Data.Seeding
{
    public static class TestDataSeeder
    {
        public static async Task SeedAsync(DrivingLicenseIssuanceSystemDbContext context)
        {
            if (context.Users.Any(u => u.Email.EndsWith("@DrivingLicenseIssuanceSystem.gov.sa"))) return;

            // Using cost factor 12 as per security rules
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("Password123!", 12);

            var users = new List<User>
            {
                new User { 
                    FullNameAr = "متقدم تجريبي", 
                    FullNameEn = "Test Applicant", 
                    NationalId = "1000000001", 
                    Email = "applicant@DrivingLicenseIssuanceSystem.gov.sa", 
                    PhoneNumber = "0500000001", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Applicant, 
                    DateOfBirth = new DateTime(1990, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                },
                new User { 
                    FullNameAr = "موظف استقبال", 
                    FullNameEn = "Test Receptionist", 
                    NationalId = "1000000002", 
                    Email = "receptionist@DrivingLicenseIssuanceSystem.gov.sa", 
                    PhoneNumber = "0500000002", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Receptionist, 
                    DateOfBirth = new DateTime(1985, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                },
                new User { 
                    FullNameAr = "طبيب تجريبي", 
                    FullNameEn = "Test Doctor", 
                    NationalId = "1000000003", 
                    Email = "doctor@DrivingLicenseIssuanceSystem.gov.sa", 
                    PhoneNumber = "0500000003", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Doctor, 
                    DateOfBirth = new DateTime(1980, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                },
                new User { 
                    FullNameAr = "فاحص تجريبي", 
                    FullNameEn = "Test Examiner", 
                    NationalId = "1000000004", 
                    Email = "examiner@DrivingLicenseIssuanceSystem.gov.sa", 
                    PhoneNumber = "0500000004", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Examiner, 
                    DateOfBirth = new DateTime(1982, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                },
                new User { 
                    FullNameAr = "مدير تجريبي", 
                    FullNameEn = "Test Manager", 
                    NationalId = "1000000005", 
                    Email = "manager@DrivingLicenseIssuanceSystem.gov.sa", 
                    PhoneNumber = "0500000005", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Manager, 
                    DateOfBirth = new DateTime(1978, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                },
                new User { 
                    FullNameAr = "مسؤول نظام", 
                    FullNameEn = "Test Admin", 
                    NationalId = "1000000006", 
                    Email = "admin@DrivingLicenseIssuanceSystem.gov.sa", 
                    PhoneNumber = "0500000006", 
                    PasswordHash = passwordHash, 
                    Role = UserRole.Admin, 
                    DateOfBirth = new DateTime(1980, 1, 1),
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    IsActive = true
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }
    }
}
