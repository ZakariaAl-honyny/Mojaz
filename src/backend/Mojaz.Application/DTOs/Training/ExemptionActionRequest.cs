using System;

namespace Mojaz.Application.DTOs.Training
{
    public class ExemptionActionRequest
    {
        public int ActionBy { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}