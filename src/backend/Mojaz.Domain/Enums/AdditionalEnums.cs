namespace Mojaz.Domain.Enums;

public enum DocumentStatus : byte
{
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

public enum AppointmentStatus : byte
{
    Scheduled,
    Completed,
    Cancelled,
    NoShow
}

public enum LicenseStatus : byte
{
    Active,
    Expired,
    Suspended,
    Revoked,
    Replaced,
    Renewed,
    Superseded
}

public enum DestinationType : byte
{
    Email,
    Phone
}

public enum NotificationChannel : byte
{
    InApp,
    Push,
    Email,
    Sms
}

public enum EmailLogStatus : byte
{
    Sent,
    Failed,
    Bounced
}

public enum SmsLogStatus : byte
{
    Sent,
    Failed,
    Delivered
}
