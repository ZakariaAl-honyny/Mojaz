using Microsoft.AspNetCore.Mvc;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Services;
using DrivingLicenseIssuanceSystem.Application.DTOs.Application;
using DrivingLicenseIssuanceSystem.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class LicenseCategoriesController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public LicenseCategoriesController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    /// <summary>
    /// Get all active license categories
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<LicenseCategoryDto>>), 200)]
    public async Task<IActionResult> GetAll()
    {
        var result = await _applicationService.GetLicenseCategoriesAsync();
        return Ok(result);
    }
}
