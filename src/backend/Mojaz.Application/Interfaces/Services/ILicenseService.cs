using Mojaz.Shared.Models;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface ILicenseService
{
    Task<ApiResponse<bool>> IssueLicenseAsync(Guid applicationId, Guid userId);
}
