using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.DTOs.Email;
using Mojaz.Application.DTOs.Email.Templates;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Models;
using Hangfire;
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
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;
    private readonly IBackgroundJobClient _backgroundJobClient;

    public PaymentService(
        IRepository<Payment> paymentRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<User> userRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        IEmailService emailService,
        IBackgroundJobClient backgroundJobClient)
    {
        _paymentRepository = paymentRepository;
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _emailService = emailService;
        _backgroundJobClient = backgroundJobClient;
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

                // Send Receipt Email (Hangfire)
                var user = await _userRepository.GetByIdAsync(application.ApplicantId);
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    _backgroundJobClient.Enqueue(() => _emailService.SendTemplatedAsync(new TemplatedEmailRequest
                    {
                        RecipientEmail = user.Email,
                        TemplateName = "payment-confirmed",
                        TemplateData = new PaymentConfirmedEmailData
                        {
                            Amount = payment.Amount.ToString("F2"),
                            Currency = "SAR",
                            TransactionReference = payment.TransactionReference ?? string.Empty,
                            FeeTypeAr = "رسوم الطلب", // Should be dynamic
                            FeeTypeEn = "Application Fee",
                            PaymentDateAr = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            PaymentDateEn = DateTime.UtcNow.ToString("yyyy-MM-dd")
                        },
                        ReferenceId = payment.Id.ToString()
                    }));
                }
            }
        }
        
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<PaymentDto>.Ok(new PaymentDto { Id = payment.Id, TransactionId = payment.TransactionReference, Status = payment.Status, Success = request.Success });
    }

    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId)
    {
        var payments = await _paymentRepository.FindAsync(p => p.ApplicationId == applicationId);
        return ApiResponse<IEnumerable<PaymentDto>>.Ok(payments.Select(p => new PaymentDto { Id = p.Id, Amount = p.Amount, Status = p.Status, TransactionId = p.TransactionReference }));
    }

    public async Task<ApiResponse<bool>> VerifyPaymentAsync(Guid paymentId)
    {
        return ApiResponse<bool>.Ok(true);
    }
}
