using DrivingLicenseIssuanceSystem.Domain.Enums;

namespace DrivingLicenseIssuanceSystem.Application.DTOs.Auth;

public class VerifyOtpRequest
{
    public string Destination { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public OtpPurpose Purpose { get; set; }
}

public class ResendOtpRequest
{
    public string Destination { get; set; } = string.Empty;
    public OtpPurpose Purpose { get; set; }
}

public class OtpResponseDto
{
    public string DestinationMasked { get; set; } = string.Empty;
}
