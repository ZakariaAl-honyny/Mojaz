using AutoMapper;
using Mojaz.Application.DTOs.Training;
using Mojaz.Domain.Entities;

namespace Mojaz.Application.Mappings
{
    public class TrainingProfile : Profile
    {
        public TrainingProfile()
        {
            CreateMap<TrainingRecord, TrainingRecordDto>()
                .ForMember(dest => dest.ProgressPercentage, opt => opt.Ignore()); // Computed property
            
            CreateMap<CreateTrainingRecordRequest, TrainingRecord>()
                .ForMember(dest => dest.CompletedHours, opt => opt.MapFrom(src => src.HoursCompleted))
                .ForMember(dest => dest.TrainingDate, opt => opt.MapFrom(src => src.TrainingDate))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
                
            CreateMap<UpdateTrainingHoursRequest, TrainingRecord>()
                .ForAllMembers(opts => opts.Ignore()); // Will be handled manually in service
        }
    }
}