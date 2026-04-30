using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
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
    /// Get all payments with pagination (for employees/managers and applicants)
    /// </summary>
    public async Task<ApiResponse<PagedResult<PaymentDto>>> GetAllPaymentsAsync(int page, int pageSize, string? status, string? search, Guid? userId = null, string? role = null)
    {
        var query = _paymentRepository.Query().Where(p => !p.IsDeleted);

        // For Applicants, filter to only their applications
        if (role == "Applicant" && userId.HasValue)
        {
            var applicationIds = await _applicationRepository.FindAsync(a => a.ApplicantId == userId.Value && !a.IsDeleted);
            var appIdList = applicationIds.Select(a => a.Id).ToList();
            query = query.Where(p => appIdList.Contains(p.ApplicationId));
        }

        // Filter by status if provided
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<PaymentStatus>(status, out var statusEnum))
        {
            query = query.Where(p => p.Status == statusEnum);
        }

        // Filter by search (application number or applicant name) - only for employees
        if (!string.IsNullOrEmpty(search) && role != "Applicant")
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
            .ToList();

        var paymentDtos = new List<PaymentDto>();
        foreach (var payment in payments
            .Skip((page - 1) * pageSize)
            .Take(pageSize))
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
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            HasPreviousPage = page > 1,
            HasNextPage = page < (int)Math.Ceiling(totalCount / (double)pageSize)
        };

        return ApiResponse<PagedResult<PaymentDto>>.Ok(result);
    }

