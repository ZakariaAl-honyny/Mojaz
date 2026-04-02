namespace Mojaz.Shared.Exceptions;

/// <summary>
/// Exception thrown when validation fails.
/// </summary>
public class ValidationException : MojazException
{
    public List<string> ValidationErrors { get; }

    public ValidationException(string message = "Validation failed")
        : base(message, 400)
    {
        ValidationErrors = new List<string>();
    }

    public ValidationException(List<string> errors)
        : base("Validation failed", 400)
    {
        ValidationErrors = errors;
    }
}
