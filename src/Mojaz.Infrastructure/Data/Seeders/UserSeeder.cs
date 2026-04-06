namespace Mojaz.Infrastructure.Data.Seeders;

using Mojaz.Domain.Entities.Identity;
using System.Security.Cryptography;
using System.Text;

/// <summary>
/// Seeder for user test data including Admin, Employees, and Applicants.
/// Creates default users for development and testing.
/// </summary>
public class UserSeeder
{
    /// <summary>
    /// Seeds test users with different roles (Admin, Employee, Applicant).
    /// Uses a consistent hashing for test passwords.
    /// </summary>
    public static List<User> SeedUsers()
    {
        return new List<User>
        {
            // System Administrator
            new User
            {
                Id = 1,
                FirstName = "System",
                LastName = "Administrator",
                Email = "admin@mojaz.local",
                PasswordHash = HashPassword("Admin@123"),
                PhoneNumber = "+966501234567",
                NationalId = "1234567890",
                Gender = "Male",
                IsActive = true,
                LastLoginAt = null,
                RegistrationMethod = "System",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = null,
                UpdatedAt = null,
                UpdatedBy = null,
                IsDeleted = false,
                DeletedAt = null
            },

            // Operations Manager
            new User
            {
                Id = 2,
                FirstName = "Ahmed",
                LastName = "Al-Mansouri",
                Email = "ahmed.mansouri@mojaz.local",
                PasswordHash = HashPassword("Employee@123"),
                PhoneNumber = "+966509876543",
                NationalId = "0987654321",
                Gender = "Male",
                IsActive = true,
                LastLoginAt = null,
                RegistrationMethod = "System",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = 1,
                UpdatedAt = null,
                UpdatedBy = null,
                IsDeleted = false,
                DeletedAt = null
            },

            // Theory Test Examiner
            new User
            {
                Id = 3,
                FirstName = "Fatima",
                LastName = "Al-Dosari",
                Email = "fatima.dosari@mojaz.local",
                PasswordHash = HashPassword("Employee@123"),
                PhoneNumber = "+966505555555",
                NationalId = "1122334455",
                Gender = "Female",
                IsActive = true,
                LastLoginAt = null,
                RegistrationMethod = "System",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = 1,
                UpdatedAt = null,
                UpdatedBy = null,
                IsDeleted = false,
                DeletedAt = null
            },

            // Practical Test Examiner
            new User
            {
                Id = 4,
                FirstName = "Mohammed",
                LastName = "Al-Otaibi",
                Email = "mohammed.otaibi@mojaz.local",
                PasswordHash = HashPassword("Employee@123"),
                PhoneNumber = "+966503333333",
                NationalId = "5544332211",
                Gender = "Male",
                IsActive = true,
                LastLoginAt = null,
                RegistrationMethod = "System",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = 1,
                UpdatedAt = null,
                UpdatedBy = null,
                IsDeleted = false,
                DeletedAt = null
            },

            // Medical Examiner
            new User
            {
                Id = 5,
                FirstName = "Dr. Noor",
                LastName = "Al-Shammari",
                Email = "noor.shammari@mojaz.local",
                PasswordHash = HashPassword("Employee@123"),
                PhoneNumber = "+966501111111",
                NationalId = "6677889900",
                Gender = "Female",
                IsActive = true,
                LastLoginAt = null,
                RegistrationMethod = "System",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = 1,
                UpdatedAt = null,
                UpdatedBy = null,
                IsDeleted = false,
                DeletedAt = null
            },

            // Test Applicant 1 - Category B
            new User
            {
                Id = 6,
                FirstName = "Ali",
                LastName = "Al-Qahtani",
                Email = "ali.qahtani@example.com",
                PasswordHash = HashPassword("Applicant@123"),
                PhoneNumber = "+966507777777",
                NationalId = "1010101010",
                Gender = "Male",
                IsActive = true,
                LastLoginAt = null,
                RegistrationMethod = "Email",
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                CreatedBy = null,
                UpdatedAt = null,
                UpdatedBy = null,
                IsDeleted = false,
                DeletedAt = null
            },

            // Test Applicant 2 - Category B
            new User
            {
                Id = 7,
                FirstName = "Layla",
                LastName = "Al-Rashid",
                Email = "layla.rashid@example.com",
                PasswordHash = HashPassword("Applicant@123"),
                PhoneNumber = "+966508888888",
                NationalId = "2020202020",
                Gender = "Female",
                IsActive = true,
                LastLoginAt = null,
                RegistrationMethod = "Email",
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                CreatedBy = null,
                UpdatedAt = null,
                UpdatedBy = null,
                IsDeleted = false,
                DeletedAt = null
            },

            // Test Applicant 3 - Category A
            new User
            {
                Id = 8,
                FirstName = "Omar",
                LastName = "Al-Harbi",
                Email = "omar.harbi@example.com",
                PasswordHash = HashPassword("Applicant@123"),
                PhoneNumber = "+966502222222",
                NationalId = "3030303030",
                Gender = "Male",
                IsActive = true,
                LastLoginAt = null,
                RegistrationMethod = "Phone",
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                CreatedBy = null,
                UpdatedAt = null,
                UpdatedBy = null,
                IsDeleted = false,
                DeletedAt = null
            },

            // Test Applicant 4 - Category C
            new User
            {
                Id = 9,
                FirstName = "Yasmin",
                LastName = "Al-Fuhaidi",
                Email = "yasmin.fuhaidi@example.com",
                PasswordHash = HashPassword("Applicant@123"),
                PhoneNumber = "+966504444444",
                NationalId = "4040404040",
                Gender = "Female",
                IsActive = true,
                LastLoginAt = null,
                RegistrationMethod = "Email",
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                CreatedBy = null,
                UpdatedAt = null,
                UpdatedBy = null,
                IsDeleted = false,
                DeletedAt = null
            },

            // Test Applicant 5 - Category D
            new User
            {
                Id = 10,
                FirstName = "Ibrahim",
                LastName = "Al-Matani",
                Email = "ibrahim.matani@example.com",
                PasswordHash = HashPassword("Applicant@123"),
                PhoneNumber = "+966506666666",
                NationalId = "5050505050",
                Gender = "Male",
                IsActive = true,
                LastLoginAt = null,
                RegistrationMethod = "Email",
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                CreatedBy = null,
                UpdatedAt = null,
                UpdatedBy = null,
                IsDeleted = false,
                DeletedAt = null
            }
        };
    }

