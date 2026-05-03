using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Appointments;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers
{
    [ApiController]
    [Route("api/v1/appointments")]
    [Produces("application/json")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IApplicationService _applicationService;

        public AppointmentsController(IAppointmentService appointmentService, IApplicationService applicationService)
        {
            _appointmentService = appointmentService;
            _applicationService = applicationService;
        }

        /// <summary>
        /// Get all appointments for a specific application.
        /// Route: api/v1/appointments/application/{appIdOrNumber}
        /// </summary>
        [HttpGet("application/{appIdOrNumber}")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<AppointmentDto>>), 200)]
        public async Task<IActionResult> GetByApplicationAsync(string appIdOrNumber)
        {
            var appId = await ResolveAppIdAsync(appIdOrNumber);
            if (appId == 0)
                return NotFound(ApiResponse<object>.Fail(404, "الطلب غير موجود."));

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var result = await _appointmentService.GetAppointmentsByApplicationAsync(appId, userId, role);
            return Ok(new ApiResponse<List<AppointmentDto>> { Success = true, Data = result });
        }

        /// <summary>
        /// Create a new appointment for an application.
        /// Route: api/v1/appointments/application/{appIdOrNumber}
        /// </summary>
        [HttpPost("application/{appIdOrNumber}")]
        [Authorize(Roles = "Applicant,Receptionist,Manager,Admin")]
        [ProducesResponseType(typeof(ApiResponse<AppointmentDto>), StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateAsync(string appIdOrNumber, [FromBody] CreateAppointmentRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;

            Console.WriteLine($"[AppointmentsAPI] Create request for App: {appIdOrNumber} by User: {userId} ({role})");

            var appId = await ResolveAppIdAsync(appIdOrNumber);
            if (appId == 0)
            {
                Console.WriteLine($"[AppointmentsAPI] Error: Application {appIdOrNumber} not found.");
                return NotFound(ApiResponse<object>.Fail(404, "الطلب غير موجود."));
            }

            if (request == null)
                return BadRequest(ApiResponse<object>.Fail(400, "بيانات الطلب غير صالحة."));

            // Ownership Validation
            if (role == "Applicant")
            {
                var application = await _applicationService.GetByIdAsync(appId, userId, role);
                if (application == null || application.Data?.ApplicantId != userId)
                {
                    Console.WriteLine($"[AppointmentsAPI] Security: User {userId} tried to book for application {appId} owned by someone else.");
                    return Forbid();
                }
            }

            request.ApplicationId = appId;
            
            try 
            {
                Console.WriteLine($"[AppointmentsAPI] Attempting to create {request.Type} appointment for AppId: {appId} on {request.ScheduledDate} {request.TimeSlot}");
                var result = await _appointmentService.CreateAppointmentAsync(request);
                Console.WriteLine($"[AppointmentsAPI] Success! Appointment created with ID: {result.Id}");
                return StatusCode(201, ApiResponse<AppointmentDto>.Ok(result));
            }
            catch (Mojaz.Shared.Exceptions.ValidationException valEx)
            {
                Console.WriteLine($"[AppointmentsAPI] Validation Error: {string.Join(", ", valEx.Errors)}");
                return BadRequest(ApiResponse<object>.Fail(400, "فشل التحقق من البيانات", valEx.Errors));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AppointmentsAPI] Exception: {ex.Message}");
                var errorMsg = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, ApiResponse<object>.Fail(500, $"خطأ داخلي في الخادم: {errorMsg}", new List<string> { ex.StackTrace ?? "" }));
            }
        }

        /// <summary>
        /// Get available slots 
        /// </summary>
        [HttpGet("available-slots")]
        [Authorize]
        public async Task<IActionResult> GetAvailableSlotsAsync([FromQuery] AppointmentType type, [FromQuery] int branchId, [FromQuery] DateOnly date)
        {
            var result = await _appointmentService.GetAvailableSlotsAsync(type, branchId, date);
            return Ok(ApiResponse<List<DaySlotsDto>>.Ok(result));
        }

        /// <summary>
        /// Get attendance list for a specific date
        /// </summary>
        [HttpGet("attendance")]
        [Authorize(Roles = "Receptionist,Security,Manager,Admin")]
        [ProducesResponseType(typeof(ApiResponse<List<AppointmentDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAttendanceAsync([FromQuery] DateOnly date, [FromQuery] int? branchId = null)
        {
            if (date == default)
                return BadRequest(ApiResponse<object>.Fail(400, "التاريخ مطلوب."));

            var result = await _appointmentService.GetAttendanceAsync(date, branchId ?? 0);
            return Ok(ApiResponse<List<AppointmentDto>>.Ok(result));
        }

        /// <summary>
        /// Get all my appointments
        /// </summary>
        [HttpGet("my-appointments")]
        [Authorize(Roles = "Applicant")]
        public async Task<IActionResult> GetMyAppointmentsAsync()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _appointmentService.GetMyAppointmentsAsync(userId);
            return Ok(ApiResponse<List<AppointmentDto>>.Ok(result));
        }

        /// <summary>
        /// Global appointment management
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Receptionist,Doctor,Examiner,Manager,Admin,Security,Applicant")]
        public async Task<IActionResult> GetAllAsync([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] AppointmentStatus? status = null, [FromQuery] AppointmentType? type = null, [FromQuery] DateOnly? from = null, [FromQuery] DateOnly? to = null, [FromQuery] string? search = null)
        {
            var result = await _appointmentService.GetAppointmentsAsync(page, pageSize, status, type, from, to, search);
            return Ok(ApiResponse<PagedResult<AppointmentDto>>.Ok(result));
        }

        /// <summary>
        /// Get a single appointment by ID
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "Receptionist,Doctor,Examiner,Manager,Admin,Security,Applicant")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var result = await _appointmentService.GetAppointmentByIdAsync(id, userId, role);
            if (result == null)
                return NotFound(ApiResponse<object>.Fail(404, "الموعد غير موجود."));
            return Ok(ApiResponse<AppointmentDto>.Ok(result));
        }

        /// <summary>
        /// Check-in, Reschedule, Cancel
        /// </summary>
        [HttpPatch("{id}/check-in")]
        [Authorize(Roles = "Receptionist,Manager,Admin")]
        [ProducesResponseType(typeof(ApiResponse<AppointmentDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> CheckInAsync(int id) 
        {
            var result = await _appointmentService.CheckInAsync(id);
            return Ok(ApiResponse<AppointmentDto>.Ok(result));
        }

        [HttpPatch("{id}/reschedule")]
        [Authorize(Roles = "Applicant,Receptionist,Examiner,Manager")]
        public async Task<IActionResult> RescheduleAsync(int id, [FromBody] RescheduleAppointmentRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var result = await _appointmentService.RescheduleAppointmentAsync(id, request, userId, role);
            return Ok(ApiResponse<AppointmentDto>.Ok(result));
        }

        [HttpPatch("{id}/cancel")]
        [Authorize(Roles = "Applicant,Receptionist")]
        public async Task<IActionResult> CancelAsync(int id, [FromBody] CancelAppointmentRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var result = await _appointmentService.CancelAppointmentAsync(id, request, userId, role);
            return Ok(ApiResponse<AppointmentDto>.Ok(result));
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