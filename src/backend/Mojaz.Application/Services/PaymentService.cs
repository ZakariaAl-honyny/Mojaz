using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IFeeStructureRepository _feeStructureRepository;
    private readonly IRepository<Mojaz.Domain.Entities.Application> _applicationRepository;
    private readonly INotificationService _notificationService;
    private readonly IPaymentReceiptGenerator _receiptGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public PaymentService(
        IPaymentRepository paymentRepository,
        IFeeStructureRepository feeStructureRepository,
        IRepository<Mojaz.Domain.Entities.Application> applicationRepository,
        INotificationService notificationService,
        IPaymentReceiptGenerator receiptGenerator,
        IUnitOfWork unitOfWork)
    {
        _paymentRepository = paymentRepository;
        _feeStructureRepository = feeStructureRepository;
        _applicationRepository = applicationRepository;
        _notificationService = notificationService;
        _receiptGenerator = receiptGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(PaymentInitiateRequest request, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(request.ApplicationId);
        if (application == null) return ApiResponse<PaymentDto>.Fail(404, "Application not found.");
        
        // Ownership check
        if (application.ApplicantId != userId) return ApiResponse<PaymentDto>.Fail(403, "You do not have permission to pay for this application.");

        var fee = await _feeStructureRepository.GetActiveFeeAsync(request.FeeType, request.LicenseCategoryId);
        if (fee == null) return ApiResponse<PaymentDto>.Fail(400, "Active fee not found for the specified fee type and license category.");

        var year = DateTime.UtcNow.Year;
        var random = Random.Shared.Next(10000000, 99999999);
        var transactionReference = $"MOJ-PAY-{year}-{random:D8}";

        var payment = new PaymentTransaction
        {
            ApplicationId = request.ApplicationId,
            FeeType = request.FeeType,
            Amount = fee.Amount,
            Status = PaymentStatus.Pending,
            TransactionReference = transactionReference,
            CreatedAt = DateTime.UtcNow
        };

        await _paymentRepository.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<PaymentDto>.Ok(MapToDto(payment));
    }

    public async Task<ApiResponse<PaymentDto>> ConfirmPaymentAsync(PaymentConfirmRequest request, Guid userId)
    {
        var payment = await _paymentRepository.GetByIdAsync(request.PaymentId);
        if (payment == null) return ApiResponse<PaymentDto>.Fail(404, "Payment not found.");

        var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
        if (application == null) return ApiResponse<PaymentDto>.Fail(404, "Associated application not found.");

        // Ownership check
        if (application.ApplicantId != userId) return ApiResponse<PaymentDto>.Fail(403, "You do not have permission to confirm this payment.");

        if (payment.Status != PaymentStatus.Pending)
            return ApiResponse<PaymentDto>.Fail(400, $"Payment cannot be processed. Current status: {payment.Status}.");

        // Simulate 2-second processing delay
        await Task.Delay(2000);

        if (request.IsSuccessful)
        {
            payment.Status = PaymentStatus.Paid;
            payment.PaidAt = DateTime.UtcNow;
            payment.ReceiptNumber = $"REC-{DateTime.UtcNow:yyyyMMdd}-{payment.Id.ToString()[..8].ToUpper()}";
            
            // Send success notification
            await _notificationService.SendAsync(new NotificationRequest
            {
                UserId = application.ApplicantId,
                ApplicationId = payment.ApplicationId,
                EventType = NotificationEventType.PaymentSuccess,
                TitleAr = "تم استلام الدفعة بنجاح",
                TitleEn = "Payment Received Successfully",
                MessageAr = $"تم تأكيد دفع مبلغ {payment.Amount:F2} ريال سعودي لخدمة {payment.FeeType}",
                MessageEn = $"Payment of {payment.Amount:F2} SAR for {payment.FeeType} has been confirmed.",
                InApp = true,
                Push = true
            });
        }
        else
        {
            payment.Status = PaymentStatus.Failed;
            payment.FailedAt = DateTime.UtcNow;
        }

        await _paymentRepository.UpdateAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<PaymentDto>.Ok(MapToDto(payment));
    }

    public async Task<ApiResponse<PagedResult<PaymentDto>>> GetPaymentsAsync(PaymentQuery query, Guid userId, string role)
    {
        var application = await _applicationRepository.GetByIdAsync(query.ApplicationId ?? Guid.Empty);
        if (application == null) return ApiResponse<PagedResult<PaymentDto>>.Fail(404, "Application not found.");

        // Security check
        if (role == "Applicant" && application.ApplicantId != userId)
            return ApiResponse<PagedResult<PaymentDto>>.Fail(403, "Access denied.");

        var payments = await _paymentRepository.GetByApplicationIdAsync(application.Id);
        
        if (query.Status.HasValue)
            payments = payments.Where(p => p.Status == query.Status.Value).ToList();

        var totalCount = payments.Count;
        var items = payments
            .OrderByDescending(p => p.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(MapToDto)
            .ToList();

        var result = new PagedResult<PaymentDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };

        return ApiResponse<PagedResult<PaymentDto>>.Ok(result);
    }

    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<IEnumerable<PaymentDto>>.Fail(404, "Application not found.");

        // Security check
        if (role == "Applicant" && application.ApplicantId != userId)
            return ApiResponse<IEnumerable<PaymentDto>>.Fail(403, "Access denied.");

        var payments = await _paymentRepository.GetByApplicationIdAsync(applicationId);
        return ApiResponse<IEnumerable<PaymentDto>>.Ok(payments.OrderByDescending(p => p.CreatedAt).Select(MapToDto));
    }

    public async Task<byte[]> GenerateReceiptPdfAsync(Guid paymentId, Guid userId, string role)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId);
        if (payment == null) throw new InvalidOperationException("Payment not found");

        var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
        if (application == null) throw new InvalidOperationException("Associated application not found");

        // Security check
        if (role == "Applicant" && application.ApplicantId != userId)
            throw new InvalidOperationException("Access denied. You can only download your own receipts.");

        if (payment.Status != PaymentStatus.Paid)
            throw new InvalidOperationException("Receipt can only be generated for successful payments.");

        return await _receiptGenerator.GenerateReceiptAsync(MapToDto(payment));
    }

    private static PaymentDto MapToDto(PaymentTransaction p) => new()
    {
        Id = p.Id,
        ApplicationId = p.ApplicationId,
        FeeType = p.FeeType,
        Amount = p.Amount,
        Status = p.Status,
        TransactionReference = p.TransactionReference,
        ReceiptNumber = p.ReceiptNumber,
        PaidAt = p.PaidAt,
        CreatedAt = p.CreatedAt,
        Success = p.Status == PaymentStatus.Paid
    };
}