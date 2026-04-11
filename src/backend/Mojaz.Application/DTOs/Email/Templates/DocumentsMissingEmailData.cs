namespace Mojaz.Application.DTOs.Email.Templates
{
    public class DocumentsMissingEmailData
    {
        public string ApplicationId { get; set; } = string.Empty;
        public string ApplicationNumber { get; set; } = string.Empty;
        public List<string> MissingDocumentsAr { get; set; } = new();
        public List<string> MissingDocumentsEn { get; set; } = new();
        public string DeadlineDate { get; set; } = string.Empty;
        public string DeadlineDateAr { get; set; } = string.Empty;
        public string DeadlineDateEn { get; set; } = string.Empty;
    }
}
