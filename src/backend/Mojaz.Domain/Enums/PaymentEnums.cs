namespace Mojaz.Domain.Enums;

public enum FeeType
{
    ApplicationFee,
    MedicalExamFee,
    TheoryTestFee,
    PracticalTestFee,
    IssuanceFee,
    RetakeFee,
    RenewalFee,
    ReplacementFee
}

public enum PaymentStatus
{
    Pending,
    Paid,
    Failed,
    Refunded
}
