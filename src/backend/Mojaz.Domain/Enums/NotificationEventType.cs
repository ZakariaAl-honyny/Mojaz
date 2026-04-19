namespace DrivingLicenseIssuanceSystem.Domain.Enums;

public enum NotificationEventType
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
    OtpVerified,
    PasswordReset
}
