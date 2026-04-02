namespace Mojaz.Shared.Exceptions;

/// <summary>
/// Exception thrown when authentication fails.
/// </summary>
public class UnauthorizedException : MojazException
{
    public UnauthorizedException(string message = "Unauthorized")
        : base(message, 401)
    {
    }
}
