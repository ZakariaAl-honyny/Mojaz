using Mojaz.Application.DTOs.Medical;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using AutoMapper;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Services;

/// <summary>
/// Service for medical examination operations
/// </summary>
public class MedicalService : IMedicalService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ISystemSettingsService _systemSettingsService;

    public MedicalService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ISystemSettingsService systemSettingsService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _systemSettingsService = systemSettingsService;
    }

    /// <summary>
    /// Creates a medical examination result
    /// </summary>
    public async Task<ApiResponse<MedicalResultDto>> CreateMedicalResultAsync(
        CreateMedicalResultRequest request, 
        Guid doctorId)
    {
        // Verify application exists and belongs to applicant
        var application = await _unitOfWork.Repository<Mojaz.Domain.Entities.Application>().GetByIdAsync(request.ApplicationId);
        if (application == null)
        {
            return ApiResponse<MedicalResultDto>.NotFound("Application not found");
        }

        // Verify appointment exists
        var appointment = await _unitOfWork.Repository<Mojaz.Domain.Entities.Appointment>().GetByIdAsync(request.AppointmentId);
        if (appointment == null)
        {
            return ApiResponse<MedicalResultDto>.NotFound("Appointment not found");
        }

        // Check if medical examination already exists for this application
        var existingExam = await _unitOfWork.Repository<MedicalExamination>().FindAsync(x => x.ApplicationId == request.ApplicationId && !x.IsDeleted);
        if (existingExam != null && await _unitOfWork.Repository<MedicalExamination>().CountAsync(x => x.ApplicationId == request.ApplicationId && !x.IsDeleted) > 0)
        {
            return ApiResponse<MedicalResultDto>.Fail("Medical examination already exists for this application", 409);
        }

        // Calculate validity period
        int validityDays = await _systemSettingsService.GetIntAsync("MEDICAL_VALIDITY_DAYS") ?? 90;
        DateTime validUntil = DateTime.UtcNow.AddDays(validityDays);

        // Create medical examination entity
        var medicalExam = new MedicalExamination
        {
            ApplicationId = request.ApplicationId,
            DoctorId = doctorId,
            ExaminedAt = DateTime.UtcNow,
            FitnessResult = request.Result,
            BloodType = request.BloodType,
            Notes = request.Notes,
            ValidUntil = validUntil
        };

        // Add to repository
        await _unitOfWork.Repository<MedicalExamination>().AddAsync(medicalExam);
        await _unitOfWork.SaveChangesAsync();

        // Map to DTO
        var resultDto = _mapper.Map<MedicalResultDto>(medicalExam);
        
        return ApiResponse<MedicalResultDto>.Created(resultDto, "Medical examination result created successfully");
    }

    /// <summary>
    /// Gets medical examination result by application ID
    /// </summary>
    public async Task<ApiResponse<MedicalResultDto>> GetByApplicationIdAsync(Guid applicationId)
    {
        var medicalExam = await _unitOfWork.Repository<MedicalExamination>()
            .FindAsync(x => x.ApplicationId == applicationId && !x.IsDeleted);

        if (medicalExam == null || medicalExam.Count == 0)
        {
            return ApiResponse<MedicalResultDto>.NotFound("Medical examination not found for this application");
        }

        var resultDto = _mapper.Map<MedicalResultDto>(medicalExam[0]);
        return ApiResponse<MedicalResultDto>.Ok(resultDto);
    }

    /// <summary>
    /// Updates the medical examination result
    /// </summary>
    public async Task<ApiResponse<MedicalResultDto>> UpdateResultAsync(
        Guid id, 
        MedicalFitnessResult result, 
        string? notes)
    {
        var medicalExam = await _unitOfWork.Repository<MedicalExamination>().GetByIdAsync(id);
        if (medicalExam == null)
        {
            return ApiResponse<MedicalResultDto>.NotFound("Medical examination not found");
        }

        // Update fields
        medicalExam.FitnessResult = result;
        if (!string.IsNullOrWhiteSpace(notes))
        {
            medicalExam.Notes = notes;
        }
        medicalExam.UpdatedAt = DateTime.UtcNow;

        // Update in repository
        _unitOfWork.Repository<MedicalExamination>().Update(medicalExam);
        await _unitOfWork.SaveChangesAsync();

        // Map to DTO
        var resultDto = _mapper.Map<MedicalResultDto>(medicalExam);
        return ApiResponse<MedicalResultDto>.Ok(resultDto, "Medical examination result updated successfully");
    }
}