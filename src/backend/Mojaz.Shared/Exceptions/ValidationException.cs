using System;
using System.Collections.Generic;

namespace Mojaz.Shared.Exceptions;

public class ValidationException : Exception
{
    public ValidationException(IEnumerable<string> errors)
        : base("One or more validation failures have occurred.")
    {
        Errors = new List<string>(errors);
    }

    public List<string> Errors { get; }
}
