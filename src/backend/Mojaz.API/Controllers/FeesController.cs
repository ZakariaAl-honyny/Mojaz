using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.FeeStructures;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage fee structures for the Mojaz platform.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[Authorize]
public class FeesController : ControllerBase
{
    private readonly IFeeStructureService _feeStructureService;

    public FeesController(IFeeStructureService feeStructureService)
    {
        _feeStructureService = feeStructureService;
    }

    /// <summary>
    /// Get all fee structures.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<IActionResult> GetAllAsync()
    {
        var result = await _feeStructureService.GetAllAsync();
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get a single fee structure by ID.
    /// </summary>
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<FeeStructureDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetByIdAsync(int id)
    {
        var result = await _feeStructureService.GetByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Create a new fee structure.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<FeeStructureDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 409)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateFeeStructureRequest request)
    {
        var result = await _feeStructureService.CreateAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Update an existing fee structure.
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<FeeStructureDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateFeeStructureRequest request)
    {
        var result = await _feeStructureService.UpdateAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Delete a fee structure (soft delete).
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var result = await _feeStructureService.DeleteAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}