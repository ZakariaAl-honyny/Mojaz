using System.Threading.Tasks;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Interfaces.Repositories
{
    public interface IFeeStructureRepository
    {
        Task<FeeStructure?> GetActiveFeeAsync(FeeType feeType, Guid? licenseCategoryId = null);
    }
}