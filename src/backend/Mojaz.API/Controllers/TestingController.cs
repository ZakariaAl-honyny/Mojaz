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
