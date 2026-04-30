using System.Threading.Tasks;
using Mojaz.Domain.Entities;

namespace Mojaz.Application.Interfaces.Repositories
{
    public interface IPaymentRepository
    {
        Task<PaymentTransaction?> GetByIdAsync(int id);
        Task<PaymentTransaction> AddAsync(PaymentTransaction payment);
        Task<PaymentTransaction> UpdateAsync(PaymentTransaction payment);
        Task<IReadOnlyList<PaymentTransaction>> GetByApplicationIdAsync(int applicationId);
    }
}