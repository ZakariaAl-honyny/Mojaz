using AutoMapper;
using DrivingLicenseIssuanceSystem.Application.DTOs.License;
using DrivingLicenseIssuanceSystem.Domain.Entities;

namespace DrivingLicenseIssuanceSystem.Application.Mappings
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
