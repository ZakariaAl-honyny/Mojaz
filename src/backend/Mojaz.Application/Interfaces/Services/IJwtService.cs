using System;
using System.Security.Claims;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Interfaces.Services;

public interface IJwtService
{
    string GenerateAccessToken(Guid userId, string fullName, AppRole role);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
