using Mojaz.Application.DTOs.Payment;
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

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IRepository<PaymentTransaction> _paymentRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly IFeeStructureRepository _feeRepository;

    public PaymentService(
        IRepository<PaymentTransaction> paymentRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<User> userRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        IFeeStructureRepository feeRepository)
    {
        _paymentRepository = paymentRepository;
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _feeRepository = feeRepository;
    }

    /// <summary>
    /// Get all payments for the current applicant's applications
    /// </summary>
    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetMyPaymentsAsync(Guid userId)
    {
        // Find all applications belonging to this user
        var applications = await _applicationRepository.FindAsync(a => a.ApplicantId == userId && !a.IsDeleted);
        
        if (!applications.Any())
            return ApiResponse<IEnumerable<PaymentDto>>.Ok(new List<PaymentDto>());

        var applicationIds = applications.Select(a => a.Id).ToList();
        
        // Get all payments for these applications
        var payments = await _paymentRepository.FindAsync(p => applicationIds.Contains(p.ApplicationId) && !p.IsDeleted);
        
        var paymentDtos = new List<PaymentDto>();
        foreach (var payment in payments)
        {
            var app = applications.FirstOrDefault(a => a.Id == payment.ApplicationId);
            var creator = app != null ? await _userRepository.GetByIdAsync(app.ApplicantId) : null;
            var applicantName = creator?.FullNameAr ?? creator?.FullNameEn ?? string.Empty;
            
            paymentDtos.Add(new PaymentDto
            {
                Id = payment.Id,
                ApplicationId = payment.ApplicationId,
                ApplicationNumber = app?.ApplicationNumber ?? string.Empty,
                ApplicantFullName = applicantName,
                FeeType = payment.FeeType,
                Amount = payment.Amount,
                Status = (PaymentStatus)payment.Status,
                TransactionReference = payment.TransactionReference ?? string.Empty,
                PaidAt = payment.PaidAt,
                PaymentMethod = payment.PaymentMethod,
                ReceiptNumber = payment.ReceiptNumber,
                CreatedAt = payment.CreatedAt
            });
        }

        return ApiResponse<IEnumerable<PaymentDto>>.Ok(paymentDtos);
    }

    /// <summary>
    /// Get all payments with pagination (for employees/managers)
    /// </summary>
    public async Task<ApiResponse<PagedResult<PaymentDto>>> GetAllPaymentsAsync(int page, int pageSize, string? status, string? search)
    {
        var query = _paymentRepository.Query().Where(p => !p.IsDeleted);

        // Filter by status if provided
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<PaymentStatus>(status, out var statusEnum))
        {
            query = query.Where(p => p.Status == statusEnum);
        }

        // Filter by search (application number or applicant name)
        if (!string.IsNullOrEmpty(search))
        {
            var applicationQuery = _applicationRepository.Query().Where(a => !a.IsDeleted);
            if (search.Length >= 3)
            {
                applicationQuery = applicationQuery.Where(a => 
                    a.ApplicationNumber.Contains(search) || 
                    a.Applicant.FullNameAr.Contains(search) ||
                    a.Applicant.FullNameEn.Contains(search));
            }
            
            var appIds = applicationQuery.Select(a => a.Id).ToList();
            query = query.Where(p => appIds.Contains(p.ApplicationId));
        }

        var totalCount = query.Count();
        var payments = query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var paymentDtos = new List<PaymentDto>();
        foreach (var payment in payments)
        {
            var app = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
            var applicant = app != null ? await _userRepository.GetByIdAsync(app.ApplicantId) : null;
            
            // Use Arabic name for display (Arabic is the default language)
            var applicantName = applicant?.FullNameAr ?? applicant?.FullNameEn ?? string.Empty;
            
            paymentDtos.Add(new PaymentDto
            {
                Id = payment.Id,
                ApplicationId = payment.ApplicationId,
                ApplicationNumber = app?.ApplicationNumber ?? string.Empty,
                ApplicantFullName = applicantName,
                FeeType = payment.FeeType,
                Amount = payment.Amount,
                Status = (PaymentStatus)payment.Status,
                TransactionReference = payment.TransactionReference ?? string.Empty,
                PaidAt = payment.PaidAt,
                PaymentMethod = payment.PaymentMethod,
                ReceiptNumber = payment.ReceiptNumber,
                CreatedAt = payment.CreatedAt
            });
        }

        var result = new PagedResult<PaymentDto>
        {
            Items = paymentDtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };

        return ApiResponse<PagedResult<PaymentDto>>.Ok(result);
    }

