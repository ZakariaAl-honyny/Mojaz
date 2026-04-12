namespace Mojaz.Application.DTOs.Email.Templates
{
    public class PasswordRecoveryEmailData
    {
        public string OtpCode { get; set; } = string.Empty;
        public int ExpiryMinutes { get; set; }
        public string ExpiryTime { get; set; } = string.Empty;
        public string RecipientNameAr { get; set; } = string.Empty;
        public string RecipientNameEn { get; set; } = string.Empty;
    }
}
