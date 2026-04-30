using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.FeeStructures;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;

namespace Mojaz.Application.Services;

public class FeeStructureService : IFeeStructureService
{
    private readonly IRepository<FeeStructure> _feeStructureRepository;
    private readonly IRepository<LicenseCategory> _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public FeeStructureService(
        IRepository<FeeStructure> feeStructureRepository,
        IRepository<LicenseCategory> categoryRepository,
        IUnitOfWork unitOfWork)
    {
        _feeStructureRepository = feeStructureRepository;
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<List<FeeStructureDto>>> GetAllAsync()
    {
        var fees = await _feeStructureRepository.FindAsync(f => true);
        var feeList = fees.ToList();
        
        var categories = await _categoryRepository.FindAsync(c => true);
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.NameAr);

        var dtos = feeList.Select(f => MapToDto(f, categoryDict)).ToList();
        
        return ApiResponse<List<FeeStructureDto>>.Ok(dtos, "تم استرجاع قائمة الأسعار بنجاح.");
    }

    public async Task<ApiResponse<FeeStructureDto>> GetByIdAsync(int id)
    {
        var fee = await _feeStructureRepository.GetByIdAsync(id);
        if (fee == null)
        {
            return ApiResponse<FeeStructureDto>.NotFound("الرسوم المطلوبة غير موجودة.");
        }

        var categories = await _categoryRepository.FindAsync(c => true);
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.NameAr);

        return ApiResponse<FeeStructureDto>.Ok(MapToDto(fee, categoryDict), "تم استرجاع بيانات الرسوم بنجاح.");
    }

    public async Task<ApiResponse<FeeStructureDto>> CreateAsync(CreateFeeStructureRequest request)
    {
        // Check for duplicate active fee
        var existingFees = await _feeStructureRepository.FindAsync(f =>
            f.FeeType == request.FeeType &&
            f.LicenseCategoryId == request.LicenseCategoryId &&
            f.IsActive);

        if (existingFees.Any())
        {
            return ApiResponse<FeeStructureDto>.Fail(409, "يوجد رسم نشط من نفس النوع والفئة. يرجى تحديث الرسم الموجود أو تعطيله أولاً.");
        }

        var fee = new FeeStructure
        {
            FeeType = request.FeeType,
            LicenseCategoryId = request.LicenseCategoryId,
            Amount = request.Amount,
            Currency = request.Currency,
            EffectiveFrom = request.EffectiveFrom,
            EffectiveTo = request.EffectiveTo,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _feeStructureRepository.AddAsync(fee);
        await _unitOfWork.SaveChangesAsync();

        var categories = await _categoryRepository.FindAsync(c => true);
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.NameAr);

        return ApiResponse<FeeStructureDto>.Created(MapToDto(fee, categoryDict), "تم إنشاء الرسم بنجاح.");
    }

    public async Task<ApiResponse<FeeStructureDto>> UpdateAsync(int id, UpdateFeeStructureRequest request)
    {
        var fee = await _feeStructureRepository.GetByIdAsync(id);
        if (fee == null)
        {
            return ApiResponse<FeeStructureDto>.NotFound("الرسوم المطلوبة غير موجودة.");
        }

        if (request.FeeType.HasValue)
            fee.FeeType = request.FeeType.Value;
        
        if (request.LicenseCategoryId.HasValue)
            fee.LicenseCategoryId = request.LicenseCategoryId;
        
        if (request.Amount.HasValue)
            fee.Amount = request.Amount.Value;
        
        if (!string.IsNullOrEmpty(request.Currency))
            fee.Currency = request.Currency;
        
        if (request.EffectiveFrom.HasValue)
            fee.EffectiveFrom = request.EffectiveFrom.Value;
        
        if (request.EffectiveTo.HasValue)
            fee.EffectiveTo = request.EffectiveTo.Value;
        
        if (request.IsActive.HasValue)
            fee.IsActive = request.IsActive.Value;

        fee.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();

        var categories = await _categoryRepository.FindAsync(c => true);
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.NameAr);

        return ApiResponse<FeeStructureDto>.Ok(MapToDto(fee, categoryDict), "تم تحديث الرسم بنجاح.");
    }

    public async Task<ApiResponse<object>> DeleteAsync(int id)
    {
        var fee = await _feeStructureRepository.GetByIdAsync(id);
        if (fee == null)
        {
            return ApiResponse<object>.NotFound("الرسوم المطلوبة غير موجودة.");
        }

        // Soft delete
        fee.IsDeleted = true;
        fee.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<object>.Ok(null, "تم حذف الرسم بنجاح.");
    }

    private FeeStructureDto MapToDto(FeeStructure fee, Dictionary<int, string> categoryDict)
    {
        return new FeeStructureDto
        {
            Id = fee.Id,
            FeeType = fee.FeeType,
            FeeTypeName = fee.FeeType.ToString(),
            LicenseCategoryId = fee.LicenseCategoryId,
            LicenseCategoryName = fee.LicenseCategoryId.HasValue && categoryDict.ContainsKey(fee.LicenseCategoryId.Value)
                ? categoryDict[fee.LicenseCategoryId.Value]
                : null,
            Amount = fee.Amount,
            Currency = fee.Currency,
            EffectiveFrom = fee.EffectiveFrom,
            EffectiveTo = fee.EffectiveTo,
            IsActive = fee.IsActive,
            CreatedAt = fee.CreatedAt,
            UpdatedAt = fee.UpdatedAt
        };
    }
}