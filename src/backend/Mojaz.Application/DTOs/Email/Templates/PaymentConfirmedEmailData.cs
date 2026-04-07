namespace Mojaz.Application.DTOs.Email.Templates
{
    public class PaymentConfirmedEmailData
    {
        public string Amount { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public string ReferenceNumber { get; set; } = string.Empty;
        public string TransactionReference { get; set; } = string.Empty;
        public string FeeTypeAr { get; set; } = string.Empty;
        public string FeeTypeEn { get; set; } = string.Empty;
        public string PaymentDateAr { get; set; } = string.Empty;
        public string PaymentDateEn { get; set; } = string.Empty;
    }
}