public async Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(Guid applicationId, PaymentInitiateRequest request)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<PaymentDto>.Fail(404, "Application not found.");

        // Read actual fee from FeeStructures table based on request.FeeType and request.LicenseCategoryId
        var feeStructure = await _feeRepository.GetActiveFeeAsync(request.FeeType, application.LicenseCategoryId);
        decimal amount = feeStructure?.Amount ?? 0;

        if (amount <= 0)
        {
            return ApiResponse<PaymentDto>.Fail(400, "Fee structure not found for this payment type.");
        }

        var payment = new PaymentTransaction
        {
            ApplicationId = applicationId,
            Amount = amount,
            Status = PaymentStatus.Pending,
            PaymentMethod = request.FeeType.ToString(),
            TransactionReference = $"TXN_{Guid.NewGuid()}"
        };

        await _paymentRepository.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<PaymentDto>.Ok(new PaymentDto 
        { 
            Id = payment.Id, 
            ApplicationId = applicationId,
            Amount = payment.Amount,
            Status = PaymentStatus.Pending,
            TransactionReference = payment.TransactionReference
        });
    }

    public async Task<ApiResponse<PaymentDto>> InitiatePaymentByNumberAsync(string applicationNumber, InitiatePaymentRequest request)
    {
        var application = await _applicationRepository.FindAsync(a => a.ApplicationNumber == applicationNumber);
        var app = application.FirstOrDefault();
        if (app == null) return ApiResponse<PaymentDto>.Fail(404, "Application not found.");

        // Read actual fee from FeeStructures table based on request.FeeType and request.LicenseCategoryId
        var feeStructure = await _feeRepository.GetActiveFeeAsync(request.FeeType, app.LicenseCategoryId);
        decimal amount = feeStructure?.Amount ?? 0;

        if (amount <= 0)
        {
            return ApiResponse<PaymentDto>.Fail(400, "Fee structure not found for this payment type.");
        }

        var payment = new PaymentTransaction
        {
            ApplicationId = app.Id,
            Amount = amount,
            Status = PaymentStatus.Pending,
            PaymentMethod = request.FeeType.ToString(),
            TransactionReference = $"TXN_{Guid.NewGuid()}"
        };

        await _paymentRepository.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<PaymentDto>.Ok(new PaymentDto 
        { 
            Id = payment.Id, 
            ApplicationId = app.Id,
            Amount = payment.Amount,
            Status = PaymentStatus.Pending,
            TransactionReference = payment.TransactionReference
        });
    }

    public async Task<ApiResponse<PaymentDto>> ProcessCallbackAsync(PaymentCallback request)
    {
        var payments = await _paymentRepository.FindAsync(p => p.TransactionReference == request.TransactionId);
        var payment = payments.FirstOrDefault();
        if (payment == null) return ApiResponse<PaymentDto>.Fail(404, "Transaction not found.");

        payment.Status = request.Success ? PaymentStatus.Paid : PaymentStatus.Failed;
        payment.PaidAt = request.Success ? DateTime.UtcNow : null;
        
        _paymentRepository.Update(payment);

        if (payment.Status == PaymentStatus.Paid)
        {
            var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
            if (application != null && application.CurrentStage == "01: Application Submission")
            {
                application.CurrentStage = "02: Payment Received";
                _applicationRepository.Update(application);
                
                await _notificationService.SendAsync(new NotificationRequest
                {
                    UserId = application.ApplicantId,
                    ApplicationId = application.Id,
                    EventType = NotificationEventType.PaymentSuccess,
                    TitleAr = "تم استلام الدفعة",
                    TitleEn = "Payment Success",
                    MessageAr = $"تم استلام مبلغ {payment.Amount} بنجاح.",
                    MessageEn = $"Payment of {payment.Amount} received."
                });
            }
        }
        
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<PaymentDto>.Ok(new PaymentDto { 
            Id = payment.Id, 
            ApplicationId = payment.ApplicationId,
            Amount = payment.Amount,
            Status = payment.Status,
            TransactionReference = payment.TransactionReference ?? string.Empty,
            Success = request.Success
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
            TransactionReference = p.TransactionReference 
        }));
    }

    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationNumberAsync(string applicationNumber)
    {
        if (string.IsNullOrWhiteSpace(applicationNumber))
            return ApiResponse<IEnumerable<PaymentDto>>.Fail(400, "Application number is required.");

        var applications = await _applicationRepository.FindAsync(a => a.ApplicationNumber == applicationNumber);
        var application = applications.FirstOrDefault();
        
        if (application == null)
            return ApiResponse<IEnumerable<PaymentDto>>.Fail(404, "Application not found.");

        var payments = await _paymentRepository.FindAsync(p => p.ApplicationId == application.Id);
        return ApiResponse<IEnumerable<PaymentDto>>.Ok(payments.Select(p => new PaymentDto { 
            Id = p.Id, 
            ApplicationId = p.ApplicationId,
            Amount = p.Amount, 
            Status = p.Status, 
            TransactionReference = p.TransactionReference 
        }));
    }

    /// <summary>
    /// Get a single payment by ID
    /// </summary>
    public async Task<ApiResponse<PaymentDto>> GetByIdAsync(Guid paymentId)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId);
        if (payment == null) return ApiResponse<PaymentDto>.Fail(404, "Payment not found.");

        var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
        var creator = application != null ? await _userRepository.GetByIdAsync(application.ApplicantId) : null;
        var applicantName = creator?.FullNameAr ?? creator?.FullNameEn ?? string.Empty;

        // Get due date - 7 days from creation
        var dueDate = payment.CreatedAt.AddDays(7).ToString("yyyy-MM-dd");

        return ApiResponse<PaymentDto>.Ok(new PaymentDto
        {
            Id = payment.Id,
            ApplicationId = payment.ApplicationId,
            ApplicationNumber = application?.ApplicationNumber ?? string.Empty,
            ApplicantFullName = applicantName,
            FeeType = payment.FeeType,
            Amount = payment.Amount,
            Status = (PaymentStatus)payment.Status,
            DueDate = dueDate,
            TransactionReference = payment.TransactionReference ?? string.Empty,
            PaidAt = payment.PaidAt,
            PaymentMethod = payment.PaymentMethod,
            ReceiptNumber = payment.ReceiptNumber,
            CreatedAt = payment.CreatedAt
        });
    }

