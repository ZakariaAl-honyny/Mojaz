using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Mojaz.Infrastructure.Data.Seeding;
using Mojaz.Infrastructure.Persistence;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TestingController : ControllerBase
    {
        private readonly MojazDbContext _context;
        private readonly IWebHostEnvironment _env;

        public TestingController(MojazDbContext context, IWebHostEnvironment env)
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

            // First seed system settings (DbInitializer)
            await DbInitializer.SeedAsync(_context, isProduction: false);
            
            // Then seed test data
            await TestDataSeeder.SeedAsync(_context);
            return Ok(new { message = "Test data seeded successfully" });
        }

        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new { message = "Pong", environment = _env.EnvironmentName });
        }

        [HttpGet("latest-otp/{destination}")]
        public IActionResult GetLatestOtp(string destination)
        {
            if (!_env.IsDevelopment() && _env.EnvironmentName != "Testing")
            {
                return NotFound();
            }

            // For test accounts, it's hardcoded
            if (destination.EndsWith("@mojaz.gov.sa") || destination == "0500000001")
            {
                return Ok(new { code = "123456" });
            }

            // For others, if we want to support it, we'd need to store them.
            // For now, let's assume the user uses test accounts or we tell them the code.
            return Ok(new { message = "Only test accounts have observable OTPs in this env", code = "123456" });
        }
    }
}
