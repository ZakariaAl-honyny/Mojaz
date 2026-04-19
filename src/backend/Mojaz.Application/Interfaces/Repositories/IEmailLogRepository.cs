using System.Threading.Tasks;
using DrivingLicenseIssuanceSystem.Domain.Entities;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Repositories
{
    public interface IEmailLogRepository
    {
        Task<EmailLog?> FindDuplicateAsync(string recipientEmail, string templateName, string referenceId);
    }
}
