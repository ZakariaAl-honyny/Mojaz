namespace Mojaz.Application.DTOs.Email.Templates
{
    public class TestResultEmailData
    {
        public bool IsTheoryTest { get; set; }
        public bool IsPassed { get; set; }
        public string Score { get; set; } = string.Empty;
        public string MaxScore { get; set; } = string.Empty;
        public string TestTypeAr { get; set; } = string.Empty;
        public string TestTypeEn { get; set; } = string.Empty;
        public string ResultAr { get; set; } = string.Empty;
        public string ResultEn { get; set; } = string.Empty;
        public string TestDateAr { get; set; } = string.Empty;
        public string TestDateEn { get; set; } = string.Empty;
    }
}
