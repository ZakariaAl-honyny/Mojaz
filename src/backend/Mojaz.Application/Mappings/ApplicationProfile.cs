using AutoMapper;
using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Entities;
using Mojaz.Shared;
using DomainApplication = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Mappings;

public class ApplicationProfile : Profile
{
    public ApplicationProfile()
    {
        CreateMap<DomainApplication, ApplicationDto>() 
            .ForMember(dest => dest.LicenseCategoryNameEn, opt => opt.MapFrom(src => src.LicenseCategory != null ? src.LicenseCategory.NameEn : string.Empty))
            .ForMember(dest => dest.LicenseCategoryNameAr, opt => opt.MapFrom(src => src.LicenseCategory != null ? src.LicenseCategory.NameAr : string.Empty))
            .ForMember(dest => dest.LicenseCategoryCode, opt => opt.MapFrom(src => src.LicenseCategory != null ? src.LicenseCategory.Code.ToString() : string.Empty))
            .ForMember(dest => dest.ApplicantName, opt => opt.MapFrom(src => src.Applicant != null ? src.Applicant.FullNameAr : string.Empty));

        CreateMap<DomainApplication, ApplicationListDto>()
            .ForMember(dest => dest.LicenseCategoryNameEn, opt => opt.MapFrom(src => src.LicenseCategory != null ? src.LicenseCategory.NameEn : string.Empty))
            .ForMember(dest => dest.LicenseCategoryNameAr, opt => opt.MapFrom(src => src.LicenseCategory != null ? src.LicenseCategory.NameAr : string.Empty));
            
        CreateMap<DomainApplication, ApplicationDecisionDto>()
            .ForMember(dest => dest.Decision, opt => opt.MapFrom(src => src.FinalDecision))
            .ForMember(dest => dest.DecisionAt, opt => opt.MapFrom(src => src.FinalDecisionAt))
            .ForMember(dest => dest.DecisionBy, opt => opt.MapFrom(src => src.FinalDecisionBy)) // This will likely need a display name look-up in service, but we map the ID for now or adjust DTO
            .ForMember(dest => dest.NewStatus, opt => opt.MapFrom(src => src.Status));
            
        // Generic mapping for PagedResult and ApiResponse is typically handled via static helper methods rather than mapping.
    }
}
