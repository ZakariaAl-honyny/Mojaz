using Mojaz.Application.DTOs.Payment;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IPaymentService
{
    // For Applicant - get current user's payments
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetMyPaymentsAsync(Guid userId);
    
    // For Employee/Manager - get all payments
    Task<ApiResponse<PagedResult<PaymentDto>>> GetAllPaymentsAsync(int page, int pageSize, string? status, string? search);
    
    Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(Guid applicationId, PaymentInitiateRequest request);
    Task<ApiResponse<PaymentDto>> InitiatePaymentByNumberAsync(string applicationNumber, InitiatePaymentRequest request);
    Task<ApiResponse<PaymentDto>> ProcessCallbackAsync(PaymentCallback request);
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId);
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationNumberAsync(string applicationNumber);
    Task<ApiResponse<PaymentDto>> GetByIdAsync(Guid paymentId);
    Task<ApiResponse<bool>> VerifyPaymentAsync(Guid paymentId);
    Task<ApiResponse<PaymentDto>> ConfirmPaymentAsync(PaymentConfirmRequest request);
    Task<ApiResponse<PaymentReceiptResponse>> GetReceiptAsync(Guid paymentId);
}