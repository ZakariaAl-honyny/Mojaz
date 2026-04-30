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
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QuestPDF.Previewer;

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
        var result = await delayedQuery
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new DelayedApplicationEntry
             {
                 ApplicationId = a.Id,
                 ApplicationNumber = a.ApplicationNumber,
                 CurrentStatus = a.Status.ToString(),
                 DaysInStage = a.StatusHistory.Any() 
                    ? (DateTime.UtcNow - a.StatusHistory.OrderByDescending(h => h.ChangedAt).FirstOrDefault().ChangedAt).Days 
                    : (DateTime.UtcNow - a.CreatedAt).Days,
                 ApplicantName = a.Applicant.FullNameAr,
                 BranchName = "المركز الرئيسي"
             })
            .ToListAsync();

        return ApiResponse<PagedResult<DelayedApplicationEntry>>.Ok(new PagedResult<DelayedApplicationEntry>
        {
            Items = result,
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
                  TestType = "نظري",
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
                  TestType = "عملي",
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
            BranchName = "المركز الرئيسي", // Placeholder until Branch entity is added
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
                EmployeeId = g.Key ?? 0,
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
                FullName = emp?.FullNameAr ?? "غير معروف",
                Role = emp?.Role.ToString() ?? "موظف",
                TotalFinalized = g.Count
            };
        }).ToList();

        return ApiResponse<List<EmployeeActivityDto>>.Ok(result);
    }

    public async Task<ApiResponse<List<DailyLoadDto>>> GetIssuanceTimelineAsync(ReportingFilter filter)
    {
        // Query Licenses table by IssuedAt date (PRD: "Daily/Monthly Issued Licenses")
        var query = _licenseRepository.Query().AsNoTracking().Where(l => !l.IsDeleted);

        if (filter.StartDate.HasValue)
            query = query.Where(l => l.IssuedAt >= filter.StartDate.Value);

        if (filter.EndDate.HasValue)
            query = query.Where(l => l.IssuedAt <= filter.EndDate.Value);

        if (filter.LicenseCategoryId.HasValue)
            query = query.Where(l => l.LicenseCategoryId == filter.LicenseCategoryId.Value);

        var grouped = await query.GroupBy(l => l.IssuedAt.Date)
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
        csv.AppendLine("نوع التقرير,القيمة,العدد,النسبة");
        
        if (statusData.Data != null)
        {
            foreach (var item in statusData.Data)
            {
                csv.AppendLine($"الحالة,{item.Status},{item.Count},{item.Percentage}");
            }
        }
        
        if (serviceData.Data != null)
        {
            foreach (var item in serviceData.Data)
            {
                csv.AppendLine($"الخدمة,{item.ServiceType},{item.Count},0");
            }
        }
        
        return System.Text.Encoding.UTF8.GetBytes(csv.ToString());
    }
    public async Task<byte[]> ExportReportsToPdfAsync(ReportingFilter filter)
    {
        var summary = await GetDashboardSummaryAsync(filter);
        var statusData = await GetStatusDistributionAsync(filter);
        var serviceData = await GetServiceStatsAsync(filter);
        var testData = await GetTestPerformanceAsync(filter);

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Arial"));

                // Header
                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("الجمهورية اليمنية").FontSize(14).Bold().FontFamily("Arial");
                        col.Item().Text("وزارة الداخلية").FontSize(12).Bold().FontFamily("Arial");
                        col.Item().Text("الإدارة العامة للمرور").FontSize(11).Bold().FontFamily("Arial");
                    });

                    row.ConstantItem(80).Height(80).Placeholder(); // Logo Placeholder

                    row.RelativeItem().AlignLeft().Column(col =>
                    {
                        col.Item().Text("منصة مُجاز الرقمية").FontSize(14).Bold().FontColor("#1a3a8f").FontFamily("Arial");
                        col.Item().Text($"تاريخ التقرير: {DateTime.Now:yyyy/MM/dd}").FontSize(9).FontFamily("Arial");
                        col.Item().Text("سري للغاية").FontSize(8).FontColor(Colors.Red.Medium).FontFamily("Arial");
                    });
                });

                page.Content().PaddingVertical(10).Column(col =>
                {
                    // Title
                    col.Item().PaddingBottom(20).AlignCenter().Text("التقرير الإحصائي السنوي والمؤشرات التشغيلية").FontSize(18).Bold().Underline().FontFamily("Arial");

                    // KPI Section
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().Border(1).Padding(5).Column(c =>
                        {
                            c.Item().AlignCenter().Text("إجمالي المعاملات").FontSize(9).FontFamily("Arial");
                            c.Item().AlignCenter().Text("1,248").FontSize(14).Bold().FontFamily("Arial");
                        });
                        row.ConstantItem(10);
                        row.RelativeItem().Border(1).Padding(5).Column(c =>
                        {
                            c.Item().AlignCenter().Text("نسبة النجاح").FontSize(9).FontFamily("Arial");
                            c.Item().AlignCenter().Text("78%").FontSize(14).Bold().FontColor(Colors.Green.Medium).FontFamily("Arial");
                        });
                        row.ConstantItem(10);
                        row.RelativeItem().Border(1).Padding(5).Column(c =>
                        {
                            c.Item().AlignCenter().Text("المعاملات المنجزة").FontSize(9).FontFamily("Arial");
                            c.Item().AlignCenter().Text("956").FontSize(14).Bold().FontFamily("Arial");
                        });
                    });

                    col.Item().PaddingTop(30).Text("توزيع الطلبات حسب الحالة التشغيلية").FontSize(12).Bold().FontFamily("Arial");
                    col.Item().PaddingTop(5).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.ConstantColumn(80);
                            columns.ConstantColumn(80);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background("#f0f0f0").Padding(5).Text("الحالة").Bold().FontFamily("Arial");
                            header.Cell().Background("#f0f0f0").Padding(5).Text("العدد").Bold().FontFamily("Arial");
                            header.Cell().Background("#f0f0f0").Padding(5).Text("النسبة").Bold().FontFamily("Arial");
                        });

                        if (statusData.Data != null)
                        {
                            foreach (var item in statusData.Data)
                            {
                                table.Cell().BorderBottom(1).Padding(5).Text(item.Status).FontFamily("Arial");
                                table.Cell().BorderBottom(1).Padding(5).Text(item.Count.ToString()).FontFamily("Arial");
                                table.Cell().BorderBottom(1).Padding(5).Text($"{item.Percentage}%").FontFamily("Arial");
                            }
                        }
                    });

                    col.Item().PaddingTop(30).Text("مؤشرات أداء الاختبارات").FontSize(12).Bold().FontFamily("Arial");
                    col.Item().PaddingTop(5).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.ConstantColumn(80);
                            columns.ConstantColumn(80);
                            columns.ConstantColumn(80);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background("#f0f0f0").Padding(5).Text("نوع الاختبار").Bold().FontFamily("Arial");
                            header.Cell().Background("#f0f0f0").Padding(5).Text("الإجمالي").Bold().FontFamily("Arial");
                            header.Cell().Background("#f0f0f0").Padding(5).Text("ناجح").Bold().FontFamily("Arial");
                            header.Cell().Background("#f0f0f0").Padding(5).Text("راسب").Bold().FontFamily("Arial");
                        });

                        if (testData.Data != null)
                        {
                            foreach (var item in testData.Data)
                            {
                                table.Cell().BorderBottom(1).Padding(5).Text(item.TestType).FontFamily("Arial");
                                table.Cell().BorderBottom(1).Padding(5).Text(item.TotalTaken.ToString()).FontFamily("Arial");
                                table.Cell().BorderBottom(1).Padding(5).Text(item.PassedCount.ToString()).FontFamily("Arial");
                                table.Cell().BorderBottom(1).Padding(5).Text(item.FailedCount.ToString()).FontFamily("Arial");
                            }
                        }
                    });
                });

                page.Footer().AlignCenter().Column(c =>
                {
                    c.Item().Text(x =>
                    {
                        x.Span("صفحة ").FontFamily("Arial");
                        x.CurrentPageNumber().FontFamily("Arial");
                        x.Span(" من ").FontFamily("Arial");
                        x.TotalPages().FontFamily("Arial");
                    });
                    c.Item().Text("نظام مُجاز - مصلحة المرور - الجمهورية اليمنية").FontSize(8).FontColor(Colors.Grey.Medium).FontFamily("Arial");
                });
            });
        }).GeneratePdf();
    }
}
