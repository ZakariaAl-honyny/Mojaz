using AutoMapper;
using DrivingLicenseIssuanceSystem.Application.DTOs.Appointments;
using DrivingLicenseIssuanceSystem.Application.DTOs.Medical;
using DrivingLicenseIssuanceSystem.Domain.Entities;

namespace DrivingLicenseIssuanceSystem.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Appointment mappings
            CreateMap<Appointment, AppointmentDto>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt));
            
            CreateMap<AppointmentDto, Appointment>();

            // Medical mappings
            CreateMap<MedicalExamination, MedicalResultDto>();
        }
    }
}
