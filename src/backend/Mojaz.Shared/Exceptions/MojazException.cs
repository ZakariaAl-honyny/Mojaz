namespace DrivingLicenseIssuanceSystem.Shared.Exceptions;

/// <summary>
/// Base exception for DrivingLicenseIssuanceSystem application.
/// </summary>
public class DrivingLicenseIssuanceSystemException : Exception
{
    public int StatusCode { get; }

    public DrivingLicenseIssuanceSystemException(string message, int statusCode = 500) : base(message)
    {
        StatusCode = statusCode;
    }

    public DrivingLicenseIssuanceSystemException(string message, Exception innerException, int statusCode = 500)
        : base(message, innerException)
    {
        StatusCode = statusCode;
    }
}
