using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface ISmsService
{
    Task SendAsync(string phoneNumber, string message);
}
