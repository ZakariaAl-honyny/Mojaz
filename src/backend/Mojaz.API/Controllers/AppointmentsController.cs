using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Appointments;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage appointments for the Mojaz platform.
/// Handles booking, rescheduling, and cancellation of appointments.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentsController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    /// <summary>
    /// Get available slots for a specific date and branch.
    /// </summary>
    [HttpGet("available-slots")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<List<DaySlotsDto>>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> GetAvailableSlotsAsync(
        [FromQuery] AppointmentType type,
        [FromQuery] Guid branchId,
        [FromQuery] DateOnly date)
    {
        if (branchId == Guid.Empty)
        {
            return BadRequest(new ApiResponse<object> 
            { 
                Success = false, 
                Message = "Branch ID is required" 
            });
        }

        var result = await _appointmentService.GetAvailableSlotsAsync(type, branchId, date);
        return Ok(new ApiResponse<List<DaySlotsDto>> 
        { 
            Success = true, 
            Data = result, 
            Message = "Available slots retrieved successfully" 
        });
    }

    /// <summary>
    /// Get all appointments for a specific application.
    /// </summary>
    [HttpGet("application/{applicationId}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<List<AppointmentDto>>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetByApplicationAsync(Guid applicationId)
    {
        var result = await _appointmentService.GetAppointmentsByApplicationAsync(applicationId);
        return Ok(new ApiResponse<List<AppointmentDto>> 
        { 
            Success = true, 
            Data = result 
        });
    }

    /// <summary>
    /// Get a single appointment by ID.
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<AppointmentDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var result = await _appointmentService.GetAppointmentByIdAsync(id);
        if (result == null)
        {
            return NotFound(new ApiResponse<object> 
            { 
                Success = false, 
                Message = "Appointment not found" 
            });
        }
        return Ok(new ApiResponse<AppointmentDto> 
        { 
            Success = true, 
            Data = result 
        });
    }

    /// <summary>
    /// Create a new appointment (book a slot).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<AppointmentDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 409)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAppointmentRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _appointmentService.CreateAppointmentAsync(request);
            return StatusCode(201, new ApiResponse<AppointmentDto> 
            { 
                Success = true, 
                Data = result, 
                Message = "Appointment booked successfully" 
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object> 
            { 
                Success = false, 
                Message = ex.Message 
            });
        }
    }

    /// <summary>
    /// Reschedule an existing appointment.
    /// </summary>
    [HttpPatch("{id}/reschedule")]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<AppointmentDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> RescheduleAsync(Guid id, [FromBody] RescheduleAppointmentRequest request)
    {
        try
        {
            var result = await _appointmentService.RescheduleAppointmentAsync(id, request);
            return Ok(new ApiResponse<AppointmentDto> 
            { 
                Success = true, 
                Data = result, 
                Message = "Appointment rescheduled successfully" 
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object> 
            { 
                Success = false, 
                Message = ex.Message 
            });
        }
    }

    /// <summary>
    /// Cancel an existing appointment.
    /// </summary>
    [HttpPatch("{id}/cancel")]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<AppointmentDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> CancelAsync(Guid id, [FromBody] CancelAppointmentRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Reason))
            {
                return BadRequest(new ApiResponse<object> 
                { 
                    Success = false, 
                    Message = "Cancellation reason is required" 
                });
            }

            var result = await _appointmentService.CancelAppointmentAsync(id, request);
            return Ok(new ApiResponse<AppointmentDto> 
            { 
                Success = true, 
                Data = result, 
                Message = "Appointment cancelled successfully" 
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object> 
            { 
                Success = false, 
                Message = ex.Message 
            });
        }
    }

    /// <summary>
    /// Validate a booking request without actually creating the appointment.
    /// </summary>
    [HttpPost("validate")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<AppointmentValidationResult>), 200)]
    public async Task<IActionResult> ValidateAsync([FromBody] CreateAppointmentRequest request)
    {
        var result = await _appointmentService.ValidateBookingAsync(request);
        return Ok(new ApiResponse<AppointmentValidationResult> 
        { 
            Success = true, 
            Data = result 
        });
    }
}