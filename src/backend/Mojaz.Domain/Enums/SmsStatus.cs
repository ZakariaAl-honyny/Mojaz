namespace Mojaz.Domain.Enums
{
    public enum SmsStatus : byte
    {
        Pending = 0,
        Sent = 1,
        Failed = 2,
        Retrying = 3
    }
}