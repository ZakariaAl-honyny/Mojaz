using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System;
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

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
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

        var result = await _paymentService.InitiatePaymentAsync(request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List all payment transactions for an application.
    /// </summary>
    [HttpGet("application/{applicationId}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<PaymentDto>>), 200)]
    public async Task<IActionResult> GetByApplicationIdAsync(Guid applicationId)
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
        var result = await _paymentService.GetByApplicationIdAsync(applicationId, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Confirm a payment (simulating gateway callback).
    /// </summary>
    [HttpPost("confirm")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    public async Task<IActionResult> ConfirmPaymentAsync([FromBody] PaymentConfirmRequest request)
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var result = await _paymentService.ConfirmPaymentAsync(request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Download payment receipt as PDF.
    /// </summary>
    [HttpGet("{paymentId}/receipt")]
    [Authorize]
    [ProducesResponseType(typeof(FileContentResult), 200)]
    public async Task<IActionResult> DownloadReceiptAsync(Guid paymentId)
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var role = User.FindFirstValue(ClaimTypes.Role) ?? "";

        try
        {
            var pdfBytes = await _paymentService.GenerateReceiptPdfAsync(paymentId, userId, role);
            return File(pdfBytes, "application/pdf", $"receipt-{paymentId}.pdf");
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<object>.Fail(404, ex.Message));
        }
    }
}
