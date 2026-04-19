using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Repositories;

public interface IFeeStructureRepository
{
    Task<FeeStructure?> GetActiveFeeAsync(FeeType feeType, Guid? licenseCategoryId = null);
    Task<IEnumerable<FeeStructure>> GetAllAsync();
    Task<FeeStructure?> GetByIdAsync(Guid id);
    Task<FeeStructure> AddAsync(FeeStructure feeStructure);
    Task<FeeStructure> UpdateAsync(FeeStructure feeStructure);
}