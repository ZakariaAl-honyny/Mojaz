using System.Threading.Tasks;
using DrivingLicenseIssuanceSystem.Domain.Entities;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Infrastructure
{
    public interface ILicensePdfGenerator
    {
        Task<byte[]> GenerateLicensePdfAsync(License license, User holder, LicenseCategory category);
    }
}
