namespace Mojaz.Application.DTOs.Email.Templates
{
    public class PaymentConfirmedEmailData
    {
        public string? Amount { get; set; }
        public string? Currency { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? TransactionReference { get; set; }
        public string? FeeTypeAr { get; set; }
        public string? FeeTypeEn { get; set; }
        public string? PaymentDateAr { get; set; }
        public string? PaymentDateEn { get; set; }
    }
}
