using Microsoft.EntityFrameworkCore;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Reports.Dtos;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Domain.Constants;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Type aliases to avoid namespace conflicts
using ApplicationEntity = Mojaz.Domain.Entities.Application;
using MedicalExaminationEntity = Mojaz.Domain.Entities.MedicalExamination;
using TheoryTestEntity = Mojaz.Domain.Entities.TheoryTest;
using PracticalTestEntity = Mojaz.Domain.Entities.PracticalTest;
using LicenseEntity = Mojaz.Domain.Entities.License;
using SystemSettingEntity = Mojaz.Domain.Entities.SystemSetting;
using UserEntity = Mojaz.Domain.Entities.User;

namespace Mojaz.Application.Services;

public class ReportService : IReportService
{
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<MedicalExamination> _medicalRepository;
    private readonly IRepository<TheoryTest> _theoryRepository;
    private readonly IRepository<PracticalTest> _practicalRepository;
    private readonly IRepository<License> _licenseRepository;
    private readonly IRepository<SystemSetting> _settingsRepository;
    private readonly IUnitOfWork _unitOfWork;

     public ReportService(
         IRepository<ApplicationEntity> applicationRepository,
         IRepository<MedicalExaminationEntity> medicalRepository,
         IRepository<TheoryTestEntity> theoryRepository,
         IRepository<PracticalTestEntity> practicalRepository,
         IRepository<LicenseEntity> licenseRepository,
         IRepository<SystemSettingEntity> settingsRepository,
         IUnitOfWork unitOfWork)
     {
         _applicationRepository = applicationRepository;
         _medicalRepository = medicalRepository;
         _theoryRepository = theoryRepository;
         _practicalRepository = practicalRepository;
         _licenseRepository = licenseRepository;
         _settingsRepository = settingsRepository;
         _unitOfWork = unitOfWork;
     }



     public async Task<ApiResponse<ReportSummaryDto>> GetDashboardSummaryAsync(ReportingFilter filter)
     {
         return ApiResponse<ReportSummaryDto>.Ok(new ReportSummaryDto());
     }

