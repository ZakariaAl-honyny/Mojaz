using System;

namespace DrivingLicenseIssuanceSystem.Shared.Exceptions;

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message = "Unauthorized access attempt.") : base(message)
    {
    }
}
