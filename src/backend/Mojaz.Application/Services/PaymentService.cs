using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IRepository<Payment> _paymentRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;

    public PaymentService(
        IRepository<Payment> paymentRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService)
    {
        _paymentRepository = paymentRepository;
        _applicationRepository = applicationRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
    }

    public async Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(Guid applicationId, InitiatePaymentRequest request)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<PaymentDto>.Fail(404, "Application not found.");

        var payment = new Payment
        {
            ApplicationId = applicationId,
            Amount = request.Amount,
            Status = PaymentStatus.Pending,
            PaymentMethod = request.PaymentMethod,
            TransactionReference = $"TXN_{Guid.NewGuid()}",
            PaidAt = null
        };

        await _paymentRepository.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<PaymentDto>.Ok(new PaymentDto { Id = payment.Id, TransactionId = payment.TransactionReference, RedirectUrl = "/payment/gate" });
    }

    public async Task<ApiResponse<PaymentDto>> ProcessCallbackAsync(PaymentCallback request)
    {
        var payments = await _paymentRepository.FindAsync(p => p.TransactionReference == request.TransactionId);
        var payment = payments.FirstOrDefault();
        if (payment == null) return ApiResponse<PaymentDto>.Fail(404, "Transaction not found.");

        payment.Status = request.Success ? PaymentStatus.Completed : PaymentStatus.Failed;
        payment.PaidAt = request.Success ? DateTime.UtcNow : null;
        
        _paymentRepository.Update(payment);

        if (payment.Status == PaymentStatus.Completed)
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

        return ApiResponse<PaymentDto>.Ok(new PaymentDto { 
    Id = payment.Id, 
    TransactionId = payment.TransactionReference ?? string.Empty, 
    Status = payment.Status, 
    Success = request.Success 
});
    }

    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId)
    {
        var payments = await _paymentRepository.FindAsync(p => p.ApplicationId == applicationId);
        return ApiResponse<IEnumerable<PaymentDto>>.Ok(payments.Select(p => new PaymentDto { 
    Id = p.Id, 
    Amount = p.Amount, 
    Status = p.Status, 
    TransactionId = p.TransactionReference ?? string.Empty 
}));
    }

    public async Task<ApiResponse<bool>> VerifyPaymentAsync(Guid paymentId)
    {
        return ApiResponse<bool>.Ok(true);
    }
}
