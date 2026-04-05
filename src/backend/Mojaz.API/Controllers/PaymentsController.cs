using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage application payments for Stage 03: Fee Payment.
/// </summary>
[ApiController]
[Route("api/v1/applications/{applicationId}/[controller]")]
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
    public async Task<IActionResult> InitiatePaymentAsync(Guid applicationId, [FromBody] InitiatePaymentRequest request)
    {
        var result = await _paymentService.InitiatePaymentAsync(applicationId, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List all payment transactions for an application.
    /// </summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<PaymentDto>>), 200)]
    public async Task<IActionResult> GetByApplicationIdAsync(Guid applicationId)
    {
        var result = await _paymentService.GetByApplicationIdAsync(applicationId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Public gateway callback simulation.
    /// </summary>
    [HttpPost("callback")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    public async Task<IActionResult> CallbackAsync([FromBody] PaymentCallback request)
    {
        var result = await _paymentService.ProcessCallbackAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Verify a specific payment status against the gateway manually.
    /// </summary>
    [HttpGet("{paymentId}/verify")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> VerifyAsync(Guid paymentId)
    {
        var result = await _paymentService.VerifyPaymentAsync(paymentId);
        return StatusCode(result.StatusCode, result);
    }
}
