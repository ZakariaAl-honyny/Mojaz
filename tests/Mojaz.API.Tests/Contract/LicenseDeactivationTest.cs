using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using System.Text.Json;
using Xunit;

namespace DrivingLicenseIssuanceSystem.API.Tests.Contract;

public class LicenseDeactivationTest
{
    [Fact]
    public void LicenseStatus_Enum_HasRequiredValues()
    {
        // Contractual requirement: LicenseStatus must support Renewed/Superseded
        var values = Enum.GetNames<LicenseStatus>();
        
        values.Should().Contain("Active");
        values.Should().Contain("Expired");
        values.Should().Contain("Renewed");
        values.Should().Contain("Superseded");
    }

    [Fact]
    public void LicenseStatus_Serializes_Correctly()
    {
        // Contractual requirement: Status must serialize as string value in JSON if configured, 
        // or stay consistent.
        var status = LicenseStatus.Renewed;
        var json = JsonSerializer.Serialize(status);
        
        // This confirms the integer value is consistent
        // Renewed = 5 (based on enum definition)
        json.Should().Be("5");
    }
}
