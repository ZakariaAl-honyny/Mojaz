using AutoMapper;
using Mojaz.Application.DTOs.Practical;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Mappings;

/// <summary>
/// AutoMapper profile for PracticalTest mappings
/// </summary>
public class PracticalMappingProfile : Profile
{
    public PracticalMappingProfile()
    {
        CreateMap<PracticalTest, PracticalTestDto>()
            .ForMember(dest => dest.IsPassed, opt => opt.MapFrom(src => src.Result == TestResult.Pass))
            .ForMember(dest => dest.Result, opt => opt.MapFrom(src => src.Result.ToString()))
            .ForMember(dest => dest.ExaminerName, opt => opt.Ignore())
            .ForMember(dest => dest.RetakeEligibleAfter, opt => opt.Ignore())
            .ForMember(dest => dest.ApplicationStatus, opt => opt.Ignore());
    }
}