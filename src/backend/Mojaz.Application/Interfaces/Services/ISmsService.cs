using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface ISmsService
{
    Task SendSmsAsync(string phoneNumber, string message);
}