    /// <summary>
    /// Simple password hashing for test data.
    /// NOTE: In production, use proper password hashing libraries like BCrypt or PBKDF2.
    /// This is for development/testing only.
    /// </summary>
    private static string HashPassword(string password)
    {
        // For test data, we use a simple hash
        // In production, this should be done with BCrypt or similar
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    /// <summary>
    /// Gets information about the seeded users for logging/debugging.
    /// </summary>
    public static string GetSeedSummary()
    {
        return @"
USER SEED DATA SUMMARY
======================

Administrators (1):
  - admin@mojaz.local (System Administrator)

Employees (4):
  - ahmed.mansouri@mojaz.local (Operations Manager)
  - fatima.dosari@mojaz.local (Theory Test Examiner)
  - mohammed.otaibi@mojaz.local (Practical Test Examiner)
  - noor.shammari@mojaz.local (Medical Examiner)

Test Applicants (5):
  - ali.qahtani@example.com (Category B)
  - layla.rashid@example.com (Category B)
  - omar.harbi@example.com (Category A)
  - yasmin.fuhaidi@example.com (Category C)
  - ibrahim.matani@example.com (Category D)

Default Password: Applicant@123 (for applicants)
Default Password: Employee@123 (for employees)
Default Password: Admin@123 (for admin)
";
    }
}
