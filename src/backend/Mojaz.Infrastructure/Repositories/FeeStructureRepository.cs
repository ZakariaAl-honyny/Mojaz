using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Infrastructure.Persistence.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Persistence.Repositories
{
    public class FeeStructureRepository : Repository<FeeStructure>, IFeeStructureRepository
    {
        public FeeStructureRepository(MojazDbContext context) : base(context)
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
    }
}