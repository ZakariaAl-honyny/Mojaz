using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Renewal;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Controller for license renewal operations.
/// Provides endpoints for checking eligibility, creating renewal applications, 
/// processing medical results, paying fees, and issuing renewed licenses.
/// </summary>
[ApiController]
[Route("api/v1/licenses/renewal")]
[Produces("application/json")]
public class RenewalController : ControllerBase
{
    private readonly IRenewalService _renewalService;

    public RenewalController(IRenewalService renewalService)
    {
        _renewalService = renewalService;
    }

    /// <summary>
    /// Check if the current user is eligible for license renewal.
    /// </summary>
    /// <param name="categoryId">The license category ID to renew.</param>
    /// <returns>Eligibility information including fee and expiration details.</returns>
    [HttpGet("eligibility")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<EligibilityResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public async Task<IActionResult> CheckEligibility(Guid categoryId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _renewalService.ValidateEligibilityAsync(userId, categoryId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Create a new license renewal application.
    /// </summary>
    /// <param name="request">The renewal request containing old license ID and category.</param>
    /// <returns>The created application ID.</returns>
    [HttpPost]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 409)]
    public async Task<IActionResult> CreateRenewal([FromBody] CreateRenewalRequest request)
    {
        var result = await _renewalService.CreateRenewalAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Submit medical examination result for a renewal application.
    /// </summary>
    /// <param name="applicationId">The renewal application ID.</param>
    /// <param name="medicalExaminationId">The medical examination ID.</param>
    /// <returns>Success status.</returns>
    [HttpPost("{applicationId}/medical-result")]
    [Authorize(Roles = "Doctor")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> SubmitMedicalResult(Guid applicationId, Guid medicalExaminationId)
    {
        var result = await _renewalService.ProcessMedicalResultAsync(applicationId, medicalExaminationId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Process payment for the renewal fee.
    /// </summary>
    /// <param name="applicationId">The renewal application ID.</param>
    /// <param name="paymentInfo">Payment details including method and transaction ID.</param>
    /// <returns>Success status.</returns>
    [HttpPost("{applicationId}/pay")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> PayRenewalFee(Guid applicationId, [FromBody] PaymentRequest paymentInfo)
    {
        var result = await _renewalService.PayRenewalFeeAsync(applicationId, paymentInfo);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Issue the renewed license after all prerequisites are met.
    /// </summary>
    /// <param name="applicationId">The renewal application ID.</param>
    /// <returns>License details including PDF download URL.</returns>
    [HttpPost("{applicationId}/issue")]
    [Authorize(Roles = "Manager,Security,Admin")]
    [ProducesResponseType(typeof(ApiResponse<IssueLicenseResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> IssueLicense(Guid applicationId)
    {
        var result = await _renewalService.IssueLicenseAsync(applicationId);
        return StatusCode(result.StatusCode, result);
    }
}