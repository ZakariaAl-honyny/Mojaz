using AutoMapper;
using Mojaz.Application.DTOs.Appointments;
using Mojaz.Application.DTOs.Medical;
using Mojaz.Domain.Entities;

namespace Mojaz.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Use convention-based mapping to avoid referencing unknown members on DTO/entity.
            // If you later add properties to AppointmentDto (e.g., ApplicationNumber, ApplicantName, etc.)
            // you can add explicit ForMember mappings mapping from appropriate Appointment/Application fields.
            CreateMap<Appointment, AppointmentDto>();

            // Reverse map: ignore timestamps (or any navigational properties that may not exist on DTO/entity)
            CreateMap<AppointmentDto, Appointment>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            // Medical mappings
            CreateMap<MedicalExamination, MedicalResultDto>();
        }
    }
}
