using AutoMapper;
using Mojaz.Application.DTOs.Theory;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.Mappings
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
