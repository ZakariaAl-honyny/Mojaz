using Mojaz.Application.DTOs.Application;
using Mojaz.Shared;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IFinalApprovalService
{
    Task<ApiResponse<Gate4ValidationResultDto>> GetGate4StatusAsync(int applicationId, int managerId);
    Task<ApiResponse<ApplicationDecisionDto>> FinalizeAsync(int applicationId, FinalizeApplicationRequest request, int managerId);
}