using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Domain.Entities;

public class PracticalTest : SoftDeletableEntity
{
    public Guid ApplicationId { get; set; }
    public Guid ExaminerId { get; set; }
    public int AttemptNumber { get; set; }
    public DateTime ConductedAt { get; set; } = DateTime.UtcNow;
    public int? Score { get; set; }
    public int PassingScore { get; set; }
    public bool IsAbsent { get; set; } = false;
    public TestResult Result { get; set; }
    public string? Notes { get; set; }
    public string? VehicleUsed { get; set; }
    public bool RequiresAdditionalTraining { get; set; }
    public int? AdditionalHoursRequired { get; set; }

    public virtual Application Application { get; set; } = null!;
    public virtual User Examiner { get; set; } = null!;
}
