namespace Mojaz.Application.DTOs.Email.Templates
{
    public class ApplicationReceivedEmailData
    {
        public required string ApplicationNumber { get; set; } = default!;
        public required string ServiceTypeAr { get; set; } = default!;
        public required string ServiceTypeEn { get; set; } = default!;
        public required List<string> NextStepsAr { get; set; } = default!;
        public required List<string> NextStepsEn { get; set; } = default!;
    }
}
