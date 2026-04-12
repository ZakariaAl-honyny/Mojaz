using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Mojaz.API.Extensions;
using Mojaz.API.Filters;
using Mojaz.API.Middleware;
using Mojaz.Application.Extensions;
using Mojaz.Infrastructure;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ─── Serilog Configuration ───
builder.Host.UseSerilog((context, config) =>
{
    config
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.File(
            "logs/mojaz_.log",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 30);
});

// ─── Layer Registrations ───
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// ─── Controllers & Filters ───
builder.Services.AddControllers(options => 
{
    options.Filters.Add<ValidationFilter>();
});

builder.Services.AddHttpContextAccessor();

// ─── JWT Authentication ───
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? "MojazSuperSecretKeyForDevelopment2025!@#$%")),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "Mojaz",
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"] ?? "MojazClients",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// ─── Modular Extensions (Phase 3 Fix) ───
builder.Services.AddMojazCors(builder.Configuration);
builder.Services.AddMojazSwagger();

// ─── Health Checks ───
builder.Services.AddHealthChecks();

var app = builder.Build();

// ─── Middleware Pipeline (Modularized) ───

app.UseMojazSecurityHeaders();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseMojazSwagger();
}

app.UseMojazExceptionHandler();
app.UseMojazRequestLogging();

app.UseHttpsRedirection();
app.UseMojazCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseMojazAuditLogging();

app.MapControllers();
app.MapHealthChecks("/health").AllowAnonymous();

app.Run();

// Make Program public for testing
public partial class Program;
