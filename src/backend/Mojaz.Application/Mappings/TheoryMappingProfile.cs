using AutoMapper;
using DrivingLicenseIssuanceSystem.Application.DTOs.Theory;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;

namespace DrivingLicenseIssuanceSystem.Application.Mappings
{
    public class TheoryMappingProfile : Profile
    {
        public TheoryMappingProfile()
        {
            CreateMap<TheoryTest, TheoryTestDto>()
                .ForMember(dest => dest.IsPassed, opt => opt.MapFrom(src => src.Result == TestResult.Pass))
                .ForMember(dest => dest.Result, opt => opt.MapFrom(src => src.Result.ToString()))
                .ForMember(dest => dest.ExaminerName, opt => opt.MapFrom(src => src.Examiner.FullNameEn))
                .ForMember(dest => dest.ApplicationStatus, opt => opt.MapFrom(src => src.Application.Status.ToString()));
        }
    }
}
