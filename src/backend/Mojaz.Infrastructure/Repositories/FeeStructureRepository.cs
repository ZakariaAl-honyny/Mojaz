using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Repositories;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DrivingLicenseIssuanceSystem.Infrastructure.Persistence.Repositories
{
    public class FeeStructureRepository : Repository<FeeStructure>, IFeeStructureRepository
    {
        public FeeStructureRepository(DrivingLicenseIssuanceSystemDbContext context) : base(context)
        {
        }

        public async Task<FeeStructure?> GetActiveFeeAsync(FeeType feeType, Guid? licenseCategoryId = null)
        {
            var now = DateTime.UtcNow;
            
            var feeStructures = await FindAsync(fs => 
                fs.FeeType == feeType && 
                fs.IsActive && 
                fs.LicenseCategoryId == licenseCategoryId && 
                fs.EffectiveFrom <= now && 
                (fs.EffectiveTo == null || fs.EffectiveTo >= now));
            
            return feeStructures.FirstOrDefault();
        }

        public async Task<IEnumerable<FeeStructure>> GetAllAsync()
        {
            return await _dbSet
                .Include(fs => fs.LicenseCategory)
                .OrderBy(fs => fs.FeeType)
                .ThenByDescending(fs => fs.EffectiveFrom)
                .ToListAsync();
        }

        public async Task<FeeStructure?> GetByIdAsync(Guid id)
        {
            return await _dbSet
                .Include(fs => fs.LicenseCategory)
                .FirstOrDefaultAsync(fs => fs.Id == id);
        }

        public async Task<FeeStructure> AddAsync(FeeStructure feeStructure)
        {
            await _dbSet.AddAsync(feeStructure);
            return feeStructure;
        }

        public async Task<FeeStructure> UpdateAsync(FeeStructure feeStructure)
        {
            _dbSet.Update(feeStructure);
            await Task.CompletedTask;
            return feeStructure;
        }
    }
}