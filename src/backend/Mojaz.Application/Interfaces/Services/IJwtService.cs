using System;
using System.Security.Claims;

namespace Mojaz.Application.Interfaces.Services;

public interface IJwtService
{
    string GenerateAccessToken(Guid userId, string fullName, string role);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
