using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers
{
    [ApiController]
    [Route("api/v1/payments")]
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
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _paymentService.GetMyPaymentsAsync(userId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// List payments (for employees and applicants)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Applicant,Admin,Receptionist,Doctor,Examiner,Manager,Security")]
        [ProducesResponseType(typeof(ApiResponse<PagedResult<PaymentDto>>), 200)]
        public async Task<IActionResult> GetAllPaymentsAsync(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20, 
            [FromQuery] string? status = null,
            [FromQuery] string? search = null)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "Applicant";
            
            var result = await _paymentService.GetAllPaymentsAsync(page, pageSize, status, search, userId, role);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Initiate a new payment for an application (by Application ID)
        /// </summary>
        [HttpPost("initiate")]
        [Authorize(Roles = "Applicant,Receptionist")]
        [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 201)]
        public async Task<IActionResult> InitiatePaymentAsync([FromBody] PaymentInitiateRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "Applicant";

            var result = await _paymentService.InitiatePaymentAsync(request.ApplicationId, request, userId, role);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Process a payment - simulates successful payment
        /// </summary>
        [HttpPost("{paymentId}/process")]
        [Authorize(Roles = "Applicant,Receptionist,Manager,Admin")]
        [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
        public async Task<IActionResult> ProcessPaymentAsync(int paymentId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "Applicant";

            var result = await _paymentService.ProcessPaymentAsync(paymentId, userId, role);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Process payment callback from gateway.
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
        /// Verify a payment status.
        /// </summary>
        [HttpGet("verify/{paymentId}")]
        [Authorize(Roles = "Applicant,Receptionist,Doctor,Examiner,Manager,Security,Admin")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        public async Task<IActionResult> VerifyPaymentAsync(int paymentId)
        {
            var result = await _paymentService.VerifyPaymentAsync(paymentId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Confirm a payment transaction manually.
        /// </summary>
        [HttpPost("confirm")]
        [Authorize(Roles = "Applicant,Receptionist,Manager,Admin")]
        [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
        public async Task<IActionResult> ConfirmPaymentAsync([FromBody] PaymentConfirmRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "Applicant";

            var result = await _paymentService.ConfirmPaymentAsync(request, userId, role);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Get a single payment by ID and its receipt.
        /// </summary>
        [HttpGet("receipt/{paymentId}")]
        [Authorize(Roles = "Applicant,Receptionist,Doctor,Examiner,Manager,Security,Admin")]
        [ProducesResponseType(typeof(ApiResponse<PaymentReceiptResponse>), 200)]
        public async Task<IActionResult> GetReceiptAsync(int paymentId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "Applicant";

            var result = await _paymentService.GetReceiptAsync(paymentId, userId, role);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Get all payment transactions for an application.
        /// Route: api/v1/payments/application/{appIdOrNumber}
        /// </summary>
        [HttpGet("application/{appIdOrNumber}")]
        [Authorize(Roles = "Applicant,Receptionist,Doctor,Examiner,Manager,Security,Admin")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<PaymentDto>>), 200)]
        public async Task<IActionResult> GetByApplicationAsync(string appIdOrNumber)
        {
            var appId = await ResolveAppIdAsync(appIdOrNumber);
            if (appId == 0)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "Applicant";
            var result = await _paymentService.GetByApplicationIdAsync(appId, userId, role);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Initiate a new fee payment.
        /// Route: api/v1/payments/application/{appIdOrNumber}/initiate
        /// </summary>
        [HttpPost("application/{appIdOrNumber}/initiate")]
        [Authorize(Roles = "Applicant,Receptionist,Admin")]
        [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 201)]
        public async Task<IActionResult> InitiatePaymentAsync(string appIdOrNumber, [FromBody] InitiatePaymentRequest request)
        {
            var appId = await ResolveAppIdAsync(appIdOrNumber);
            if (appId == 0)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "Applicant";
            var result = await _paymentService.InitiatePaymentByNumberAsync(appIdOrNumber, request, userId, role);
            return StatusCode(result.StatusCode, result);
        }

        private async Task<int> ResolveAppIdAsync(string appIdOrNumber)
        {
            if (string.IsNullOrWhiteSpace(appIdOrNumber)) return 0;
            if (int.TryParse(appIdOrNumber.Trim(), out var id)) return id;

            var result = await _applicationService.GetByApplicationNumberAsync(appIdOrNumber.Trim());
            return result.Data?.FirstOrDefault()?.Id ?? 0;
        }
    }
}