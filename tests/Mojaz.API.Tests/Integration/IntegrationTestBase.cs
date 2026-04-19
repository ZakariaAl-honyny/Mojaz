using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using DrivingLicenseIssuanceSystem.API;
using DrivingLicenseIssuanceSystem.Infrastructure.Persistence;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Hangfire;
using DrivingLicenseIssuanceSystem.Shared.Constants;
using Moq;
using DrivingLicenseIssuanceSystem.Infrastructure.Services;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Services;
using DrivingLicenseIssuanceSystem.Application.Interfaces;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Infrastructure;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Domain.Entities;

namespace DrivingLicenseIssuanceSystem.API.Tests.Integration;

public class IntegrationTestBase : IDisposable
{
    protected readonly WebApplicationFactory<Program> Factory;
    protected readonly HttpClient Client;
    protected readonly IServiceScope Scope;
    protected readonly DrivingLicenseIssuanceSystemDbContext DbContext;

    public IntegrationTestBase()
    {
        Factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove the existing DbContext registration
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<DrivingLicenseIssuanceSystemDbContext>));
                if (descriptor != null) services.Remove(descriptor);

                // Add In-Memory Database for testing
                services.AddDbContext<DrivingLicenseIssuanceSystemDbContext>(options =>
                {
                    options.UseInMemoryDatabase("IntegrationTestDb");
                });

                // Remove existing ISendGridClient registration and add mock
                var sendGridDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(ISendGridClient));
                if (sendGridDescriptor != null) services.Remove(sendGridDescriptor);
                
                // Add mock ISendGridClient
                var mockSendGridClient = new Mock<ISendGridClient>();
                mockSendGridClient
                    .Setup(x => x.SendEmailAsync(It.IsAny<SendGrid.Helpers.Mail.SendGridMessage>(), It.IsAny<CancellationToken>()))
                    .Returns(Task.FromResult(new SendGrid.Response(System.Net.HttpStatusCode.Accepted, null, null)));
                services.AddSingleton(mockSendGridClient.Object);

                // Add mock INotificationService
                var mockNotificationService = new Mock<INotificationService>();
                mockNotificationService
                    .Setup(x => x.SendAsync(It.IsAny<NotificationRequest>()))
                    .Returns(Task.CompletedTask);
                services.AddSingleton(mockNotificationService.Object);

                // Add mock IEmailService from DrivingLicenseIssuanceSystem.Application.Interfaces.Services
                var mockEmailService = new Mock<DrivingLicenseIssuanceSystem.Application.Interfaces.Services.IEmailService>();
                mockEmailService
                    .Setup(x => x.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                    .Returns(Task.CompletedTask);
                mockEmailService
                    .Setup(x => x.SendTemplatedAsync(It.IsAny<DrivingLicenseIssuanceSystem.Application.DTOs.Email.TemplatedEmailRequest>()))
                    .Returns(Task.CompletedTask);
                services.AddSingleton(mockEmailService.Object);

                // Add mock IAuditService
                var mockAuditService = new Mock<IAuditService>();
                mockAuditService
                    .Setup(x => x.LogAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                    .Returns(Task.CompletedTask);
                services.AddSingleton(mockAuditService.Object);

                // Add mock IPdfGenerator<string> for license generation (used by ReplaceLicenseService indirectly)
                var mockLicensePdfGenerator = new Mock<DrivingLicenseIssuanceSystem.Application.Interfaces.Infrastructure.ILicensePdfGenerator>();
                mockLicensePdfGenerator
                    .Setup(x => x.GenerateLicensePdfAsync(It.IsAny<License>(), It.IsAny<User>(), It.IsAny<LicenseCategory>()))
                    .Returns(Task.FromResult(new byte[] { 1, 2, 3 }));
                services.AddSingleton(mockLicensePdfGenerator.Object);

                // Remove existing authentication services to ensure TestAuthHandler is used
                var authDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider));
                if (authDescriptor != null) services.Remove(authDescriptor);
                
                // Remove existing JWT authentication schemes added by the main app
                var jwtSchemeDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerOptions));
                while (jwtSchemeDescriptor != null)
                {
                    services.Remove(jwtSchemeDescriptor);
                    jwtSchemeDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerOptions));
                }
                
                // Remove any existing authentication handlers
                var handlersToRemove = services.Where(d => d.ServiceType.Name.Contains("AuthenticationHandler")).ToList();
                foreach (var handler in handlersToRemove)
                {
                    services.Remove(handler);
                }

                // Add TestAuthHandler as the authentication scheme provider
                services.AddAuthentication(options =>
                {
                    options.DefaultScheme = "TestScheme";
                    options.DefaultAuthenticateScheme = "TestScheme";
                    options.DefaultChallengeScheme = "TestScheme";
                })
                .AddScheme<Microsoft.AspNetCore.Authentication.AuthenticationSchemeOptions, TestAuthHandler>("TestScheme", options => { });

                // Add authorization policies (similar to Program.cs)
                services.AddAuthorization(options =>
                {
                    options.DefaultPolicy = new Microsoft.AspNetCore.Authorization.AuthorizationPolicyBuilder()
                        .AddAuthenticationSchemes("TestScheme")
                        .RequireAuthenticatedUser()
                        .Build();
                    
                    // Add role-based authorization - for Authorize(Roles = "...")
                    // We need to use RoleClaimsTransformation or configure role-based auth
                    
                    // Add AdminOnly policy
                    options.AddPolicy(RolePolicies.AdminOnly, policy => 
                        policy.RequireClaim("role", Roles.Admin));
                    
                    // Add EmployeeOnly policy
                    options.AddPolicy(RolePolicies.EmployeeOnly, policy => 
                        policy.RequireClaim("role", 
                            Roles.Admin, 
                            Roles.Receptionist, 
                            Roles.Doctor, 
                            Roles.Examiner, 
                            Roles.Manager, 
                            Roles.Security));
                    
                    // Add ApplicantOnly policy
                    options.AddPolicy(RolePolicies.ApplicantOnly, policy => 
                        policy.RequireClaim("role", Roles.Applicant));
                        
                    // Add ReceptionistOrAbove policy
                    options.AddPolicy(RolePolicies.ReceptionistOrAbove, policy => 
                        policy.RequireClaim("role", 
                            Roles.Admin, 
                            Roles.Receptionist));
                            
                    // Add ExaminerOrAbove policy
                    options.AddPolicy(RolePolicies.ExaminerOrAbove, policy => 
                        policy.RequireClaim("role", 
                            Roles.Admin, 
                            Roles.Receptionist, 
                            Roles.Doctor, 
                            Roles.Examiner));
                            
                    // Add ManagerOrAbove policy
                    options.AddPolicy(RolePolicies.ManagerOrAbove, policy => 
                        policy.RequireClaim("role", 
                            Roles.Admin, 
                            Roles.Receptionist, 
                            Roles.Manager));
                    
                    // Fallback policy for role-based authorization
                    // This enables Authorize(Roles = "...") to work
                    options.AddPolicy("RoleBased", policy => policy.RequireClaim("role"));
                });

                // Fix Hangfire - use in-memory storage for tests
                services.AddHangfire(config => config.UseInMemoryStorage());
            });
        });

        Client = Factory.CreateClient();
        Scope = Factory.Services.CreateScope();
        DbContext = Scope.ServiceProvider.GetRequiredService<DrivingLicenseIssuanceSystemDbContext>();
        
        DbContext.Database.EnsureCreated();
        
        // Seed required reference data
        SeedTestDataAsync().GetAwaiter().GetResult();
    }
    
    private async Task SeedTestDataAsync()
    {
        // Add license categories if not exist
        if (!await DbContext.LicenseCategories.AnyAsync())
        {
            var categories = new[]
            {
                new DrivingLicenseIssuanceSystem.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = DrivingLicenseIssuanceSystem.Domain.Enums.LicenseCategoryCode.A, NameAr = "دراجة نارية", NameEn = "Motorcycle", MinimumAge = 16, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = DrivingLicenseIssuanceSystem.Domain.Enums.LicenseCategoryCode.B, NameAr = "سيارة خاصة", NameEn = "Private Car", MinimumAge = 18, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = DrivingLicenseIssuanceSystem.Domain.Enums.LicenseCategoryCode.C, NameAr = "شاحنة خفيفة", NameEn = "Light Truck", MinimumAge = 21, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = DrivingLicenseIssuanceSystem.Domain.Enums.LicenseCategoryCode.D, NameAr = "شاحنة ثقيلة", NameEn = "Heavy Truck", MinimumAge = 21, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = DrivingLicenseIssuanceSystem.Domain.Enums.LicenseCategoryCode.E, NameAr = "حافلة", NameEn = "Bus", MinimumAge = 21, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = DrivingLicenseIssuanceSystem.Domain.Enums.LicenseCategoryCode.F, NameAr = "TRACTOR", NameEn = "Tractor", MinimumAge = 18, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
            };
            DbContext.LicenseCategories.AddRange(categories);
            await DbContext.SaveChangesAsync();
        }
        
        // Add system settings if not exist
        if (!await DbContext.SystemSettings.AnyAsync())
        {
            var settings = new[]
            {
                new DrivingLicenseIssuanceSystem.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_A", SettingValue = "16", Description = "Minimum age for category A", CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_B", SettingValue = "18", Description = "Minimum age for category B", CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_C", SettingValue = "21", Description = "Minimum age for category C", CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_D", SettingValue = "21", Description = "Minimum age for category D", CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_E", SettingValue = "21", Description = "Minimum age for category E", CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_F", SettingValue = "18", Description = "Minimum age for category F", CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.SystemSetting { SettingKey = "MAX_THEORY_ATTEMPTS", SettingValue = "3", Description = "Max theory test attempts", CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.SystemSetting { SettingKey = "MAX_PRACTICAL_ATTEMPTS", SettingValue = "3", Description = "Max practical test attempts", CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.SystemSetting { SettingKey = "LICENSE_VALIDITY_YEARS", SettingValue = "10", Description = "License validity years", CreatedAt = DateTime.UtcNow },
                new DrivingLicenseIssuanceSystem.Domain.Entities.SystemSetting { SettingKey = "APPLICATION_FEE", SettingValue = "100", Description = "Application fee", CreatedAt = DateTime.UtcNow },
            };
            DbContext.SystemSettings.AddRange(settings);
            await DbContext.SaveChangesAsync();
        }
    }

    protected async Task AuthenticateAsUserAsync(Guid userId, string role = "Applicant")
    {
        // This is a simplified auth helper. In a real scenario, 
        // it would generate a real JWT token.
        // For integration tests, we can use a test-specific auth handler or a mock token.
        
        // Here we assume the API has a test endpoint to get a token or we mock the identity
        // Since we don't have a mock token generator here, we'll implement a basic one
        // or use a fixed token that the Test Auth Handler recognizes.
        
        var token = "test-token-" + userId + "-" + role;
        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

protected async Task<HttpResponseMessage> PostAsync(string url, object data)
    {
        var content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
        return await Client.PostAsync(url, content);
    }

    protected async Task<T> PostAsJsonAsync<T>(string url, object data)
    {
        var content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
        var response = await Client.PostAsync(url, content);
        var responseString = await response.Content.ReadAsStringAsync();
        
        // Log response for debugging
        Console.WriteLine($"POST {url} => {(int)response.StatusCode}: {responseString}");
        
        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Response status code does not indicate success: {(int)response.StatusCode} ({response.ReasonPhrase}). Response: {responseString}");
        }
        
        return JsonSerializer.Deserialize<T>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
    }

    protected async Task<HttpResponseMessage> PatchAsync(string url, object data)
    {
        var content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
        return await Client.PatchAsync(url, content);
    }

    protected async Task<T> PatchAsJsonAsync<T>(string url, object data)
    {
        var content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
        var response = await Client.PatchAsync(url, content);
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
    }

    protected async Task<HttpResponseMessage> GetAsync(string url)
    {
        return await Client.GetAsync(url);
    }

    protected async Task<T> GetAsJsonAsync<T>(string url)
    {
        var response = await Client.GetAsync(url);
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
    }

    protected async Task<HttpResponseMessage> PatchAsJsonAsync(string url, object data)
    {
        var content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
        return await Client.PatchAsync(url, content);
    }

    protected async Task CreateMockUserWithRoleAsync(Guid userId, string role = "Applicant")
    {
        var user = new User
        {
            Id = userId,
            Email = $"test-{userId}@example.com",
            FullNameAr = $"Test User {userId}",
            FullNameEn = $"Test User {userId}",
            NationalId = "1234567890",
            Role = role switch
            {
                "Admin" => UserRole.Admin,
                "Receptionist" => UserRole.Receptionist,
                "Doctor" => UserRole.Doctor,
                "Examiner" => UserRole.Examiner,
                "Manager" => UserRole.Manager,
                "Security" => UserRole.Security,
                _ => UserRole.Applicant
            },
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        DbContext.Users.Add(user);
        await DbContext.SaveChangesAsync();
    }

    public void Dispose()
    {
        DbContext.Database.EnsureDeleted();
        Scope.Dispose();
        Client.Dispose();
        Factory.Dispose();
    }
}
