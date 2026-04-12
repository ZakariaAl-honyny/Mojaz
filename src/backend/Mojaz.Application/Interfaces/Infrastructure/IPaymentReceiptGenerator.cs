using Mojaz.Application.DTOs.Payment;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Infrastructure
{
    public interface IPaymentReceiptGenerator
    {
        Task<byte[]> GenerateReceiptAsync(PaymentDto payment);
    }
}