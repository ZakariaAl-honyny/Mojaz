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
    
    // For Employee/Manager - get all payments (also works for Applicants with pagination)
    Task<ApiResponse<PagedResult<PaymentDto>>> GetAllPaymentsAsync(int page, int pageSize, string? status, string? search, Guid? userId = null, string? role = null);
    
    Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(Guid applicationId, PaymentInitiateRequest request, Guid userId, string role);
    Task<ApiResponse<PaymentDto>> InitiatePaymentByNumberAsync(string applicationNumber, InitiatePaymentRequest request, Guid userId, string role);
    
    // Process payment by ID (simulate success)
    Task<ApiResponse<PaymentDto>> ProcessPaymentAsync(Guid paymentId, Guid userId, string role);
    
    Task<ApiResponse<PaymentDto>> ProcessCallbackAsync(PaymentCallback request);
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role);
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationNumberAsync(string applicationNumber, Guid userId, string role);
    Task<ApiResponse<PaymentDto>> GetByIdAsync(Guid paymentId, Guid userId, string role);
    Task<ApiResponse<bool>> VerifyPaymentAsync(Guid paymentId);
    Task<ApiResponse<PaymentDto>> ConfirmPaymentAsync(PaymentConfirmRequest request, Guid userId, string role);
    Task<ApiResponse<PaymentReceiptResponse>> GetReceiptAsync(Guid paymentId, Guid userId, string role);
    
    // Get pending payment for a specific application
    Task<ApiResponse<PaymentDto>> GetPendingPaymentForApplicationAsync(Guid applicationId, Guid userId, string role);
}