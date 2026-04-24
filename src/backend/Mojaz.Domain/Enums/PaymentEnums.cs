namespace Mojaz.Domain.Enums;

public enum FeeType : byte
{
    ApplicationFee,
    MedicalExamFee,
    TheoryTestFee,
    PracticalTestFee,
    IssuanceFee,
    RetakeFee,
    RenewalFee,
    ReplacementFee,
    CategoryUpgrade
}

public enum PaymentStatus : byte
{
    Pending,
    Paid,
    Failed,
    Refunded
}
