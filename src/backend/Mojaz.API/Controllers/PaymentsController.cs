using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage application payments for Stage 03: Fee Payment.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IApplicationService _applicationService;

    public PaymentsController(
        IPaymentService paymentService,
        IApplicationService applicationService)
    {
        _paymentService = paymentService;
        _applicationService = applicationService;
    }

    /// <summary>
    /// Get my payments (for the current applicant)
    /// </summary>
    [HttpGet("my-payments")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<PaymentDto>>), 200)]
    public async Task<IActionResult> GetMyPaymentsAsync()
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var result = await _paymentService.GetMyPaymentsAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List all payments (for employees/managers)
    /// </summary>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Items per page (default: 20)</param>
    /// <param name="status">Filter by status</param>
    /// <param name="search">Search by application number or applicant name</param>
    [HttpGet]
    [Authorize(Roles = "Receptionist,Doctor,Examiner,Manager,Security")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<PaymentDto>>), 200)]
    public async Task<IActionResult> GetAllPaymentsAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20, 
        [FromQuery] string? status = null,
        [FromQuery] string? search = null)
    {
        var result = await _paymentService.GetAllPaymentsAsync(page, pageSize, status, search);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Initiate a new fee payment.
    /// </summary>
    [HttpPost("initiate")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 201)]
    public async Task<IActionResult> InitiatePaymentAsync([FromBody] PaymentInitiateRequest request)
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        // Verify application exists via ApplicationService
        var applicationResult = await _applicationService.GetByIdAsync(request.ApplicationId, userId, "Applicant");
        if (!applicationResult.Success || applicationResult.Data == null)
        {
            return BadRequest(ApiResponse<object>.Fail(400, "Application not found."));
        }

        var result = await _paymentService.InitiatePaymentAsync(request.ApplicationId, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Initiate a new fee payment by application number.
    /// Fee is read from FeeStructures table based on request.FeeType and application category.
    /// </summary>
    /// <param name="applicationNumber">The application number (e.g., MOJ-2025-12345678)</param>
    /// <param name="request">Payment request containing fee type</param>
    [HttpPost("initiate-by-number/{applicationNumber}")]
    [Authorize(Roles = "Applicant,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> InitiatePaymentByNumberAsync(string applicationNumber, [FromBody] InitiatePaymentRequest request)
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        // Verify application exists via ApplicationService
        var applicationsResult = await _applicationService.GetByApplicationNumberAsync(applicationNumber);
        var application = applicationsResult.Data?.FirstOrDefault();
        
        if (application == null)
        {
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));
        }

        var result = await _paymentService.InitiatePaymentByNumberAsync(applicationNumber, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Process payment callback from gateway.
    /// This endpoint is called by the payment gateway after a payment transaction.
    /// </summary>
    [HttpPost("callback")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    public async Task<IActionResult> ProcessCallbackAsync([FromBody] PaymentCallback request)
    {
        var result = await _paymentService.ProcessCallbackAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List all payment transactions for an application by ID.
    /// </summary>
    /// <param name="applicationId">The application GUID</param>
    [HttpGet("application/{applicationId}")]
    [Authorize(Roles = "Applicant,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<PaymentDto>>), 200)]
    public async Task<IActionResult> GetByApplicationIdAsync(Guid applicationId)
    {
        var result = await _paymentService.GetByApplicationIdAsync(applicationId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List all payment transactions for an application by application number.
    /// Fee is read from FeeStructures table.
    /// </summary>
    /// <param name="applicationNumber">The application number (e.g., MOJ-2025-12345678)</param>
    [HttpGet("by-number/{applicationNumber}")]
    [Authorize(Roles = "Applicant,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<PaymentDto>>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetByApplicationNumberAsync(string applicationNumber)
    {
        // Verify application exists via ApplicationService
        var applicationsResult = await _applicationService.GetByApplicationNumberAsync(applicationNumber);
        var application = applicationsResult.Data?.FirstOrDefault();
        
        if (application == null)
        {
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));
        }

        var result = await _paymentService.GetByApplicationNumberAsync(applicationNumber);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Verify a payment status.
    /// </summary>
    /// <param name="paymentId">The payment transaction GUID</param>
    [HttpGet("verify/{paymentId}")]
    [Authorize(Roles = "Applicant,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> VerifyPaymentAsync(Guid paymentId)
    {
        var result = await _paymentService.VerifyPaymentAsync(paymentId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get a single payment by ID.
    /// </summary>
    /// <param name="paymentId">The payment transaction GUID</param>
    [HttpGet("{paymentId}")]
    [Authorize(Roles = "Applicant,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetByIdAsync(Guid paymentId)
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Applicant";

        // For Applicants, verify payment belongs to their application
        if (role == "Applicant")
        {
            var verifyResult = await _paymentService.VerifyPaymentAsync(paymentId);
            if (!verifyResult.Success)
            {
                return NotFound(ApiResponse<object>.Fail(404, "Payment not found."));
            }
        }

        var result = await _paymentService.GetByIdAsync(paymentId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Confirm a payment transaction.
    /// Used for manual payment confirmation (e.g., cash payment at counter).
    /// </summary>
    [HttpPost("confirm")]
    [Authorize(Roles = "Applicant,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> ConfirmPaymentAsync([FromBody] PaymentConfirmRequest request)
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var result = await _paymentService.ConfirmPaymentAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get payment receipt.
    /// Returns receipt details for a successful payment.
    /// </summary>
    /// <param name="paymentId">The payment transaction GUID</param>
    [HttpGet("{paymentId}/receipt")]
    [Authorize(Roles = "Applicant,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<PaymentReceiptResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetReceiptAsync(Guid paymentId)
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Applicant";

        // Verify payment belongs to user's application (for Applicants)
        if (role == "Applicant")
        {
            var verifyResult = await _paymentService.VerifyPaymentAsync(paymentId);
            if (!verifyResult.Success)
            {
                return NotFound(ApiResponse<object>.Fail(404, "Payment not found."));
            }
        }

        var result = await _paymentService.GetReceiptAsync(paymentId);
        return StatusCode(result.StatusCode, result);
    }
}