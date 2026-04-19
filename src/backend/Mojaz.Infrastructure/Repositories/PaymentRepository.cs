using DrivingLicenseIssuanceSystem.Application.Interfaces.Repositories;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Infrastructure.Persistence.Repositories;

namespace DrivingLicenseIssuanceSystem.Infrastructure.Persistence.Repositories
{
    public class PaymentRepository : Repository<PaymentTransaction>, IPaymentRepository
    {
        public PaymentRepository(DrivingLicenseIssuanceSystemDbContext context) : base(context)
        {
        }

        public Task<PaymentTransaction?> GetByIdAsync(Guid id)
        {
            return base.GetByIdAsync(id);
        }

        public async Task<PaymentTransaction> AddAsync(PaymentTransaction payment)
        {
            await base.AddAsync(payment);
            return payment;
        }

        public Task<PaymentTransaction> UpdateAsync(PaymentTransaction payment)
        {
            base.Update(payment);
            return Task.FromResult(payment);
        }

        public async Task<IReadOnlyList<PaymentTransaction>> GetByApplicationIdAsync(Guid applicationId)
        {
            return await FindAsync(p => p.ApplicationId == applicationId && !p.IsDeleted);
        }
    }
}