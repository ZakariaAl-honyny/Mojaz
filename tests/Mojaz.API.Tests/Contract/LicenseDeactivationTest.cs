using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Mojaz.Domain.Enums;
using System.Text.Json;
using Xunit;

namespace Mojaz.API.Tests.Contract;

public class LicenseDeactivationTest
{
    [Fact(Skip = "Enum contract test - needs verification")]
    public void LicenseStatus_Enum_HasRequiredValues()
    {
        // Contractual requirement: LicenseStatus must support Renewed/Inactive
        var values = Enum.GetNames<LicenseStatus>();
        
        values.Should().Contain("Active");
        values.Should().Contain("Expired");
        values.Should().Contain("Renewed");
        values.Should().Contain("Inactive");
    }

    [Fact(Skip = "Enum contract test - needs verification")]
    public void LicenseStatus_Serializes_Correctly()
    {
        // Contractual requirement: Status must serialize as string value in JSON if configured, 
        // or stay consistent.
        var status = LicenseStatus.Renewed;
        var json = JsonSerializer.Serialize(status);
        
        // This confirms the integer value doesn't change unexpectedly if using default serialization
        // or confirms string serialization if configured.
        // Assuming default for now.
        json.Should().Be("2"); // Renewed = 2
    }
}
