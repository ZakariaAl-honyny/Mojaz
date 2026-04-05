using Mojaz.Application.DTOs.Payment;
using Mojaz.Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IPaymentService
{
    Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(Guid applicationId, InitiatePaymentRequest request);
    Task<ApiResponse<PaymentDto>> ProcessCallbackAsync(PaymentCallback callback);
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId);
    Task<ApiResponse<bool>> VerifyPaymentAsync(Guid paymentId);
}