public async Task<ApiResponse<bool>> VerifyPaymentAsync(Guid paymentId)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId);
        if (payment == null) return ApiResponse<bool>.Fail(404, "Payment not found.");
        
        return ApiResponse<bool>.Ok(payment.Status == PaymentStatus.Paid);
    }

    public async Task<ApiResponse<PaymentDto>> ConfirmPaymentAsync(PaymentConfirmRequest request)
    {
        var payment = await _paymentRepository.GetByIdAsync(request.PaymentId);
        if (payment == null) return ApiResponse<PaymentDto>.Fail(404, "Payment not found.");

        // Update payment status based on confirmation
        payment.Status = request.IsSuccessful ? PaymentStatus.Paid : PaymentStatus.Failed;
        payment.PaymentMethod = request.PaymentMethod;
        payment.PaidAt = request.IsSuccessful ? DateTime.UtcNow : null;

        // Generate receipt number if successful
        if (request.IsSuccessful)
        {
            payment.ReceiptNumber = $"RCP-{DateTime.UtcNow:yyyyMMdd}-{payment.Id:N}".ToUpper();
        }

        _paymentRepository.Update(payment);

        // Update application stage if payment successful
        if (payment.Status == PaymentStatus.Paid)
        {
            var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
            if (application != null && application.CurrentStage == "01: Application Submission")
            {
                application.CurrentStage = "02: Payment Received";
                _applicationRepository.Update(application);

                await _notificationService.SendAsync(new NotificationRequest
                {
                    UserId = application.ApplicantId,
                    ApplicationId = application.Id,
                    EventType = NotificationEventType.PaymentSuccess,
                    TitleAr = "تم استلام الدفعة",
                    TitleEn = "Payment Success",
                    MessageAr = $"تم استلام مبلغ {payment.Amount} بنجاح.",
                    MessageEn = $"Payment of {payment.Amount} received."
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
            ReceiptNumber = payment.ReceiptNumber,
            PaidAt = payment.PaidAt,
            Success = request.IsSuccessful
        });
    }

    public async Task<ApiResponse<PaymentReceiptResponse>> GetReceiptAsync(Guid paymentId)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId);
        if (payment == null) return ApiResponse<PaymentReceiptResponse>.Fail(404, "Payment not found.");

        if (payment.Status != PaymentStatus.Paid)
            return ApiResponse<PaymentReceiptResponse>.Fail(400, "Payment not completed.");

        var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
        if (application == null) return ApiResponse<PaymentReceiptResponse>.Fail(404, "Application not found.");

        // Get applicant name - use application's stored preferred language
        var applicantName = application.PreferredLanguage == "ar" 
            ? "المتقدم" 
            : "Applicant";

        var receipt = new PaymentReceiptResponse
        {
            PaymentId = payment.Id,
            ApplicationId = payment.ApplicationId,
            ApplicationNumber = application.ApplicationNumber,
            ApplicantName = applicantName,
            FeeType = payment.FeeType,
            Amount = payment.Amount,
            Currency = "SAR",
            Status = payment.Status,
            TransactionReference = payment.TransactionReference ?? string.Empty,
            ReceiptNumber = payment.ReceiptNumber ?? string.Empty,
            PaidAt = payment.PaidAt ?? DateTime.UtcNow,
            CreatedAt = payment.CreatedAt,
            ServiceNameAr = "طلب رخصة قيادة",
            ServiceNameEn = "Driving License Application"
        };

        return ApiResponse<PaymentReceiptResponse>.Ok(receipt);
    }

}