using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Enums;
using Mojaz.Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IApplicationService
{
    Task<ApiResponse<ApplicationDto>> CreateAsync(CreateApplicationRequest request, Guid userId);
    Task<ApiResponse<ApplicationDto>> GetByIdAsync(Guid id, Guid userId, string role);
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetListAsync(Guid userId, string role, int page = 1, int pageSize = 20);
    Task<ApiResponse<bool>> UpdateAsync(Guid id, UpdateApplicationRequest request, Guid userId);
    Task<ApiResponse<bool>> UpdateStatusAsync(Guid id, ApplicationStatus status, string reason, Guid userId);
    Task<ApiResponse<bool>> CancelAsync(Guid id, string reason, Guid userId);
    Task<bool> IsOwnerAsync(Guid applicationId, Guid userId);
}
