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
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
        }
    }
}
