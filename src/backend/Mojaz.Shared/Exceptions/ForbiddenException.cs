namespace Mojaz.Shared.Exceptions;

/// <summary>
/// Exception thrown when user lacks permission for the action.
/// </summary>
public class ForbiddenException : MojazException
{
    public ForbiddenException(string message = "You do not have permission to perform this action")
        : base(message, 403)
    {
    }
}
