using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Infrastructure
{
    public interface ISmsService
    {
        Task SendAsync(string to, string message);
    }
}
