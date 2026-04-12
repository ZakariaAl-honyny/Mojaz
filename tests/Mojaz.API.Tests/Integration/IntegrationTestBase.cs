using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Mojaz.API;
using Mojaz.Infrastructure.Persistence;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Hangfire;

namespace Mojaz.API.Tests.Integration;

public class IntegrationTestBase : IDisposable
{
    protected readonly WebApplicationFactory<Program> Factory;
    protected readonly HttpClient Client;
    protected readonly IServiceScope Scope;
    protected readonly MojazDbContext DbContext;

    public IntegrationTestBase()
    {
        Factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove the existing DbContext registration
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<MojazDbContext>));
                if (descriptor != null) services.Remove(descriptor);

                // Add In-Memory Database for testing
                services.AddDbContext<MojazDbContext>(options =>
                {
                    options.UseInMemoryDatabase("IntegrationTestDb");
                });

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

                // Update Authorization to use the TestScheme
                services.AddAuthorization(options =>
                {
                    options.DefaultPolicy = new Microsoft.AspNetCore.Authorization.AuthorizationPolicyBuilder()
                        .AddAuthenticationSchemes("TestScheme")
                        .RequireAuthenticatedUser()
                        .Build();
                });

                // Fix Hangfire - use in-memory storage for tests
                services.AddHangfire(config => config.UseInMemoryStorage());
            });
        });

        Client = Factory.CreateClient();
        Scope = Factory.Services.CreateScope();
        DbContext = Scope.ServiceProvider.GetRequiredService<MojazDbContext>();
        
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
                new Mojaz.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = Mojaz.Domain.Enums.LicenseCategoryCode.A, NameAr = "دراجة نارية", NameEn = "Motorcycle", MinimumAge = 16, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = Mojaz.Domain.Enums.LicenseCategoryCode.B, NameAr = "سيارة خاصة", NameEn = "Private Car", MinimumAge = 18, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = Mojaz.Domain.Enums.LicenseCategoryCode.C, NameAr = "شاحنة خفيفة", NameEn = "Light Truck", MinimumAge = 21, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = Mojaz.Domain.Enums.LicenseCategoryCode.D, NameAr = "شاحنة ثقيلة", NameEn = "Heavy Truck", MinimumAge = 21, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = Mojaz.Domain.Enums.LicenseCategoryCode.E, NameAr = "حافلة", NameEn = "Bus", MinimumAge = 21, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.LicenseCategory { Id = Guid.NewGuid(), Code = Mojaz.Domain.Enums.LicenseCategoryCode.F, NameAr = "TRACTOR", NameEn = "Tractor", MinimumAge = 18, ValidityYears = 10, IsActive = true, CreatedAt = DateTime.UtcNow },
            };
            DbContext.LicenseCategories.AddRange(categories);
            await DbContext.SaveChangesAsync();
        }
        
        // Add system settings if not exist
        if (!await DbContext.SystemSettings.AnyAsync())
        {
            var settings = new[]
            {
                new Mojaz.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_A", SettingValue = "16", Description = "Minimum age for category A", CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_B", SettingValue = "18", Description = "Minimum age for category B", CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_C", SettingValue = "21", Description = "Minimum age for category C", CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_D", SettingValue = "21", Description = "Minimum age for category D", CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_E", SettingValue = "21", Description = "Minimum age for category E", CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.SystemSetting { SettingKey = "MIN_AGE_CATEGORY_F", SettingValue = "18", Description = "Minimum age for category F", CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.SystemSetting { SettingKey = "MAX_THEORY_ATTEMPTS", SettingValue = "3", Description = "Max theory test attempts", CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.SystemSetting { SettingKey = "MAX_PRACTICAL_ATTEMPTS", SettingValue = "3", Description = "Max practical test attempts", CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.SystemSetting { SettingKey = "LICENSE_VALIDITY_YEARS", SettingValue = "10", Description = "License validity years", CreatedAt = DateTime.UtcNow },
                new Mojaz.Domain.Entities.SystemSetting { SettingKey = "APPLICATION_FEE", SettingValue = "100", Description = "Application fee", CreatedAt = DateTime.UtcNow },
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

    protected async Task<T> PostAsJsonAsync<T>(string url, object data)
    {
        var content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
        var response = await Client.PostAsync(url, content);
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
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

    public void Dispose()
    {
        DbContext.Database.EnsureDeleted();
        Scope.Dispose();
        Client.Dispose();
        Factory.Dispose();
    }
}
