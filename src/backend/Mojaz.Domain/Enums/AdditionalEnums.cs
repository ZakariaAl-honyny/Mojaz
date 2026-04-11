namespace Mojaz.Domain.Enums;

public enum DocumentStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

public enum AppointmentStatus
{
    Scheduled,
    Completed,
    Cancelled,
    NoShow
}

public enum LicenseStatus
{
    Active,
    Expired,
    Suspended,
    Revoked,
    Replaced,
    Renewed,
    Superseded
}

public enum DestinationType
{
    Email,
    Phone
}

public enum NotificationChannel
{
    InApp,
    Push,
    Email,
    Sms
}

public enum EmailLogStatus
{
    Sent,
    Failed,
    Bounced
}

public enum SmsLogStatus
{
    Sent,
    Failed,
    Delivered
}
