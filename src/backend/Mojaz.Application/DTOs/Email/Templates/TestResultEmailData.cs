namespace Mojaz.Application.DTOs.Email.Templates
{
    public class TestResultEmailData
    {
        public bool IsTheoryTest { get; set; }
        public bool IsPassed { get; set; }
        public string? Score { get; set; }
        public string? MaxScore { get; set; }
        public string? TestTypeAr { get; set; }
        public string? TestTypeEn { get; set; }
        public string? ResultAr { get; set; }
        public string? ResultEn { get; set; }
        public string? TestDateAr { get; set; }
        public string? TestDateEn { get; set; }
    }
}
