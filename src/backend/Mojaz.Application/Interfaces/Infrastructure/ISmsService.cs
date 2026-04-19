using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Infrastructure
{
    public interface ISmsService
    {
        Task SendAsync(string to, string message);
    }
}
