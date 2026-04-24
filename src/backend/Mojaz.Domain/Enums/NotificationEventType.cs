namespace Mojaz.Domain.Enums;

public enum NotificationEventType : byte
{
    ApplicationSubmitted,
    ApplicationCancelled,
    ApplicationRejected,
    StatusChanged,
    AppointmentBooked,
    AppointmentReminder,
    TestResultReady,
    PaymentDue,
    PaymentSuccess,
    PaymentConfirmed,
    LicenseIssued,
    DocumentRejected,
    FinalApprovalApproved,
    FinalApprovalRejected,
    FinalApprovalReturned,
    OtpSent,
    OtpResent,
    OtpVerified
}
