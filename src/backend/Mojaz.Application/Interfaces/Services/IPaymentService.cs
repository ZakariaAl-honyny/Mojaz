using Mojaz.Application.DTOs.Payment;
using Mojaz.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IPaymentService
{
    // For Applicant - get current user's payments
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetMyPaymentsAsync(int userId);
    
    // For Employee/Manager - get all payments (also works for Applicants with pagination)
    Task<ApiResponse<PagedResult<PaymentDto>>> GetAllPaymentsAsync(int page, int pageSize, string? status, string? search, int? userId = null, string? role = null);
    
    Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(int applicationId, PaymentInitiateRequest request, int userId, string role);
    Task<ApiResponse<PaymentDto>> InitiatePaymentByNumberAsync(string applicationNumber, InitiatePaymentRequest request, int userId, string role);
    
    // Process payment by ID (simulate success)
    Task<ApiResponse<PaymentDto>> ProcessPaymentAsync(int paymentId, int userId, string role);
    
    Task<ApiResponse<PaymentDto>> ProcessCallbackAsync(PaymentCallback request);
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(int applicationId, int userId, string role);
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationNumberAsync(string applicationNumber, int userId, string role);
    Task<ApiResponse<PaymentDto>> GetByIdAsync(int paymentId, int userId, string role);
    Task<ApiResponse<bool>> VerifyPaymentAsync(int paymentId);
    Task<ApiResponse<PaymentDto>> ConfirmPaymentAsync(PaymentConfirmRequest request, int userId, string role);
    Task<ApiResponse<PaymentReceiptResponse>> GetReceiptAsync(int paymentId, int userId, string role);
    
    // Get pending payment for a specific application
    Task<ApiResponse<PaymentDto>> GetPendingPaymentForApplicationAsync(int applicationId, int userId, string role);
}