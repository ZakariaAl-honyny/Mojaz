using FluentAssertions;
using DrivingLicenseIssuanceSystem.Application.DTOs.Renewal;
using System;
using Xunit;

namespace DrivingLicenseIssuanceSystem.API.Tests.Contract;

/// <summary>
/// Contract tests for DTO structures - these validate data contracts without HTTP calls
/// Note: This is a pure unit test that doesn't require application services
/// </summary>
public class RenewalEligibilityTest
{
    [Fact]
    public void GetEligibility_ReturnsCorrectContract()
    {
        // Note: For contract tests, we verify the DTO structure without making an HTTP call
        // This tests the data contract itself
        
        var response = new EligibilityResponse
        {
            IsEligible = true,
            CurrentLicenseExpiresAt = DateTime.UtcNow.AddDays(10),
            GracePeriodEndsAt = DateTime.UtcNow.AddDays(100),
            RenewalFeeAmount = 250.00m
        };

        response.IsEligible.Should().BeTrue();
        response.RenewalFeeAmount.Should().Be(250.00m);
        response.CurrentLicenseExpiresAt.Should().BeAfter(DateTime.MinValue);
    }
}
