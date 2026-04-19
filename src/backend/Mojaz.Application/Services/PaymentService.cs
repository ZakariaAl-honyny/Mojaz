using DrivingLicenseIssuanceSystem.Application.DTOs.Payment;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Services;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Domain.Interfaces;
using DrivingLicenseIssuanceSystem.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using ApplicationEntity = DrivingLicenseIssuanceSystem.Domain.Entities.Application;
using PaymentEntity = DrivingLicenseIssuanceSystem.Domain.Entities.PaymentTransaction;

namespace DrivingLicenseIssuanceSystem.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IRepository<PaymentTransaction> _paymentRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;

    public PaymentService(
        IRepository<PaymentTransaction> paymentRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService)
    {
        _paymentRepository = paymentRepository;
        _applicationRepository = applicationRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
    }

    public async Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(PaymentInitiateRequest request, Guid userId)
    {
        // For simplicity, we're not validating the application exists in this example
        // In a real implementation, you would validate the application belongs to the user
        // and get the fee amount from the fee service
        
        // TODO: Get actual amount from fee service based on request.FeeType and request.ApplicationId
        // For now, using a placeholder amount
        decimal amount = 100.00m; // Placeholder
        
        var payment = new PaymentTransaction
        {
            ApplicationId = request.ApplicationId,
            Amount = amount,
            Status = PaymentStatus.Pending,
            // PaymentMethod doesn't exist in PaymentTransaction, commenting out for now
            // PaymentMethod = request.PaymentMethod,
            TransactionReference = $"TXN_{Guid.NewGuid()}",
            PaidAt = null
        };

        await _paymentRepository.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<PaymentDto>.Ok(new PaymentDto 
        { 
            Id = payment.Id, 
            ApplicationId = payment.ApplicationId,
            Amount = payment.Amount,
            Status = payment.Status,
            TransactionReference = payment.TransactionReference ?? string.Empty,
            CreatedAt = payment.CreatedAt
        });
    }

    public async Task<ApiResponse<PaymentDto>> ConfirmPaymentAsync(PaymentConfirmRequest request, Guid userId)
    {
        var payment = await _paymentRepository.GetByIdAsync(request.PaymentId);
        if (payment == null) return ApiResponse<PaymentDto>.Fail(404, "Transaction not found.");

        payment.Status = request.IsSuccessful ? PaymentStatus.Paid : PaymentStatus.Failed;
        payment.PaidAt = request.IsSuccessful ? DateTime.UtcNow : null;
        
        if (!request.IsSuccessful)
        {
            payment.FailureReason = "Payment was declined or failed.";
        }
        
        _paymentRepository.Update(payment);

        if (payment.Status == PaymentStatus.Paid)
        {
            var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
            if (application != null && application.Status == ApplicationStatus.Submitted)
            {
                application.Status = ApplicationStatus.InReview;
                _applicationRepository.Update(application);
                
                await _notificationService.SendAsync(new NotificationRequest
                {
                    UserId = application.ApplicantId,
                    ApplicationId = application.Id,
                    EventType = NotificationEventType.PaymentSuccess,
                    TitleAr = "تم استلام الدفعة",
                    TitleEn = "Payment Success",
                    MessageAr = $"تم استلام مبلغ {payment.Amount} بنجاح. طلبك الآن قيد المراجعة.",
                    MessageEn = $"Payment of {payment.Amount} received. Your application is now in review."
                });
            }
        }
        
        await _unitOfWork.SaveChangesAsync();
        
        return ApiResponse<PaymentDto>.Ok(new PaymentDto 
        { 
            Id = payment.Id, 
            ApplicationId = payment.ApplicationId,
            Amount = payment.Amount,
            Status = payment.Status,
            TransactionReference = payment.TransactionReference ?? string.Empty,
            CreatedAt = payment.CreatedAt
        });
    }

    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId)
    {
        var payments = await _paymentRepository.FindAsync(p => p.ApplicationId == applicationId);
        return ApiResponse<IEnumerable<PaymentDto>>.Ok(payments.Select(p => new PaymentDto { 
        Id = p.Id, 
        ApplicationId = p.ApplicationId,
        Amount = p.Amount,
        Status = p.Status,
        Currency = p.Currency,
        TransactionReference = p.TransactionReference ?? string.Empty,
        ReceiptNumber = p.ReceiptNumber,
        PaidAt = p.PaidAt,
        CreatedAt = p.CreatedAt,
        Success = p.Status == PaymentStatus.Paid
    }));
    }

    public async Task<ApiResponse<bool>> VerifyPaymentAsync(Guid paymentId)
    {
        return ApiResponse<bool>.Ok(true);
    }
    
    public async Task<ApiResponse<PagedResult<PaymentDto>>> GetPaymentsAsync(PaymentQuery query, Guid userId, string role)
    {
        // For simplicity, we're not implementing role-based filtering in this example
        // In a real implementation, you would filter based on user role and permissions
        
        Expression<Func<PaymentTransaction, bool>> predicate = p => !p.IsDeleted;
        
        if (query.ApplicationId.HasValue)
            predicate = predicate.And(p => p.ApplicationId == query.ApplicationId.Value);
            
        if (query.Status.HasValue)
            predicate = predicate.And(p => p.Status == query.Status.Value);
        
        var payments = await _paymentRepository.FindAsync(predicate);
        var total = payments.Count;
        
        // Apply pagination
        var pagedPayments = payments
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToList();
        
        var result = new PagedResult<PaymentDto>
        {
            Items = pagedPayments.Select(p => new PaymentDto 
            {
                Id = p.Id,
                ApplicationId = p.ApplicationId,
                Amount = p.Amount,
                Status = p.Status,
                TransactionReference = p.TransactionReference ?? string.Empty,
                CreatedAt = p.CreatedAt
            }).ToList(),
            TotalCount = total,
            Page = query.Page,
            PageSize = query.PageSize
        };
        
        return ApiResponse<PagedResult<PaymentDto>>.Ok(result);
    }
    
    public async Task<byte[]> GenerateReceiptPdfAsync(Guid paymentId, Guid userId, string role)
    {
        // In a real implementation, this would generate a PDF receipt
        // For now, returning a placeholder byte array
        return new byte[] { 0x20, 0x20, 0x20, 0x20 }; // 4 spaces as placeholder
    }
    
    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role)
    {
        // For simplicity, we're not validating user ownership in this example
        // In a real implementation, you would validate the application belongs to the user
        
        var payments = await _paymentRepository.FindAsync(p => p.ApplicationId == applicationId && !p.IsDeleted);
        return ApiResponse<IEnumerable<PaymentDto>>.Ok(payments.Select(p => new PaymentDto 
        {
            Id = p.Id,
            ApplicationId = p.ApplicationId,
            Amount = p.Amount,
            Status = p.Status,
            TransactionReference = p.TransactionReference ?? string.Empty,
            CreatedAt = p.CreatedAt
        }));
    }
}
