using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Mojaz.Application.DTOs.FeeStructures;
using Mojaz.Shared;

namespace Mojaz.Application.Interfaces.Services;

public interface IFeeStructureService
{
    Task<ApiResponse<List<FeeStructureDto>>> GetAllAsync();
    Task<ApiResponse<FeeStructureDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<FeeStructureDto>> CreateAsync(CreateFeeStructureRequest request);
    Task<ApiResponse<FeeStructureDto>> UpdateAsync(Guid id, UpdateFeeStructureRequest request);
    Task<ApiResponse<object>> DeleteAsync(Guid id);
}