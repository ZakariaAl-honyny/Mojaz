using System.Threading.Tasks;
using Mojaz.Domain.Entities;

namespace Mojaz.Application.Interfaces.Repositories
{
    public interface IEmailLogRepository
    {
        Task<EmailLog?> FindDuplicateAsync(string recipientEmail, string templateName, string referenceId);
    }
}
