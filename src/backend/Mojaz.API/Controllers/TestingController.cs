using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using DrivingLicenseIssuanceSystem.Infrastructure.Data.Seeding;
using DrivingLicenseIssuanceSystem.Infrastructure.Persistence;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TestingController : ControllerBase
    {
        private readonly DrivingLicenseIssuanceSystemDbContext _context;
        private readonly IWebHostEnvironment _env;

        public TestingController(DrivingLicenseIssuanceSystemDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("seed")]
        public async Task<IActionResult> Seed()
        {
            if (!_env.IsDevelopment() && _env.EnvironmentName != "Testing")
            {
                return NotFound();
            }

            await TestDataSeeder.SeedAsync(_context);
            return Ok(new { message = "Test data seeded successfully" });
        }

        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new { message = "Pong", environment = _env.EnvironmentName });
        }
    }
}
