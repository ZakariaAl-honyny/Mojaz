using Mojaz.Application.DTOs.Payments;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IFeeStructureRepository _feeStructureRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PaymentService(
        IPaymentRepository paymentRepository,
        IFeeStructureRepository feeStructureRepository,
        IUnitOfWork unitOfWork)
    {
        _paymentRepository = paymentRepository;
        _feeStructureRepository = feeStructureRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<PaymentDto>> InitiatePaymentAsync(PaymentInitiateRequest request)
    {
        // Get active fee from fee structure repository
        var fee = await _feeStructureRepository.GetActiveFeeAsync(request.FeeType, request.LicenseCategoryId);
        if (fee == null)
        {
            return ApiResponse<PaymentDto>.Fail(400, "Active fee not found for the specified fee type and license category.");
        }

        // Generate transaction reference: MOJ-PAY-{YEAR}-{8_RANDOM_DIGITS}
        var year = DateTime.UtcNow.Year;
        var random = new Random().Next(10000000, 99999999);
        var transactionReference = $"MOJ-PAY-{year}-{random:D8}";

        // Create payment entity
        var payment = new PaymentTransaction
        {
            ApplicationId = request.ApplicationId,
            FeeType = request.FeeType,
            Amount = fee.Amount,
            Status = PaymentStatus.Pending,
            TransactionReference = transactionReference,
            CreatedAt = DateTime.UtcNow
        };

        // Save to database
        await _paymentRepository.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        // Return payment DTO
        return ApiResponse<PaymentDto>.Ok(new PaymentDto
        {
            Id = payment.Id,
            ApplicationId = payment.ApplicationId,
            FeeType = payment.FeeType,
            Amount = payment.Amount,
            Status = payment.Status,
            TransactionReference = payment.TransactionReference,
            CreatedAt = payment.CreatedAt
        });
    }

    public async Task<ApiResponse<PaymentDto>> ConfirmPaymentAsync(PaymentConfirmRequest request)
    {
        // Get payment by ID
        var payment = await _paymentRepository.GetByIdAsync(request.PaymentId);
        if (payment == null)
        {
            return ApiResponse<PaymentDto>.Fail(404, "Payment not found.");
        }

        // Check if payment is already processed
        if (payment.Status != PaymentStatus.Pending)
        {
            return ApiResponse<PaymentDto>.Fail(400, $"Payment cannot be processed. Current status: {payment.Status}.");
        }

        // Update payment status based on confirmation
        if (request.IsSuccessful)
        {
            payment.Status = PaymentStatus.Paid;
            payment.PaidAt = DateTime.UtcNow;
        }
        else
        {
            payment.Status = PaymentStatus.Failed;
            payment.FailedAt = DateTime.UtcNow;
        }

        // Save changes
        await _paymentRepository.UpdateAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        // Return updated payment DTO
        return ApiResponse<PaymentDto>.Ok(new PaymentDto
        {
            Id = payment.Id,
            ApplicationId = payment.ApplicationId,
            FeeType = payment.FeeType,
            Amount = payment.Amount,
            Status = payment.Status,
            TransactionReference = payment.TransactionReference ?? string.Empty,
            CreatedAt = payment.CreatedAt,
            PaidAt = payment.PaidAt
        });
    }

    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetByApplicationIdAsync(Guid applicationId)
    {
        var payments = await _paymentRepository.GetByApplicationIdAsync(applicationId);
        var paymentDtos = payments.Select(p => new PaymentDto
        {
            Id = p.Id,
            ApplicationId = p.ApplicationId,
            FeeType = p.FeeType,
            Amount = p.Amount,
            Status = p.Status,
            TransactionReference = p.TransactionReference ?? string.Empty,
            CreatedAt = p.CreatedAt,
            PaidAt = p.PaidAt
        });

        return ApiResponse<IEnumerable<PaymentDto>>.Ok(paymentDtos);
    }

    public Task<ApiResponse<bool>> VerifyPaymentAsync(Guid paymentId)
    {
        // This is a placeholder implementation - in a real system, this might check with payment gateway
        return Task.FromResult(ApiResponse<bool>.Ok(true));
    }
}