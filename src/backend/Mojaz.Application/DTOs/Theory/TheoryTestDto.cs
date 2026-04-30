using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Application.DTOs.Theory
{
    public class TheoryTestDto
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public int AttemptNumber { get; set; }
        public int? Score { get; set; }
        public int PassingScore { get; set; }
        public string Result { get; set; } = string.Empty;
        public bool IsPassed { get; set; }
        public bool IsAbsent { get; set; }
        public DateTime ConductedAt { get; set; }
        public int ExaminerId { get; set; }
        public string? ExaminerName { get; set; }
        public string? Notes { get; set; }
        public DateTime? RetakeEligibleAfter { get; set; }
        public string? ApplicationStatus { get; set; }
    }
}
