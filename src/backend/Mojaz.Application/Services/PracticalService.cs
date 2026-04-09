using AutoMapper;
using Mojaz.Application.DTOs.Practical;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Application.Services;

/// <summary>
/// Service for managing practical test operations
/// </summary>
public class PracticalService : IPracticalService
{
    private readonly IPracticalRepository _practicalRepository;
    private readonly IRepository<global::Mojaz.Domain.Entities.Application> _applicationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuditService _auditService;
    private readonly INotificationService _notificationService;
    private readonly ISystemSettingsService _systemSettingsService;

    public PracticalService(
        IPracticalRepository practicalRepository,
        IRepository<global::Mojaz.Domain.Entities.Application> applicationRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAuditService auditService,
        INotificationService notificationService,
        ISystemSettingsService systemSettingsService)
    {
        _practicalRepository = practicalRepository;
        _applicationRepository = applicationRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _auditService = auditService;
        _notificationService = notificationService;
        _systemSettingsService = systemSettingsService;
    }

    public async Task<ApiResponse<PracticalTestDto>> SubmitResultAsync(Guid applicationId, SubmitPracticalResultRequest request, Guid examinerId)
    {
        // Load application
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
        {
            return ApiResponse<PracticalTestDto>.Fail(404, "Application not found");
        }

        // Stage check - must be in Practical stage
        if (application.CurrentStage != ApplicationStages.Practical)
        {
            return ApiResponse<PracticalTestDto>.Fail(400, "Application is not in Practical Test stage");
        }

        // Get settings
        var minPassScoreStr = await _systemSettingsService.GetAsync("MIN_PASS_SCORE_PRACTICAL");
        var maxAttemptsStr = await _systemSettingsService.GetAsync("MAX_PRACTICAL_ATTEMPTS");
        var coolingPeriodDaysStr = await _systemSettingsService.GetAsync("COOLING_PERIOD_DAYS_PRACTICAL");

        var minPassScore = int.Parse(minPassScoreStr ?? "75");
        var maxAttempts = int.Parse(maxAttemptsStr ?? "3");
        var coolingPeriodDays = int.Parse(coolingPeriodDaysStr ?? "7");

        // Check max attempts
        if (application.PracticalAttemptCount >= maxAttempts)
        {
            return ApiResponse<PracticalTestDto>.Fail(400, "Maximum practical test attempts already reached");
        }

        // Determine result
        TestResult result;
        if (request.IsAbsent)
        {
            result = TestResult.Absent;
        }
        else if (request.Score >= minPassScore)
        {
            result = TestResult.Pass;
        }
        else
        {
            result = TestResult.Fail;
        }

        // Increment attempt count
        application.PracticalAttemptCount++;

        // Create practical test record
        var practicalTest = new PracticalTest
        {
            Id = Guid.NewGuid(),
            ApplicationId = applicationId,
            ExaminerId = examinerId,
            AttemptNumber = application.PracticalAttemptCount,
            ConductedAt = DateTime.UtcNow,
            Score = request.Score,
            PassingScore = minPassScore,
            IsAbsent = request.IsAbsent,
            Result = result,
            Notes = request.Notes,
            VehicleUsed = request.VehicleUsed,
            RequiresAdditionalTraining = request.RequiresAdditionalTraining,
            AdditionalHoursRequired = request.AdditionalHoursRequired,
            CreatedAt = DateTime.UtcNow
        };

        // Handle pass result
        if (result == TestResult.Pass)
        {
            application.Status = ApplicationStatus.Approved;
            application.CurrentStage = ApplicationStages.FinalApproval;
        }
        // Handle fail result
        else if (result == TestResult.Fail)
        {
            // Check for terminal fail
            if (application.PracticalAttemptCount >= maxAttempts)
            {
                application.Status = ApplicationStatus.Rejected;
                application.RejectionReason = "MaxPracticalAttemptsReached";
                application.AdditionalTrainingRequired = false;
            }
            else
            {
                // Set additional training flag if requested
                if (request.RequiresAdditionalTraining)
                {
                    application.AdditionalTrainingRequired = true;
                }
            }
        }
        // Handle absent (count as failed attempt)
        else if (result == TestResult.Absent)
        {
            if (application.PracticalAttemptCount >= maxAttempts)
            {
                application.Status = ApplicationStatus.Rejected;
                application.RejectionReason = "MaxPracticalAttemptsReached";
            }
        }

        // Save
        await _practicalRepository.AddAsync(practicalTest);
        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        // Map to DTO
        var dto = _mapper.Map<PracticalTestDto>(practicalTest);
        dto.ExaminerName = "Examiner";
        dto.ApplicationStatus = application.Status.ToString();

        // Calculate retake eligible date for failed/absent
        if (result != TestResult.Pass)
        {
            dto.RetakeEligibleAfter = practicalTest.ConductedAt.AddDays(coolingPeriodDays);
        }

        // Audit log
        await _auditService.LogAsync(
            "SUBMIT_PRACTICAL_RESULT",
            "PracticalTest",
            practicalTest.Id.ToString(),
            null,
            $"Score: {request.Score}, Result: {result}, Attempt: {application.PracticalAttemptCount}");

        // Send notification
        var applicantUserId = application.ApplicantId;
        if (result == TestResult.Pass)
        {
            await _notificationService.SendAsync(new NotificationRequest
            {
                UserId = applicantUserId,
                ApplicationId = applicationId,
                EventType = NotificationEventType.TestResultReady,
                TitleAr = "تهانينا! لقد اجتزت الاختبار العملي بنجاح",
                TitleEn = "Congratulations! You have passed the practical test",
                MessageAr = $"حصلت على درجة {request.Score} من {minPassScore}. تقدم الآن لاستلام رخصتك.",
                MessageEn = $"You scored {request.Score} out of {minPassScore}. Proceed to collect your license.",
                InApp = true,
                Push = true
            });
        }
        else if (application.Status == ApplicationStatus.Rejected)
        {
            await _notificationService.SendAsync(new NotificationRequest
            {
                UserId = applicantUserId,
                ApplicationId = applicationId,
                EventType = NotificationEventType.ApplicationRejected,
                TitleAr = "تم رفض طلبك",
                TitleEn = "Your application has been rejected",
                MessageAr = "لقد استنفدت جميع محاولاتك للاختبار العملي. يرجى تقديم طلب جديد.",
                MessageEn = "You have exhausted all your practical test attempts. Please submit a new application.",
                InApp = true,
                Push = true
            });
        }
        else
        {
            // Fail notification
            var retakeDate = practicalTest.ConductedAt.AddDays(coolingPeriodDays);
            await _notificationService.SendAsync(new NotificationRequest
            {
                UserId = applicantUserId,
                ApplicationId = applicationId,
                EventType = NotificationEventType.TestResultReady,
                TitleAr = "لم تجتز الاختبار العملي",
                TitleEn = "You did not pass the practical test",
                MessageAr = $"حصلت على درجة {request.Score} من {minPassScore}. يمكنك إعادة الاختبار بعد {retakeDate:yyyy-MM-dd}.",
                MessageEn = $"You scored {request.Score} out of {minPassScore}. You can retake the test after {retakeDate:yyyy-MM-dd}.",
                InApp = true,
                Push = true
            });
        }

        return ApiResponse<PracticalTestDto>.Created(dto, "Practical test result submitted successfully");
    }

