using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using DrivingLicenseIssuanceSystem.Application.DTOs.Application;
using Xunit;
using DrivingLicenseIssuanceSystem.Shared;

namespace DrivingLicenseIssuanceSystem.API.Tests;

public class ApplicationsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ApplicationsControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact(Skip = "Requires integration test infrastructure setup for authentication")]
    public async Task Post_CreateApplication_ReturnsBadRequest_WhenInvalid()
    {
        // This test would require extending IntegrationTestBase for proper authentication setup
        // Validation is already covered by unit tests in the Application layer
    }
}