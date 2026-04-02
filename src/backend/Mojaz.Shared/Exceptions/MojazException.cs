namespace Mojaz.Shared.Exceptions;

/// <summary>
/// Base exception for Mojaz application.
/// </summary>
public class MojazException : Exception
{
    public int StatusCode { get; }

    public MojazException(string message, int statusCode = 500) : base(message)
    {
        StatusCode = statusCode;
    }

    public MojazException(string message, Exception innerException, int statusCode = 500)
        : base(message, innerException)
    {
        StatusCode = statusCode;
    }
}
