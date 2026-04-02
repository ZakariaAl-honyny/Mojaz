---
description: ASP.NET Core backend development rules
globs: ["src/backend/**/*.cs"]
alwaysApply: true
---

# Backend Development Rules

## Architecture
- Layer: Domain (entities, enums, interfaces)
- Layer: Shared (ApiResponse, PagedResult, exceptions)  
- Layer: Application (services, DTOs, validators, profiles)
- Layer: Infrastructure (EF Core, repositories, external services)
- Layer: API (controllers, middleware, Program.cs)

## Naming
- Classes/Methods: PascalCase
- Private fields: _camelCase
- Interfaces: IPascalCase
- Async methods: end with Async
- DTOs: CreateXxxRequest, XxxDto, XxxListDto, XxxResponse
- Validators: XxxValidator

## Patterns
- Repository<T> + UnitOfWork for data access
- FluentValidation for ALL request DTOs
- AutoMapper for entity ↔ DTO mapping
- Hangfire for background jobs (notifications)
- Serilog for structured logging

## Controller Template
```csharp
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class XxxController : ControllerBase
{
    private readonly IXxxService _xxxService;
    
    public XxxController(IXxxService xxxService)
    {
        _xxxService = xxxService;
    }

    [HttpPost]
    [Authorize(Roles = "...")]
    [ProducesResponseType(typeof(ApiResponse<XxxDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateXxxRequest request)
    {
        var result = await _xxxService.CreateAsync(request);
        return StatusCode(result.StatusCode, result);
    }
}
Service Template
csharp

public class XxxService : IXxxService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuditService _auditService;
    
    public async Task<ApiResponse<XxxDto>> CreateAsync(CreateXxxRequest request)
    {
        // 1. Validate (FluentValidation handles this via pipeline)
        // 2. Business logic
        // 3. Map to entity
        // 4. Save via UnitOfWork
        // 5. Audit log
        // 6. Notifications (if applicable)
        // 7. Map to DTO and return
    }
}
```