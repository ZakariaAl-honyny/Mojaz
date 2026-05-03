namespace Mojaz.Domain.Enums;

public enum ServiceType : byte
{
    NewLicense = 0,
    Renewal = 1,
    Replacement = 2,
    CategoryUpgrade = 3,
    InternationalLicense = 4,
    StatusChange = 5,
    MedicalExtension = 6,
    TemporaryLicense = 7,
    TestRetake = 8
}
