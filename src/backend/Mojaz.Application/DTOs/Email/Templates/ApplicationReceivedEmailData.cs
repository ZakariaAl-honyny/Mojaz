namespace Mojaz.Application.DTOs.Email.Templates
{
    public class ApplicationReceivedEmailData
    {
        public string ApplicationNumber { get; set; }
        public string ServiceTypeAr { get; set; }
        public string ServiceTypeEn { get; set; }
        public List<string> NextStepsAr { get; set; }
        public List<string> NextStepsEn { get; set; }
    }
}
