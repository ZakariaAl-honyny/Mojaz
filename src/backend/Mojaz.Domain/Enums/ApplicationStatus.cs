namespace Mojaz.Domain.Enums;

public enum ApplicationStatus : byte
{
    Draft,
    Submitted,
    DocumentReview,
    InReview,
    MedicalExam,
    Training,
    TheoryTest,
    PracticalTest,
    Approved,
    Payment,
    Issued,
    Active,
    Rejected,
    Cancelled,
    Expired
}
