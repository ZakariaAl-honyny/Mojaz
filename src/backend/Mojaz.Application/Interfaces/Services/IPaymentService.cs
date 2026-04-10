using Mojaz.Application.DTOs.Payments;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IPaymentService
{
    Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(PaymentInitiateRequest request);
    Task<ApiResponse<PaymentDto>> ConfirmPaymentAsync(PaymentConfirmRequest request);
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId);
    Task<ApiResponse<bool>> VerifyPaymentAsync(Guid paymentId);
}
