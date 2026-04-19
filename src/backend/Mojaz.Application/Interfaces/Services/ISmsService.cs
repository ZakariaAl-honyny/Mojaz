using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Services;

public interface ISmsService
{
    Task SendAsync(string phoneNumber, string message);
}
