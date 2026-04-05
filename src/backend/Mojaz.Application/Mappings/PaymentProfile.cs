using AutoMapper;
using Mojaz.Application.DTOs.Payment;
using Mojaz.Domain.Entities;

namespace Mojaz.Application.Mappings;

public class PaymentProfile : Profile
{
    public PaymentProfile()
    {
        CreateMap<Payment, PaymentDto>();
    }
}
