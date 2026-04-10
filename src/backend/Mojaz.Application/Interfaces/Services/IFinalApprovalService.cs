using Mojaz.Application.DTOs.Application;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IFinalApprovalService
{
    Task<ApiResponse<Gate4ValidationResultDto>> GetGate4StatusAsync(Guid applicationId, Guid managerId);
    Task<ApiResponse<ApplicationDecisionDto>> FinalizeAsync(Guid applicationId, FinalizeApplicationRequest request, Guid managerId);
}