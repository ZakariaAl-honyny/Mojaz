using System;

namespace Mojaz.Application.DTOs.Training
{
    public class UpdateTrainingHoursRequest
    {
        public int HoursToAdd { get; set; }
        public string? Notes { get; set; }
    }
}