using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace Mojaz.API.Tests.Integration;

public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Task.FromResult(AuthenticateResult.Fail("Missing Authorization Header"));
        }

        var token = authHeader.Substring("Bearer ".Length);
        
        // Support format: test-token-{userId}-{role}
        // Or: test-token-{guid}-{role}
        if (!token.StartsWith("test-token-"))
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid Test Token"));
        }

        // Extract userId and role from token
        // Format: test-token-{userId}-{role}
        var remaining = token.Substring("test-token-".Length);
        
        // Find the last hyphen to separate role from userId
        var lastHyphenIndex = remaining.LastIndexOf('-');
        if (lastHyphenIndex <= 0)
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid Test Token Format"));
        }

        var role = remaining.Substring(lastHyphenIndex + 1);
        var userId = remaining.Substring(0, lastHyphenIndex);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Role, role),
            new Claim("UserId", userId)
        };

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
