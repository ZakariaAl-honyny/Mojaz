using System;

namespace DrivingLicenseIssuanceSystem.Application.Reports.Dtos;

public class DailyLoadDto
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
}
