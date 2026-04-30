using Microsoft.EntityFrameworkCore;
using Mojaz.Application.Applications.Dtos;
using Mojaz.Application.Dashboards.Dtos;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<Notification> _notificationRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<License> _licenseRepository;
    private readonly IRepository<PaymentTransaction> _paymentRepository;
    private readonly IRepository<Appointment> _appointmentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DashboardService(
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<Notification> notificationRepository,
        IRepository<User> userRepository,
        IRepository<License> licenseRepository,
        IRepository<PaymentTransaction> paymentRepository,
        IRepository<Appointment> appointmentRepository,
        IUnitOfWork unitOfWork)
    {
        _applicationRepository = applicationRepository;
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
        _licenseRepository = licenseRepository;
        _paymentRepository = paymentRepository;
        _appointmentRepository = appointmentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<DashboardSummaryDto>> GetApplicantDashboardAsync(int userId)
    {
        try
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
                    Id = a.Id,
                    ApplicationNumber = a.ApplicationNumber ?? string.Empty,
                    LicenseCategoryCode = a.LicenseCategory?.Code ?? LicenseCategoryCode.B,
                    Status = a.Status,
                    CurrentStage = a.CurrentStage ?? string.Empty,
                    UpdatedAt = a.UpdatedAt ?? a.CreatedAt,
                    ServiceType = a.ServiceType,
                    SubmittedDate = a.SubmittedAt ?? a.CreatedAt
                }).ToList(),
                Stats = stats
            };

            return ApiResponse<DashboardSummaryDto>.Ok(dashboard);
        }
        catch (Exception ex)
        {
            // Log the error for debugging
            return ApiResponse<DashboardSummaryDto>.Fail(500, $"حدث خطأ في جلب لوحة المعلومات: {ex.Message}");
        }
    }

    public async Task<ApiResponse<ManagerKpiDto>> GetManagerDashboardAsync()
    {
        try
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
        catch (Exception ex)
        {
            // Log the error for debugging
            return ApiResponse<ManagerKpiDto>.Fail(500, $"حدث خطأ في جلب لوحة المعلومات: {ex.Message}");
        }
    }

    public async Task<ApiResponse<AdminKpiDto>> GetAdminDashboardAsync()
    {
        try
        {
            var today = DateTime.UtcNow.Date;
            var yesterday = today.AddDays(-1);

            // Get all non-deleted records
            var allApps = _applicationRepository.Query().Where(a => !a.IsDeleted);
            var allLicenses = _licenseRepository.Query().Where(l => !l.IsDeleted);
            var allPayments = _paymentRepository.Query().Where(p => !p.IsDeleted && p.Status == PaymentStatus.Paid);
            var allUsers = _userRepository.Query().Where(u => !u.IsDeleted);

            // Today's stats
            var todayApps = await allApps.CountAsync(a => a.CreatedAt >= today);
            var yesterdayApps = await allApps.CountAsync(a => a.CreatedAt >= yesterday && a.CreatedAt < today);
            var todayLicenses = await allLicenses.CountAsync(l => l.CreatedAt >= today);
            var yesterdayLicenses = await allLicenses.CountAsync(l => l.CreatedAt >= yesterday && l.CreatedAt < today);
            var todayRevenue = await allPayments.Where(p => p.CreatedAt >= today).SumAsync(p => p.Amount);
            var yesterdayRevenue = await allPayments.Where(p => p.CreatedAt >= yesterday && p.CreatedAt < today).SumAsync(p => p.Amount);
            var activeUsers = await allUsers.CountAsync(u => u.LastLoginAt >= today.AddDays(-7));
            var yesterdayUserLogins = await allUsers.CountAsync(u => u.LastLoginAt >= yesterday.AddDays(-7) && u.LastLoginAt < today.AddDays(-7));

            var todayStats = new AdminTodayStats
            {
                Applications = todayApps,
                Licenses = todayLicenses,
                Revenue = todayRevenue,
                ActiveUsers = activeUsers,
                ApplicationsChange = yesterdayApps > 0 ? Math.Round((decimal)(todayApps - yesterdayApps) / yesterdayApps * 100, 1) : 0,
                LicensesChange = yesterdayLicenses > 0 ? Math.Round((decimal)(todayLicenses - yesterdayLicenses) / yesterdayLicenses * 100, 1) : 0,
                RevenueChange = yesterdayRevenue > 0 ? Math.Round((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100, 1) : 0,
                UsersChange = yesterdayUserLogins > 0 ? Math.Round((decimal)(activeUsers - yesterdayUserLogins) / yesterdayUserLogins * 100, 1) : 0
            };

            // Status distribution - Fetch raw counts first, then map labels in memory
            var statusCounts = await allApps
                .GroupBy(a => a.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var statusColors = new Dictionary<ApplicationStatus, string>
            {
                { ApplicationStatus.Issued, "#10B981" },
                { ApplicationStatus.InReview, "#F59E0B" },
                { ApplicationStatus.Submitted, "#1a3a8f" },
                { ApplicationStatus.Cancelled, "#EF4444" },
                { ApplicationStatus.Draft, "#9CA3AF" }
            };

            var statusLabels = new Dictionary<ApplicationStatus, string>
            {
                { ApplicationStatus.Issued, "مُكتملة" },
                { ApplicationStatus.InReview, "قيد المراجعة" },
                { ApplicationStatus.Submitted, "مُقدَّم" },
                { ApplicationStatus.Cancelled, "ملغاة" },
                { ApplicationStatus.Draft, "مسودة" }
            };

            var statusDistribution = statusCounts.Select(s => new StatusData
            {
                Name = statusLabels.ContainsKey(s.Status) ? statusLabels[s.Status] : s.Status.ToString(),
                Value = s.Count,
                Color = statusColors.ContainsKey(s.Status) ? statusColors[s.Status] : "#6B7280"
            }).ToList();

            // Weekly trend
            var weeklyTrend = new List<WeeklyTrend>();
            var dayNames = new[] { "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت" };
            for (int i = 6; i >= 0; i--)
            {
                var date = today.AddDays(-i);
                var dateStr = dayNames[(int)date.DayOfWeek];
                var dayApps = await allApps.CountAsync(a => a.CreatedAt.Date == date);
                var dayCompleted = await allApps.CountAsync(a => a.Status == ApplicationStatus.Issued && a.UpdatedAt.HasValue && a.UpdatedAt.Value.Date == date);
                weeklyTrend.Add(new WeeklyTrend
                {
                    Date = dateStr,
                    Applications = dayApps,
                    Completed = dayCompleted
                });
            }

            // Recent activity - Fetch records first
            var recentApps = await allApps
                .OrderByDescending(a => a.CreatedAt)
                .Take(4)
                .ToListAsync();

            var recentLicenses = await allLicenses
                .OrderByDescending(l => l.CreatedAt)
                .Take(4)
                .ToListAsync();

            var recentPayments = await allPayments
                .OrderByDescending(p => p.CreatedAt)
                .Take(4)
                .ToListAsync();

            var allRecentItems = new List<(DateTime Date, ActivityItem Item)>();

            allRecentItems.AddRange(recentApps.Select(a => (a.CreatedAt, new ActivityItem
            {
                Id = a.Id,
                Type = "application",
                Title = "طلب جديد مستلم",
                Description = $"تم استلام طلب إصدار رخصة برقم {a.ApplicationNumber}",
                Timestamp = GetTimeAgo(a.CreatedAt)
            })));

            allRecentItems.AddRange(recentLicenses.Select(l => (l.CreatedAt, new ActivityItem
            {
                Id = l.Id,
                Type = "license",
                Title = "رخصة مُصدرة بنجاح",
                Description = "تم إصدار رخصة قيادة",
                Timestamp = GetTimeAgo(l.CreatedAt)
            })));

            allRecentItems.AddRange(recentPayments.Select(p => (p.CreatedAt, new ActivityItem
            {
                Id = p.Id,
                Type = "payment",
                Title = "عملية دفع مؤكدة",
                Description = $"تم تأكيد سداد رسوم بمبلغ {p.Amount:N0} ريال",
                Timestamp = GetTimeAgo(p.CreatedAt)
            })));

            var recentActivity = allRecentItems
                .OrderByDescending(x => x.Date)
                .Take(4)
                .Select(x => x.Item)
                .ToList();

            var kpi = new AdminKpiDto
            {
                TodayStats = todayStats,
                StatusDistribution = statusDistribution,
                WeeklyTrend = weeklyTrend,
                RecentActivity = recentActivity
            };

            return ApiResponse<AdminKpiDto>.Ok(kpi);
        }
        catch (Exception ex)
        {
            // Log the error for debugging
            return ApiResponse<AdminKpiDto>.Fail(500, $"حدث خطأ في جلب لوحة المعلومات الإدارية: {ex.Message}");
        }
    }

    private static string GetTimeAgo(DateTime dateTime)
    {
        var span = DateTime.UtcNow - dateTime;
        if (span.TotalMinutes < 60)
            return $"منذ {(int)span.TotalMinutes} دقيقة";
        if (span.TotalHours < 24)
            return $"منذ {(int)span.TotalHours} ساعة";
        return $"منذ {(int)span.TotalDays} يوم";
    }

    public async Task<ApiResponse<EmployeeDashboardDto>> GetEmployeeDashboardAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        // Get appointments assigned to this employee for today
        var todayAppointments = _appointmentRepository.Query()
            .Include(a => a.Application)
            .ThenInclude(a => a!.LicenseCategory)
            .Where(a => a.AssignedStaffId == userId && !a.IsDeleted);

        var pendingAppointments = await todayAppointments
            .CountAsync(a => a.Status == AppointmentStatus.Scheduled);

        var completedToday = await todayAppointments
            .CountAsync(a => a.Status == AppointmentStatus.Completed && a.UpdatedAt >= today);

        var recentAppsData = await _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .Where(a => !a.IsDeleted && a.Status != ApplicationStatus.Issued)
            .OrderByDescending(a => a.UpdatedAt)
            .Take(5)
            .ToListAsync();

        var recentApplications = recentAppsData.Select(a => new ApplicationSummaryDto
        {
            Id = a.Id,
            ApplicationNumber = a.ApplicationNumber ?? string.Empty,
            LicenseCategoryCode = a.LicenseCategory?.Code ?? LicenseCategoryCode.B,
            ServiceType = a.ServiceType,
            Status = a.Status,
            CurrentStage = a.CurrentStage ?? string.Empty,
            UpdatedAt = a.UpdatedAt ?? a.CreatedAt,
            SubmittedDate = a.SubmittedAt ?? a.CreatedAt
        }).ToList();

        var dashboard = new EmployeeDashboardDto
        {
            PendingAppointments = pendingAppointments,
            CompletedToday = completedToday,
            WaitingInQueue = pendingAppointments,
            RecentApplications = recentApplications
        };

        return ApiResponse<EmployeeDashboardDto>.Ok(dashboard);
    }

    public async Task<ApiResponse<ReceptionistDashboardDto>> GetReceptionistDashboardAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;

        // Get applications pending receptionist action
        var allApplications = _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .Where(a => !a.IsDeleted);

        var pendingApplications = await allApplications
            .CountAsync(a => a.Status == ApplicationStatus.Submitted);

        // Waiting in queue (newly submitted applications)
        var waitingInQueue = await allApplications
            .CountAsync(a => a.Status == ApplicationStatus.Submitted);

        // Processed today
        var processedToday = await allApplications
            .CountAsync(a => a.UpdatedAt >= today);

        var queueAppsData = await allApplications
            .Where(a => a.Status == ApplicationStatus.Submitted)
            .OrderByDescending(a => a.CreatedAt)
            .Take(10)
            .ToListAsync();

        var queueApplications = queueAppsData.Select(a => new ApplicationSummaryDto
        {
            Id = a.Id,
            ApplicationNumber = a.ApplicationNumber ?? string.Empty,
            LicenseCategoryCode = a.LicenseCategory?.Code ?? LicenseCategoryCode.B,
            ServiceType = a.ServiceType,
            Status = a.Status,
            CurrentStage = a.CurrentStage ?? string.Empty,
            UpdatedAt = a.UpdatedAt ?? a.CreatedAt,
            SubmittedDate = a.SubmittedAt ?? a.CreatedAt
        }).ToList();

        var dashboard = new ReceptionistDashboardDto
        {
            PendingApplications = pendingApplications,
            WaitingInQueue = waitingInQueue,
            ProcessedToday = processedToday,
            QueueApplications = queueApplications
        };

        return ApiResponse<ReceptionistDashboardDto>.Ok(dashboard);
    }
}
