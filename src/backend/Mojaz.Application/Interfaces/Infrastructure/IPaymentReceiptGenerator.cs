using DrivingLicenseIssuanceSystem.Application.DTOs.Payment;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Infrastructure
{
    public interface IPaymentReceiptGenerator
    {
        Task<byte[]> GenerateReceiptAsync(PaymentDto payment);
    }
}