using Mojaz.Application.DTOs.Payment;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IPaymentService
{
    Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(PaymentInitiateRequest request, Guid userId);
    Task<ApiResponse<PaymentDto>> ConfirmPaymentAsync(PaymentConfirmRequest request, Guid userId);
    Task<ApiResponse<PagedResult<PaymentDto>>> GetPaymentsAsync(PaymentQuery query, Guid userId, string role);
    Task<byte[]> GenerateReceiptPdfAsync(Guid paymentId, Guid userId, string role);
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role);
}
