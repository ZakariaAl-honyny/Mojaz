using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;

namespace DrivingLicenseIssuanceSystem.Domain.Interfaces;

public interface IOtpRepository
{
    Task<OtpCode?> GetLatestByDestinationAndPurposeAsync(string destination, OtpPurpose purpose);
    Task<List<OtpCode>> GetRecentByDestinationAndPurposeAsync(string destination, OtpPurpose purpose, int withinMinutes);
    Task<int> CountResendsLastHourAsync(string destination, OtpPurpose purpose);
    Task AddAsync(OtpCode otpCode);
    Task UpdateAsync(OtpCode otpCode);
    Task InvalidateUnusedAsync(string destination, OtpPurpose purpose);
}
