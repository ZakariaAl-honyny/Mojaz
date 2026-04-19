using AutoMapper;
using DrivingLicenseIssuanceSystem.Application.DTOs.Payment;
using DrivingLicenseIssuanceSystem.Domain.Entities;

namespace DrivingLicenseIssuanceSystem.Application.Mappings;

public class PaymentProfile : Profile
{
    public PaymentProfile()
    {
        CreateMap<PaymentTransaction, PaymentDto>();
    }
}