    public async Task<ApiResponse<PagedResult<PracticalTestDto>>> GetHistoryAsync(Guid applicationId, Guid userId, string role, int page = 1, int pageSize = 10)
    {
        // Load application
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
        {
            return ApiResponse<PagedResult<PracticalTestDto>>.Fail(404, "Application not found");
        }

        // Ownership check for Applicants
        if (role == "Applicant" && application.ApplicantId != userId)
        {
            return ApiResponse<PagedResult<PracticalTestDto>>.Fail(403, "You do not have permission to view this application");
        }

        // Get all tests
        var tests = await _practicalRepository.GetAllByApplicationIdAsync(applicationId);
        var coolingPeriodDaysStr = await _systemSettingsService.GetAsync("COOLING_PERIOD_DAYS_PRACTICAL");
        var coolingPeriodDays = int.Parse(coolingPeriodDaysStr ?? "7");

        // Calculate pagination
        var totalCount = tests.Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        var pagedTests = tests
            .OrderBy(t => t.AttemptNumber)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // Map to DTOs
        var dtos = new List<PracticalTestDto>();
        foreach (var test in pagedTests)
        {
            var dto = _mapper.Map<PracticalTestDto>(test);
            dto.ExaminerName = test.Examiner?.FullNameAr;
            dto.ApplicationStatus = application.Status.ToString();

            if (test.Result != TestResult.Pass)
            {
                dto.RetakeEligibleAfter = test.ConductedAt.AddDays(coolingPeriodDays);
            }

            dtos.Add(dto);
        }

        var result = new PagedResult<PracticalTestDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };

        return ApiResponse<PagedResult<PracticalTestDto>>.Ok(result);
    }

    public async Task<bool> IsInCoolingPeriodAsync(Guid applicationId)
    {
        var latestTest = await _practicalRepository.GetLatestByApplicationIdAsync(applicationId);
        if (latestTest == null || latestTest.Result == TestResult.Pass)
        {
            return false;
        }

        var coolingPeriodDaysStr = await _systemSettingsService.GetAsync("COOLING_PERIOD_DAYS_PRACTICAL");
        var coolingPeriodDays = int.Parse(coolingPeriodDaysStr ?? "7");
        var coolingPeriodEnd = latestTest.ConductedAt.AddDays(coolingPeriodDays);

        return DateTime.UtcNow < coolingPeriodEnd;
    }

    public async Task<bool> HasReachedMaxAttemptsAsync(Guid applicationId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
        {
            return false;
        }

        var maxAttemptsStr = await _systemSettingsService.GetAsync("MAX_PRACTICAL_ATTEMPTS");
        var maxAttempts = int.Parse(maxAttemptsStr ?? "3");
        return application.PracticalAttemptCount >= maxAttempts;
    }

    public async Task<bool> HasAdditionalTrainingRequiredAsync(Guid applicationId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        return application?.AdditionalTrainingRequired ?? false;
    }
}