    public async Task<ApiResponse<List<StatusDistributionDto>>> GetStatusDistributionAsync(ReportingFilter filter)
    {
        var query = _applicationRepository.Query().AsNoTracking().Where(a => !a.IsDeleted);
        query = ApplyFilters(query, filter);

        var total = await query.CountAsync();
        if (total == 0) return ApiResponse<List<StatusDistributionDto>>.Ok(new List<StatusDistributionDto>());

        var grouped = await query.GroupBy(a => a.Status)
            .Select(g => new
            {
                Status = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        var result = grouped.Select(g => new StatusDistributionDto
        {
            Status = g.Status.ToString(),
            Count = g.Count,
            Percentage = Math.Round((double)g.Count / total * 100, 2),
            Color = GetStatusColor(g.Status)
        }).ToList();

        return ApiResponse<List<StatusDistributionDto>>.Ok(result);
    }

    public async Task<ApiResponse<List<ServiceStatsDto>>> GetServiceStatsAsync(ReportingFilter filter)
    {
        var query = _applicationRepository.Query().AsNoTracking().Where(a => !a.IsDeleted);
        query = ApplyFilters(query, filter);

        var grouped = await query.GroupBy(a => a.ServiceType)
            .Select(g => new ServiceStatsDto
            {
                ServiceType = g.Key.ToString(),
                Count = g.Count()
            })
            .ToListAsync();

        return ApiResponse<List<ServiceStatsDto>>.Ok(grouped);
    }

    public async Task<ApiResponse<PagedResult<DelayedApplicationEntry>>> GetDelayedApplicationsAsync(ReportingFilter filter, int page = 1, int pageSize = 10)
    {
        var threshold = await GetDelayedThresholdAsync();
        var cutoff = DateTime.UtcNow.AddDays(-threshold);

        var query = _applicationRepository.Query()
            .AsNoTracking()
            .Include(a => a.Applicant)
            .Include(a => a.StatusHistory)
            .Where(a => !a.IsDeleted && 
                       a.Status != ApplicationStatus.Approved && 
                       a.Status != ApplicationStatus.Rejected &&
                       a.Status != ApplicationStatus.Draft);

        query = ApplyFilters(query, filter);

        // Filter by applications stuck in their latest status for more than threshold days
        var delayedQuery = query.Where(a => a.StatusHistory
            .OrderByDescending(h => h.ChangedAt)
            .Select(h => h.ChangedAt)
            .FirstOrDefault() <= cutoff);

        var totalCount = await delayedQuery.CountAsync();
        var items = await delayedQuery
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
             .Select(a => new DelayedApplicationEntry
             {
                 ApplicationId = a.Id,
                 ApplicationNumber = a.ApplicationNumber,
                 CurrentStatus = a.Status.ToString(),
                 DaysInStage = (DateTime.UtcNow - a.StatusHistory.OrderByDescending(h => h.ChangedAt).First().ChangedAt).Days,
                 ApplicantName = a.Applicant.FullNameAr, // Primary Arabic
                 BranchName = "Main Branch" // Placeholder as Branch entity is not yet fully defined
             })
            .ToListAsync();

        return ApiResponse<PagedResult<DelayedApplicationEntry>>.Ok(new PagedResult<DelayedApplicationEntry>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

     private async Task<int> GetDelayedThresholdAsync()
     {
         var setting = await _settingsRepository.Query()
             .FirstOrDefaultAsync(s => s.SettingKey == Settings.DELAYED_APPLICATION_THRESHOLD_DAYS);
         
         return setting != null && int.TryParse(setting.SettingValue, out var val) 
             ? val 
             : 14; // Default to 14 if not set
     }

    public async Task<ApiResponse<List<TestPerformanceDto>>> GetTestPerformanceAsync(ReportingFilter filter)
    {
        var result = new List<TestPerformanceDto>();

        // Theory Tests
        var theoryQuery = _theoryRepository.Query().AsNoTracking().Where(t => !t.IsDeleted);
        if (filter.StartDate.HasValue) theoryQuery = theoryQuery.Where(t => t.ConductedAt >= filter.StartDate.Value);
        if (filter.EndDate.HasValue) theoryQuery = theoryQuery.Where(t => t.ConductedAt <= filter.EndDate.Value);

         var theoryStats = await theoryQuery
             .GroupBy(t => 1)
             .Select(g => new
             {
                 PassedCount = g.Count(x => x.Result == TestResult.Pass),
                 FailedCount = g.Count(x => x.Result == TestResult.Fail),
                 AvgScore = g.Average(x => x.Score ?? 0)
             })
             .FirstOrDefaultAsync();

          if (theoryStats != null)
          {
              var total = theoryStats.PassedCount + theoryStats.FailedCount;
              result.Add(new TestPerformanceDto
              {
                  TestType = "Theory",
                  TotalTaken = total,
                  PassedCount = theoryStats.PassedCount,
                  FailedCount = theoryStats.FailedCount,
                  PassRate = total > 0 ? Math.Round((double)theoryStats.PassedCount / total * 100, 2) : 0,
                  AverageScore = theoryStats.AvgScore
              });
          }

         // Practical Tests
         var practicalQuery = _practicalRepository.Query().AsNoTracking().Where(p => !p.IsDeleted);
         if (filter.StartDate.HasValue) practicalQuery = practicalQuery.Where(p => p.ConductedAt >= filter.StartDate.Value);
         if (filter.EndDate.HasValue) practicalQuery = practicalQuery.Where(p => p.ConductedAt <= filter.EndDate.Value);

         var practicalStats = await practicalQuery
             .GroupBy(p => 1)
             .Select(g => new
             {
                 PassedCount = g.Count(x => x.Result == TestResult.Pass),
                 FailedCount = g.Count(x => x.Result == TestResult.Fail),
                 AvgScore = g.Average(x => (double)(x.Score ?? 0)) // Assuming score might be decimal in practical
             })
             .FirstOrDefaultAsync();

          if (practicalStats != null)
          {
              var total = practicalStats.PassedCount + practicalStats.FailedCount;
              result.Add(new TestPerformanceDto
              {
                  TestType = "Practical",
                  TotalTaken = total,
                  PassedCount = practicalStats.PassedCount,
                  FailedCount = practicalStats.FailedCount,
                  PassRate = total > 0 ? Math.Round((double)practicalStats.PassedCount / total * 100, 2) : 0,
                  AverageScore = practicalStats.AvgScore
              });
          }

        return ApiResponse<List<TestPerformanceDto>>.Ok(result);
    }

    public async Task<ApiResponse<List<BranchThroughputDto>>> GetBranchThroughputAsync(ReportingFilter filter)
    {
        var query = _applicationRepository.Query().AsNoTracking().Where(a => !a.IsDeleted);
        query = ApplyFilters(query, filter);

        var grouped = await query.GroupBy(a => a.BranchId)
            .Select(g => new
            {
                BranchId = g.Key,
                Total = g.Count(),
                Approved = g.Count(x => x.Status == ApplicationStatus.Approved)
            })
            .ToListAsync();

        var result = grouped.Select(g => new BranchThroughputDto
        {
            BranchName = "Main Branch", // Placeholder until Branch entity is added
            TotalProcessed = g.Total,
            ApprovalRate = g.Total > 0 ? Math.Round((double)g.Approved / g.Total * 100, 2) : 0,
            AverageProcessingDays = 3.5 // Placeholder
        }).ToList();

        return ApiResponse<List<BranchThroughputDto>>.Ok(result);
    }

    public async Task<ApiResponse<List<EmployeeActivityDto>>> GetEmployeeActivityAsync(ReportingFilter filter)
    {
        // Join Applications with Users to get Employee names
        var query = _applicationRepository.Query()
            .AsNoTracking()
            .Where(a => !a.IsDeleted && a.FinalDecisionBy.HasValue);

        if (filter.StartDate.HasValue) query = query.Where(a => a.FinalDecisionAt >= filter.StartDate.Value);
        if (filter.EndDate.HasValue) query = query.Where(a => a.FinalDecisionAt <= filter.EndDate.Value);

        var grouped = await query.GroupBy(a => a.FinalDecisionBy)
            .Select(g => new
            {
                EmployeeId = g.Key.Value,
                Count = g.Count()
            })
            .ToListAsync();

        var employeeIds = grouped.Select(g => g.EmployeeId).ToList();
        var employees = await _unitOfWork.Repository<User>().Query()
            .Where(u => employeeIds.Contains(u.Id))
            .ToListAsync();

        var result = grouped.Select(g => 
        {
            var emp = employees.FirstOrDefault(e => e.Id == g.EmployeeId);
            return new EmployeeActivityDto
            {
                UserId = g.EmployeeId.ToString(),
                FullName = emp?.FullNameAr ?? "Unknown",
                Role = emp?.Role.ToString() ?? "Staff",
                TotalFinalized = g.Count
            };
        }).ToList();

        return ApiResponse<List<EmployeeActivityDto>>.Ok(result);
    }

    public async Task<ApiResponse<List<DailyLoadDto>>> GetIssuanceTimelineAsync(ReportingFilter filter)
    {
        var query = _applicationRepository.Query().AsNoTracking().Where(a => !a.IsDeleted);
        query = ApplyFilters(query, filter);

        var grouped = await query.GroupBy(a => a.CreatedAt.Date)
            .Select(g => new DailyLoadDto
            {
                Date = g.Key,
                Count = g.Count()
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return ApiResponse<List<DailyLoadDto>>.Ok(grouped);
    }

     private IQueryable<ApplicationEntity> ApplyFilters(IQueryable<ApplicationEntity> query, ReportingFilter filter)
     {
         if (filter.StartDate.HasValue)
             query = query.Where(a => a.CreatedAt >= filter.StartDate.Value);

         if (filter.EndDate.HasValue)
             query = query.Where(a => a.CreatedAt <= filter.EndDate.Value);

         if (filter.BranchId.HasValue)
             query = query.Where(a => a.BranchId == filter.BranchId.Value);

         if (filter.LicenseCategoryId.HasValue)
             query = query.Where(a => a.LicenseCategoryId == filter.LicenseCategoryId.Value);

         return query;
     }

    private string GetStatusColor(ApplicationStatus status)
    {
        return status switch
        {
            ApplicationStatus.Approved => "#10B981",
            ApplicationStatus.Rejected => "#EF4444",
            ApplicationStatus.Submitted => "#3B82F6",
            ApplicationStatus.Draft => "#9CA3AF",
            _ => "#F59E0B"
        };
    }

    public async Task<byte[]> ExportReportsToCsvAsync(ReportingFilter filter)
    {
        var statusData = await GetStatusDistributionAsync(filter);
        var serviceData = await GetServiceStatsAsync(filter);
        
        var csv = new System.Text.StringBuilder();
        csv.AppendLine("Report Type,Value,Count,Percentage");
        
        if (statusData.Data != null)
        {
            foreach (var item in statusData.Data)
            {
                csv.AppendLine($"Status,{item.Status},{item.Count},{item.Percentage}");
            }
        }
        
        if (serviceData.Data != null)
        {
            foreach (var item in serviceData.Data)
            {
                csv.AppendLine($"Service,{item.ServiceType},{item.Count},0");
            }
        }
        
        return System.Text.Encoding.UTF8.GetBytes(csv.ToString());
    }
}
