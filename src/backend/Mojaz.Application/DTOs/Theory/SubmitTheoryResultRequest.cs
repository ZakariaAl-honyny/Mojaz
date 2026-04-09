namespace Mojaz.Application.DTOs.Theory
{
    public class SubmitTheoryResultRequest
    {
        public int? Score { get; set; }
        public bool IsAbsent { get; set; }
        public string? Notes { get; set; }
    }
}
