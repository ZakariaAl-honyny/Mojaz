using System.Threading.Tasks;
using Mojaz.Domain.Entities;

namespace Mojaz.Application.Interfaces.Infrastructure
{
    public interface ILicensePdfGenerator
    {
        Task<byte[]> GenerateLicensePdfAsync(License license, User holder, LicenseCategory category);
    }
}
