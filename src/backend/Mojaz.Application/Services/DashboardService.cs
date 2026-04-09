using Microsoft.EntityFrameworkCore;
using Mojaz.Application.Applications.Dtos;
using Mojaz.Application.Dashboards.Dtos;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Models;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<Notification> _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DashboardService(
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<Notification> notificationRepository,
        IUnitOfWork unitOfWork)
    {
        _applicationRepository = applicationRepository;
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<DashboardSummaryDto>> GetApplicantDashboardAsync(Guid userId)
    {
        var activeAppsQuery = _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .Where(a => a.ApplicantId == userId && !a.IsDeleted);

        var activeApps = await activeAppsQuery
            .Where(a => a.Status != ApplicationStatus.Issued && a.Status != ApplicationStatus.Active)
            .OrderByDescending(a => a.UpdatedAt)
            .ToListAsync();

        var recentApps = await activeAppsQuery
            .OrderByDescending(a => a.CreatedAt)
            .Take(5)
            .ToListAsync();

        var stats = new UserDashboardStats
        {
            TotalSubmitted = await activeAppsQuery.CountAsync(a => a.Status != ApplicationStatus.Draft),
            TestsPassed = 0 // Future: Map from tests table
        };

        var dashboard = new DashboardSummaryDto
        {
            ActiveApplicationsCount = activeApps.Count,
            PendingActionsCount = activeApps.Count(a => a.Status == ApplicationStatus.Payment || a.Status == ApplicationStatus.Draft),
            Applications = recentApps.Select(a => new ApplicationSummaryDto
            {
                Id = a.Id.GetHashCode(), // GUID to int hash for DTO compatibility or update DTO to GUID
                ApplicationNumber = a.ApplicationNumber,
                LicenseCategoryCode = a.LicenseCategory.Code.ToString(),
                Status = a.Status,
                CurrentStage = a.CurrentStage,
                UpdatedAt = a.UpdatedAt ?? a.CreatedAt
            }).ToList(),
            Stats = stats
        };

        return ApiResponse<DashboardSummaryDto>.Ok(dashboard);
    }

    public async Task<ApiResponse<ManagerKpiDto>> GetManagerDashboardAsync()
    {
        var allApps = _applicationRepository.Query().Where(a => !a.IsDeleted);
        var today = DateTime.UtcNow.Date;
        var sevenDaysAgo = today.AddDays(-7);

        var kpis = new ManagerKpiDto
        {
            TodayTotalApplications = await allApps.CountAsync(a => a.CreatedAt >= today),
            TodayPassRate = 85.5, // Future: Calculate from actual results
            TotalStalledApplications = await allApps.CountAsync(a => a.Status != ApplicationStatus.Issued && a.UpdatedAt < DateTime.UtcNow.AddDays(-3)),
            
            StatusDistribution = await allApps
                .GroupBy(a => a.Status)
                .Select(g => new StatusDistributionDto
                {
                    Status = g.Key.ToString(),
                    Count = g.Count()
                }).ToListAsync(),

            Last7DaysLoad = await allApps
                .Where(a => a.CreatedAt >= sevenDaysAgo)
                .GroupBy(a => a.CreatedAt.Date)
                .Select(g => new DailyLoadDto
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Count = g.Count()
                })
                .OrderBy(d => d.Date)
                .ToListAsync()
        };

        return ApiResponse<ManagerKpiDto>.Ok(kpis);
    }
}
