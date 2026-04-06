using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Mojaz.Application.DTOs.Auth;
using Mojaz.Domain.Enums;
using Xunit;

namespace Mojaz.API.Tests.Auth;

public class Registration_RateLimit_Tests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public Registration_RateLimit_Tests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Registration_ExceedingLimit_ReturnsTooManyRequests()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new RegisterRequest
        {
            FullName = "Rate Limit Tester",
            Email = "ratelimit@test.com",
            Password = "Password123!",
            Method = RegistrationMethod.Email,
            TermsAccepted = true
        };

        // Act & Assert
        // Send 5 requests (should be OK if they are 400 or something, 
        // but rate limiter counts them regardless of outcome in FixedWindow)
        for (int i = 0; i < 5; i++)
        {
            await client.PostAsJsonAsync("/api/v1/auth/register", request);
        }

        // 6th request should be rate limited
        var response = await client.PostAsJsonAsync("/api/v1/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.TooManyRequests);
    }
}
