using AutoMapper;
using Mojaz.Application.DTOs.Appointments;
using Mojaz.Domain.Entities;

namespace Mojaz.Application.Mappings
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
        }
    }
}
