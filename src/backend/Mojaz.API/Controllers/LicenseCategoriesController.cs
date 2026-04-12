using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.DTOs.Application;
using Mojaz.Shared.Models;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

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
