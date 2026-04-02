namespace Mojaz.Shared.Exceptions;

/// <summary>
/// Exception thrown when there's a conflict with the current state of the resource.
/// </summary>
public class ConflictException : MojazException
{
    public ConflictException(string message = "Conflict with current resource state")
        : base(message, 409)
    {
    }
}
