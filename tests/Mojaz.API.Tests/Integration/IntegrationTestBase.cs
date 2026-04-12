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
                
                // Also remove any other authentication-related registrations if they exist
                // This is a blunt approach, but for integration tests, we want total control.

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
