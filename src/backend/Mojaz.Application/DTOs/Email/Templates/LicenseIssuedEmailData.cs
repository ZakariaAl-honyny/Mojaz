namespace Mojaz.Application.DTOs.Email.Templates
{
    public class LicenseIssuedEmailData
    {
        public string LicenseNumber { get; set; } = string.Empty;
        public string DownloadUrl { get; set; } = string.Empty;
        public string RecipientNameAr { get; set; } = string.Empty;
        public string RecipientNameEn { get; set; } = string.Empty;
        public string ExpiryDateAr { get; set; } = string.Empty;
        public string ExpiryDateEn { get; set; } = string.Empty;
        public string CategoryAr { get; set; } = string.Empty;
        public string CategoryEn { get; set; } = string.Empty;
    }
}
