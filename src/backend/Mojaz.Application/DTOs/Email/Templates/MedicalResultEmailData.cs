namespace Mojaz.Application.DTOs.Email.Templates
{
    public class MedicalResultEmailData
    {
        public string ApplicationNumber { get; set; } = string.Empty;
        public bool IsFit { get; set; }
        public string ResultAr { get; set; } = string.Empty;
        public string ResultEn { get; set; } = string.Empty;
        public string DoctorNameAr { get; set; } = string.Empty;
        public string DoctorNameEn { get; set; } = string.Empty;
        public string BloodGroup { get; set; } = string.Empty;
        public string NotesAr { get; set; } = string.Empty;
        public string NotesEn { get; set; } = string.Empty;
        public List<string> NextStepsAr { get; set; } = new();
        public List<string> NextStepsEn { get; set; } = new();
    }
}
