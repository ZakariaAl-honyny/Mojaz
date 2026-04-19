using System;
using System.Security.Claims;
using DrivingLicenseIssuanceSystem.Domain.Enums;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Services;

public interface IJwtService
{
    string GenerateAccessToken(Guid userId, string fullName, AppRole role);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
