namespace Mojaz.Shared.Exceptions;

/// <summary>
/// Exception thrown when a requested resource is not found.
/// </summary>
public class NotFoundException : MojazException
{
    public NotFoundException(string message = "Resource not found")
        : base(message, 404)
    {
    }

    public NotFoundException(string entityName, Guid id)
        : base($"{entityName} with ID '{id}' was not found.", 404)
    {
    }
}
