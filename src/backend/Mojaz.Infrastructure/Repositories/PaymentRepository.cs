using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Domain.Entities;
using Mojaz.Infrastructure.Persistence.Repositories;

namespace Mojaz.Infrastructure.Persistence.Repositories
{
    public class PaymentRepository : Repository<PaymentTransaction>, IPaymentRepository
    {
        public PaymentRepository(MojazDbContext context) : base(context)
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

        public async Task<PaymentTransaction> UpdateAsync(PaymentTransaction payment)
        {
            base.Update(payment);
            return payment;
        }

        public async Task<IReadOnlyList<PaymentTransaction>> GetByApplicationIdAsync(Guid applicationId)
        {
            return await FindAsync(p => p.ApplicationId == applicationId && !p.IsDeleted);
        }
    }
}