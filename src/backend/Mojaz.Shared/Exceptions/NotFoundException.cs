using System;

namespace DrivingLicenseIssuanceSystem.Shared.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string entityName, object id)
        : base($"{entityName} ({id}) was not found.")
    {
    }
}
