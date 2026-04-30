using AutoMapper;
using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.TestRetake;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using System;
using System.Linq;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class TestRetakeService : ITestRetakeService
{
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<LicenseCategory> _licenseCategoryRepository;
    private readonly IRepository<TheoryTest> _theoryTestRepository;
    private readonly IRepository<PracticalTest> _practicalTestRepository;
    private readonly ISystemSettingsService _systemSettingsService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<TestRetakeService> _logger;

    public TestRetakeService(
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<LicenseCategory> licenseCategoryRepository,
        IRepository<TheoryTest> theoryTestRepository,
        IRepository<PracticalTest> practicalTestRepository,
        ISystemSettingsService systemSettingsService,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<TestRetakeService> logger)
    {
        _applicationRepository = applicationRepository;
        _licenseCategoryRepository = licenseCategoryRepository;
        _theoryTestRepository = theoryTestRepository;
        _practicalTestRepository = practicalTestRepository;
        _systemSettingsService = systemSettingsService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponse<RetakeEligibilityDto>> CheckEligibilityAsync(Guid applicationId)
    {
        try
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null)
            {
                return ApiResponse<RetakeEligibilityDto>.NotFound("الطلب غير موجود.");
            }

            // Check if application has failed theory or practical
            var failedStatuses = new[]
            {
                ApplicationStatus.Rejected,
                ApplicationStatus.Cancelled,
                ApplicationStatus.Expired
            };

            var hasFailedTests = false;

            if (!failedStatuses.Contains(application.Status))
            {
                // Check if still in test stages - get last test results
                var existingTheoryTests = await _theoryTestRepository.FindAsync(t =>
                    t.ApplicationId == applicationId && !t.IsDeleted);

                var existingPracticalTests = await _practicalTestRepository.FindAsync(p =>
                    p.ApplicationId == applicationId && !p.IsDeleted);

                bool hasFailedTheory = existingTheoryTests.Any(t => t.Result == TestResult.Fail);
                bool hasFailedPractical = existingPracticalTests.Any(p => p.Result == TestResult.Fail);

                if (!hasFailedTheory && !hasFailedPractical)
                {
                    return ApiResponse<RetakeEligibilityDto>.Fail(400, "لا توجد اختبارات فاشلة لهذا الطلب.");
                }

                hasFailedTests = true;
            }

            // Get category info
            var category = await _licenseCategoryRepository.GetByIdAsync(application.LicenseCategoryId);
            var categoryCode = category?.Code.ToString() ?? "";
            var categoryName = category?.NameAr ?? "";

            // Get max attempts from system settings
            var maxTheoryAttemptsStr = await _systemSettingsService.GetAsync("MAX_THEORY_ATTEMPTS");
            var maxTheoryAttempts = int.TryParse(maxTheoryAttemptsStr, out var mta) ? mta : 3;

            var maxPracticalAttemptsStr = await _systemSettingsService.GetAsync("MAX_PRACTICAL_ATTEMPTS");
            var maxPracticalAttempts = int.TryParse(maxPracticalAttemptsStr, out var mpa) ? mpa : 3;

            // Get cooling periods
            var coolingPeriodDaysTheoryStr = await _systemSettingsService.GetAsync("COOLING_PERIOD_DAYS");
            var coolingPeriodDaysTheory = int.TryParse(coolingPeriodDaysTheoryStr, out var cpt) ? cpt : 7;

            var coolingPeriodDaysPracticalStr = await _systemSettingsService.GetAsync("COOLING_PERIOD_DAYS_PRACTICAL");
            var coolingPeriodDaysPractical = int.TryParse(coolingPeriodDaysPracticalStr, out var cpp) ? cpp : 7;

            // Get theory test attempts
            var allTheoryTests = await _theoryTestRepository.FindAsync(t =>
                t.ApplicationId == applicationId && !t.IsDeleted);

            var theoryAttemptCount = application.TheoryAttemptCount;
            var lastFailedTheoryTest = allTheoryTests
                .Where(t => t.Result == TestResult.Fail)
                .OrderByDescending(t => t.ConductedAt)
                .FirstOrDefault();

            bool canRetakeTheory = theoryAttemptCount < maxTheoryAttempts;
            string? theoryIneligibilityReason = null;
            DateTime? theoryNextAvailableDate = null;

            if (theoryAttemptCount >= maxTheoryAttempts)
            {
                canRetakeTheory = false;
                theoryIneligibilityReason = "تم استنفاذ الحد الأقصى لمحاولات الاختبار النظري.";
            }
            else if (lastFailedTheoryTest != null)
            {
                var coolingEnd = lastFailedTheoryTest.ConductedAt.AddDays(coolingPeriodDaysTheory);
                if (DateTime.UtcNow < coolingEnd)
                {
                    canRetakeTheory = false;
                    theoryIneligibilityReason = "يجب الانتظار حتى انتهاء فترة السماح.";
                    theoryNextAvailableDate = coolingEnd;
                }
            }

            // Get practical test attempts
            var allPracticalTests = await _practicalTestRepository.FindAsync(p =>
                p.ApplicationId == applicationId && !p.IsDeleted);

            var practicalAttemptCount = application.PracticalAttemptCount;
            var lastFailedPracticalTest = allPracticalTests
                .Where(p => p.Result == TestResult.Fail)
                .OrderByDescending(p => p.ConductedAt)
                .FirstOrDefault();

            bool canRetakePractical = practicalAttemptCount < maxPracticalAttempts;
            string? practicalIneligibilityReason = null;
            DateTime? practicalNextAvailableDate = null;

            if (practicalAttemptCount >= maxPracticalAttempts)
            {
                canRetakePractical = false;
                practicalIneligibilityReason = "تم استنفاذ الحد الأقصى لمحاولات الاختبار العملي.";
            }
            else if (lastFailedPracticalTest != null)
            {
                var coolingEnd = lastFailedPracticalTest.ConductedAt.AddDays(coolingPeriodDaysPractical);
                if (DateTime.UtcNow < coolingEnd)
                {
                    canRetakePractical = false;
                    practicalIneligibilityReason = "يجب الانتظار حتى انتهاء فترة السماح.";
                    practicalNextAvailableDate = coolingEnd;
                }
            }

            var result = new RetakeEligibilityDto
            {
                ApplicationId = applicationId,
                ApplicationNumber = application.ApplicationNumber,
                LicenseCategoryId = application.LicenseCategoryId,
                LicenseCategoryCode = categoryCode,
                LicenseCategoryName = categoryName,
                TheoryAttempts = theoryAttemptCount,
                MaxTheoryAttempts = maxTheoryAttempts,
                CanRetakeTheory = canRetakeTheory,
                TheoryIneligibilityReason = theoryIneligibilityReason,
                TheoryNextAvailableDate = theoryNextAvailableDate,
                PracticalAttempts = practicalAttemptCount,
                MaxPracticalAttempts = maxPracticalAttempts,
                CanRetakePractical = canRetakePractical,
                PracticalIneligibilityReason = practicalIneligibilityReason,
                PracticalNextAvailableDate = practicalNextAvailableDate
            };

            return ApiResponse<RetakeEligibilityDto>.Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking retake eligibility for application: {ApplicationId}", applicationId);
            return ApiResponse<RetakeEligibilityDto>.Fail(500, "حدث خطأ أثناء التحقق من الأهلية.");
        }
    }

    public async Task<ApiResponse<bool>> RequestRetakeAsync(Guid applicationId, RetakeRequest request)
    {
        try
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null)
            {
                return ApiResponse<bool>.NotFound("الطلب غير موجود.");
            }

            // Validate at least one retake is requested
            if (!request.RequestTheoryRetake && !request.RequestPracticalRetake)
            {
                return ApiResponse<bool>.Fail(400, "يجب اختيار نوع الاختبار لإعادة التقدم.");
            }

            // Get max attempts
            var maxTheoryAttemptsStr = await _systemSettingsService.GetAsync("MAX_THEORY_ATTEMPTS");
            var maxTheoryAttempts = int.TryParse(maxTheoryAttemptsStr, out var mta) ? mta : 3;

            var maxPracticalAttemptsStr = await _systemSettingsService.GetAsync("MAX_PRACTICAL_ATTEMPTS");
            var maxPracticalAttempts = int.TryParse(maxPracticalAttemptsStr, out var mpa) ? mpa : 3;

            // Validate theory retake eligibility
            if (request.RequestTheoryRetake)
            {
                if (application.TheoryAttemptCount >= maxTheoryAttempts)
                {
                    return ApiResponse<bool>.Fail(400, "تم استنفاذ الحد الأقصى لمحاولات الاختبار النظري.");
                }

                var allTheoryTests = await _theoryTestRepository.FindAsync(t =>
                    t.ApplicationId == applicationId && !t.IsDeleted);

                var lastFailedTheoryTest = allTheoryTests
                    .Where(t => t.Result == TestResult.Fail)
                    .OrderByDescending(t => t.ConductedAt)
                    .FirstOrDefault();

                if (lastFailedTheoryTest != null)
                {
                    var coolingPeriodDaysTheoryStr = await _systemSettingsService.GetAsync("COOLING_PERIOD_DAYS");
                    var coolingPeriodDays = int.TryParse(coolingPeriodDaysTheoryStr, out var cp) ? cp : 7;
                    var coolingEnd = lastFailedTheoryTest.ConductedAt.AddDays(coolingPeriodDays);

                    if (DateTime.UtcNow < coolingEnd)
                    {
                        return ApiResponse<bool>.Fail(400, $"يجب الانتظار حتى {coolingEnd:yyyy-MM-dd HH:mm} UTC.");
                    }
                }

                application.TheoryAttemptCount++;
            }

            // Validate practical retake eligibility
            if (request.RequestPracticalRetake)
            {
                if (application.PracticalAttemptCount >= maxPracticalAttempts)
                {
                    return ApiResponse<bool>.Fail(400, "تم استنفاذ الحد الأقصى لمحاولات الاختبار العملي.");
                }

                var allPracticalTests = await _practicalTestRepository.FindAsync(p =>
                    p.ApplicationId == applicationId && !p.IsDeleted);

                var lastFailedPracticalTest = allPracticalTests
                    .Where(p => p.Result == TestResult.Fail)
                    .OrderByDescending(p => p.ConductedAt)
                    .FirstOrDefault();

                if (lastFailedPracticalTest != null)
                {
                    var coolingPeriodDaysPracticalStr = await _systemSettingsService.GetAsync("COOLING_PERIOD_DAYS_PRACTICAL");
                    var coolingPeriodDays = int.TryParse(coolingPeriodDaysPracticalStr, out var cp) ? cp : 7;
                    var coolingEnd = lastFailedPracticalTest.ConductedAt.AddDays(coolingPeriodDays);

                    if (DateTime.UtcNow < coolingEnd)
                    {
                        return ApiResponse<bool>.Fail(400, $"يجب الانتظار حتى {coolingEnd:yyyy-MM-dd HH:mm} UTC.");
                    }
                }

                application.PracticalAttemptCount++;
            }

            // Reset application status if previously rejected due to test failure
            if (application.Status == ApplicationStatus.Rejected)
            {
                // Reset to submitted so user can book new appointment
                // Preserve the current stage to allow booking
                application.Status = ApplicationStatus.Submitted;
            }

            _applicationRepository.Update(application);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Retake requested for application: {ApplicationId}, Theory: {TheoryRetake}, Practical: {PracticalRetake}",
                applicationId, request.RequestTheoryRetake, request.RequestPracticalRetake);

            return ApiResponse<bool>.Ok(true, "تم تقديم طلب إعادة الاختبار بنجاح.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error requesting retake for application: {ApplicationId}", applicationId);
            return ApiResponse<bool>.Fail(500, "حدث خطأ أثناء تقديم طلب إعادة الاختبار.");
        }
    }
}