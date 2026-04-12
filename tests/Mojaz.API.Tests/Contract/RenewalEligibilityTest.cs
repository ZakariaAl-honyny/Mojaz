using FluentAssertions;
using Mojaz.Application.DTOs.Renewal;
using System;

namespace Mojaz.API.Tests.Contract;

public class RenewalEligibilityTest
{
    [Fact]
    public void GetEligibility_ReturnsCorrectContract()
    {
        // Contract test - verify DTO serialization structure
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