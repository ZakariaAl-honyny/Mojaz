namespace Mojaz.Application.DTOs.Email.Templates
{
    public class ApplicationDecisionEmailData
    {
        public string ApplicationNumber { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public string DecisionAr { get; set; } = string.Empty;
        public string DecisionEn { get; set; } = string.Empty;
        public string ReasonAr { get; set; } = string.Empty;
        public string ReasonEn { get; set; } = string.Empty;
        public string DecisionDateAr { get; set; } = string.Empty;
        public string DecisionDateEn { get; set; } = string.Empty;
        public string NotesAr { get; set; } = string.Empty;
        public string NotesEn { get; set; } = string.Empty;
    }
}