public async Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(Guid applicationId, PaymentInitiateRequest request, Guid userId, string role)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<PaymentDto>.Fail(404, "الطلب غير موجود.");

        // Ownership check for Applicants
        if (role == "Applicant" && application.ApplicantId != userId)
            return ApiResponse<PaymentDto>.Fail(403, "غير مصرح لك.");

        // Read actual fee from FeeStructures table based on request.FeeType and request.LicenseCategoryId
        var feeStructure = await _feeRepository.GetActiveFeeAsync(request.FeeType, application.LicenseCategoryId);
        decimal amount = feeStructure?.Amount ?? 0;

        if (amount <= 0)
        {
            return ApiResponse<PaymentDto>.Fail(400, "لم يتم العثور على رسوم نشطة لهذا النوع. يرجى التواصل مع الدعم.");
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

    public async Task<ApiResponse<PaymentDto>> InitiatePaymentByNumberAsync(string applicationNumber, InitiatePaymentRequest request, Guid userId, string role)
    {
        var application = await _applicationRepository.FindAsync(a => a.ApplicationNumber == applicationNumber);
        var app = application.FirstOrDefault();
        if (app == null) return ApiResponse<PaymentDto>.Fail(404, "الطلب غير موجود.");

        // Ownership check for Applicants
        if (role == "Applicant" && app.ApplicantId != userId)
            return ApiResponse<PaymentDto>.Fail(403, "غير مصرح لك.");

        // Read actual fee from FeeStructures table based on request.FeeType and request.LicenseCategoryId
        var feeStructure = await _feeRepository.GetActiveFeeAsync(request.FeeType, app.LicenseCategoryId);
        decimal amount = feeStructure?.Amount ?? 0;

        if (amount <= 0)
        {
            return ApiResponse<PaymentDto>.Fail(400, "يجب تحديد مبلغ الدفع.");
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
        if (payment == null) return ApiResponse<PaymentDto>.Fail(404, "المعاملة غير موجودة.");

        payment.Status = request.Success ? PaymentStatus.Paid : PaymentStatus.Failed;
        payment.PaidAt = request.Success ? DateTime.UtcNow : null;
        
        _paymentRepository.Update(payment);

        if (payment.Status == PaymentStatus.Paid)
        {
            var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
            if (application != null && application.CurrentStage == ApplicationStages.Stage01Creation)
            {
                application.CurrentStage = ApplicationStages.Stage03InitialPayment;
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
        }, "تمت العملية بنجاح.");
    }

    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role)
    {
        // Ownership check for Applicants
        if (role == "Applicant")
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null)
                return ApiResponse<IEnumerable<PaymentDto>>.Fail(404, "الطلب غير موجود.");
            if (application.ApplicantId != userId)
                return ApiResponse<IEnumerable<PaymentDto>>.Fail(403, "غير مصرح لك.");
        }

        var payments = await _paymentRepository.FindAsync(p => p.ApplicationId == applicationId);
        return ApiResponse<IEnumerable<PaymentDto>>.Ok(payments.Select(p => new PaymentDto { 
            Id = p.Id, 
            ApplicationId = p.ApplicationId,
            Amount = p.Amount, 
            Status = p.Status, 
            TransactionReference = p.TransactionReference 
        }));
    }

    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationNumberAsync(string applicationNumber, Guid userId, string role)
    {
        if (string.IsNullOrWhiteSpace(applicationNumber))
            return ApiResponse<IEnumerable<PaymentDto>>.Fail(400, "معرف الطلب مطلوب.");

        var applications = await _applicationRepository.FindAsync(a => a.ApplicationNumber == applicationNumber);
        var application = applications.FirstOrDefault();
        
        if (application == null)
            return ApiResponse<IEnumerable<PaymentDto>>.Fail(404, "الطلب غير موجود.");

        // Ownership check for Applicants
        if (role == "Applicant" && application.ApplicantId != userId)
            return ApiResponse<IEnumerable<PaymentDto>>.Fail(403, "غير مصرح لك.");

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
    public async Task<ApiResponse<PaymentDto>> GetByIdAsync(Guid paymentId, Guid userId, string role)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId);
        if (payment == null) return ApiResponse<PaymentDto>.Fail(404, "الدفع غير موجود.");

        var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
        
        // Ownership check for Applicants
        if (role == "Applicant" && (application == null || application.ApplicantId != userId))
            return ApiResponse<PaymentDto>.Fail(403, "غير مصرح لك.");

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
        if (payment == null) return ApiResponse<bool>.Fail(404, "الدفع غير موجود.");
        
        return ApiResponse<bool>.Ok(payment.Status == PaymentStatus.Paid);
    }

    public async Task<ApiResponse<PaymentDto>> ConfirmPaymentAsync(PaymentConfirmRequest request, Guid userId, string role)
    {
        var payment = await _paymentRepository.GetByIdAsync(request.PaymentId);
        if (payment == null) return ApiResponse<PaymentDto>.Fail(404, "الدفع غير موجود.");

        // Security check: Applicants can only confirm their own payments
        if (role == "Applicant")
        {
            var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
            if (application == null || application.ApplicantId != userId)
            {
                return ApiResponse<PaymentDto>.Fail(403, "غير مصرح لك بتأكيد هذا الدفع.");
            }
        }

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
            if (application != null && application.CurrentStage == ApplicationStages.Stage01Creation)
            {
                application.CurrentStage = ApplicationStages.Stage03InitialPayment;
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
        }, "تم تحديث وسيلة الدفع بنجاح.");
    }

    public async Task<ApiResponse<PaymentReceiptResponse>> GetReceiptAsync(Guid paymentId, Guid userId, string role)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId);
        if (payment == null) return ApiResponse<PaymentReceiptResponse>.Fail(404, "الدفع غير موجود.");

        if (payment.Status != PaymentStatus.Paid)
            return ApiResponse<PaymentReceiptResponse>.Fail(400, "الدفع لم يكتمل.");

        var application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
        if (application == null) return ApiResponse<PaymentReceiptResponse>.Fail(404, "الطلب غير موجود.");

        // Ownership check for Applicants
        if (role == "Applicant" && application.ApplicantId != userId)
            return ApiResponse<PaymentReceiptResponse>.Fail(403, "غير مصرح لك.");

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

    /// <summary>
    /// Process a payment by ID - simulates successful payment
    /// </summary>
    public async Task<ApiResponse<PaymentDto>> ProcessPaymentAsync(Guid paymentId, Guid userId, string role)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId);
        if (payment == null) return ApiResponse<PaymentDto>.Fail(404, "الدفع غير موجود.");

        // Ownership check for Applicants
        ApplicationEntity? application = null;
        if (role == "Applicant")
        {
            application = await _applicationRepository.GetByIdAsync(payment.ApplicationId);
            if (application == null || application.ApplicantId != userId)
                return ApiResponse<PaymentDto>.Fail(403, "غير مصرح لك.");
        }

        // Only process pending payments
        if (payment.Status != PaymentStatus.Pending)
            return ApiResponse<PaymentDto>.Fail(400, $"لا يمكن معالجة الدفع الحالي. الحالة: {payment.Status}");

        // Simulate successful payment
        payment.Status = PaymentStatus.Paid;
        payment.PaidAt = DateTime.UtcNow;
        payment.PaymentMethod = "Simulated";
        payment.ReceiptNumber = $"RCP-{DateTime.UtcNow:yyyyMMdd}-{payment.Id:N}".ToUpper();

        _paymentRepository.Update(payment);

        // Update application stage based on payment type and current stage
        application ??= await _applicationRepository.GetByIdAsync(payment.ApplicationId);
        if (application != null)
        {
            // Stage 03: Initial Payment (Application Fee) -> Advance to Stage 04
            if (application.CurrentStage == ApplicationStages.Stage01Creation || 
                application.CurrentStage == ApplicationStages.Stage02Documents ||
                application.CurrentStage == ApplicationStages.Stage03InitialPayment)
            {
                application.CurrentStage = ApplicationStages.Stage04Medical;
                _applicationRepository.Update(application);
            }
            // Stage 09: Issuance Payment -> Advance to Stage 10
            else if (application.CurrentStage == ApplicationStages.Stage08FinalApproval ||
                     application.CurrentStage == ApplicationStages.Stage09IssuancePayment)
            {
                application.CurrentStage = ApplicationStages.Stage10Issuance;
                _applicationRepository.Update(application);
            }

            // Send notification
            await _notificationService.SendAsync(new NotificationRequest
            {
                UserId = application.ApplicantId,
                ApplicationId = application.Id,
                EventType = NotificationEventType.PaymentSuccess,
                TitleAr = "تم استلام الدفعة بنجاح",
                TitleEn = "Payment Success",
                MessageAr = $"تم استلام مبلغ {payment.Amount} بنجاح وتم تحديث حالة الطلب.",
                MessageEn = $"Payment of {payment.Amount} received successfully and application status updated."
            });
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
            PaymentMethod = payment.PaymentMethod,
            Success = true
        }, "تم معالجة الدفع بنجاح.");
    }

    /// <summary>
    /// Get pending payment for a specific application
    /// </summary>
    public async Task<ApiResponse<PaymentDto>> GetPendingPaymentForApplicationAsync(Guid applicationId, Guid userId, string role)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<PaymentDto>.Fail(404, "الطلب غير موجود.");

        // Ownership check for Applicants
        if (role == "Applicant" && application.ApplicantId != userId)
            return ApiResponse<PaymentDto>.Fail(403, "غير مصرح لك.");

        // Find the pending payment for this application
        var payments = await _paymentRepository.FindAsync(p => 
            p.ApplicationId == applicationId && 
            p.Status == PaymentStatus.Pending &&
            !p.IsDeleted);

        var pendingPayment = payments.FirstOrDefault();
        
        if (pendingPayment == null)
        {
            // Check if there's any payment (paid or failed) - return not found if none
            var anyPayments = await _paymentRepository.FindAsync(p => p.ApplicationId == applicationId && !p.IsDeleted);
            if (!anyPayments.Any())
                return ApiResponse<PaymentDto>.Fail(404, "لا يوجد دفعة معلقة لهذا الطلب.");
            
            // There are payments but none pending - return success with null data indicating all paid
            return ApiResponse<PaymentDto>.Ok(null!, "جميع المدفوعات تم سدادها.");
        }

        // Get applicant name
        var applicant = await _userRepository.GetByIdAsync(application.ApplicantId);
        var applicantName = applicant?.FullNameAr ?? applicant?.FullNameEn ?? string.Empty;

        return ApiResponse<PaymentDto>.Ok(new PaymentDto
        {
            Id = pendingPayment.Id,
            ApplicationId = pendingPayment.ApplicationId,
            ApplicationNumber = application.ApplicationNumber,
            ApplicantFullName = applicantName,
            FeeType = pendingPayment.FeeType,
            Amount = pendingPayment.Amount,
            Currency = pendingPayment.Currency,
            Status = (PaymentStatus)pendingPayment.Status,
            DueDate = pendingPayment.CreatedAt.AddDays(7).ToString("yyyy-MM-dd"),
            TransactionReference = pendingPayment.TransactionReference ?? string.Empty,
            ReceiptNumber = pendingPayment.ReceiptNumber,
            PaidAt = pendingPayment.PaidAt,
            PaymentMethod = pendingPayment.PaymentMethod,
            CreatedAt = pendingPayment.CreatedAt
        });
    }

}

