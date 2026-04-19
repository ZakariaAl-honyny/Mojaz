using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Repositories;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Infrastructure.Persistence;
using DrivingLicenseIssuanceSystem.Infrastructure.Settings;

namespace DrivingLicenseIssuanceSystem.Infrastructure.Repositories
{
    public class EmailLogRepository : IEmailLogRepository
    {
        private readonly DrivingLicenseIssuanceSystemDbContext _dbContext;
        private readonly EmailDedupSettings _dedupSettings;
        public EmailLogRepository(DrivingLicenseIssuanceSystemDbContext dbContext, IOptions<EmailDedupSettings> dedupOptions)
        {
            _dbContext = dbContext;
            _dedupSettings = dedupOptions.Value;
        }

        public async Task<EmailLog?> FindDuplicateAsync(string recipientEmail, string templateName, string referenceId)
        {
            var dedupWindowSeconds = _dedupSettings.DedupWindowSeconds;
            var windowStart = DateTime.UtcNow.AddSeconds(-dedupWindowSeconds);
            return await _dbContext.EmailLogs
                .Where(e => e.RecipientEmail == recipientEmail && e.TemplateName == templateName && e.ReferenceId == referenceId && e.SentAt >= windowStart)
                .OrderByDescending(e => e.SentAt)
                .FirstOrDefaultAsync();
        }
    }
}
