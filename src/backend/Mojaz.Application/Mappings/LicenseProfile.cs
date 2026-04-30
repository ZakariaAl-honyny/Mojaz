using AutoMapper;
using Mojaz.Application.DTOs.License;
using Mojaz.Domain.Entities;

namespace Mojaz.Application.Mappings
{
    public class LicenseProfile : Profile
    {
        public LicenseProfile()
        {
            CreateMap<License, LicenseDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.LicenseCategory != null ? src.LicenseCategory.NameAr : string.Empty));
        }
    }
}
