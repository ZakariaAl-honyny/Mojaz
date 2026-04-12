using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Mojaz.Application.DTOs.Application;
using Xunit;

namespace Mojaz.API.Tests;

public class ApplicationsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ApplicationsControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    //[Fact]
    //public async Task Post_CreateApplication_ReturnsBadRequest_WhenInvalid()
    //{
    //    var client = _factory.CreateClient();
    //    var request = new CreateApplicationRequest
    //    {
    //        // Missing required fields
    //    };
    //    var response = await client.PostAsJsonAsync("/api/v1/applications", request);
    //    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    //}

    [Fact]
    public async Task Post_CreateApplication_ReturnsBadRequest_WhenInvalid()
    {
        // 1. ≈‰‘«¡ «·⁄„Ì·
        var client = _factory.CreateClient();

        // 2. «· ⁄œÌ· «·ÃÊÂ—Ì: ≈⁄ÿ«¡ «·⁄„Ì· "»ÿ«ﬁ… œŒÊ·" (Token ÊÂ„Ì)
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("TestScheme");

        // 3.  ÃÂÌ“ ÿ·» ›«—€ (· Õ›Ì“ «·‹ Validation)
        var request = new CreateApplicationRequest();

        // 4. ≈—”«· «·ÿ·»
        var response = await client.PostAsJsonAsync("/api/v1/applications", request);

        // 5. «· Õﬁﬁ («·¬‰ ”Ì’· ··‹ 400 ·√‰ «·√„‰ ”„Õ ·Â »«·„—Ê—)
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }





}
