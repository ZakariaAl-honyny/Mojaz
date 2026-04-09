using AutoMapper;
using Mojaz.Application.DTOs.Theory;
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

namespace Mojaz.Application.Services
{
    public class TheoryService : ITheoryService
    {
        private readonly ITheoryRepository _theoryRepository;
        private readonly IRepository<Domain.Entities.Application> _applicationRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IAuditService _auditService;
        private readonly INotificationService _notificationService;
        private readonly ISystemSettingsService _settingsService;

        public TheoryService(
            ITheoryRepository theoryRepository,
            IRepository<Domain.Entities.Application> applicationRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IAuditService auditService,
            INotificationService notificationService,
            ISystemSettingsService settingsService)
        {
            _theoryRepository = theoryRepository;
            _applicationRepository = applicationRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _auditService = auditService;
            _notificationService = notificationService;
            _settingsService = settingsService;
        }

        public async Task<ApiResponse<TheoryTestDto>> SubmitResultAsync(Guid applicationId, SubmitTheoryResultRequest request, Guid examinerId)
        {
            // 1. Load application by appId — 404 if not found
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null)
            {
                return ApiResponse<TheoryTestDto>.Fail(404, "Application not found.");
            }

            // 2. Check application.CurrentStage == ApplicationStages.Theory — 400 if not
            if (application.CurrentStage != ApplicationStages.Theory)
            {
                return ApiResponse<TheoryTestDto>.Fail(400, "Application is not in the Theory Test stage.");
            }

            // 3. Check application.TheoryAttemptCount < MAX_THEORY_ATTEMPTS — 400 if at limit
            var maxAttemptsStr = await _settingsService.GetAsync("MAX_THEORY_ATTEMPTS");
            int maxAttempts = int.TryParse(maxAttemptsStr, out var ma) ? ma : 3;

            if (application.TheoryAttemptCount >= maxAttempts)
            {
                return ApiResponse<TheoryTestDto>.Fail(400, "Maximum theory test attempts have already been reached.");
            }

            // 4. Read MIN_PASS_SCORE_THEORY from SystemSettings (default 80, log warn if missing)
            var minPassScoreStr = await _settingsService.GetAsync("MIN_PASS_SCORE_THEORY");
            int minPassScore = 80;
            if (string.IsNullOrEmpty(minPassScoreStr))
            {
                // Log.Warning("MIN_PASS_SCORE_THEORY not found in SystemSettings — defaulting to 80");
            }
            else
            {
                minPassScore = int.TryParse(minPassScoreStr, out var mps) ? mps : 80;
            }

            // 5. Determine isPassed
            bool isPassed;
            TestResult result;

            if (request.IsAbsent)
            {
                isPassed = false;
                result = TestResult.Absent;
            }
            else if (request.Score.HasValue && request.Score.Value >= minPassScore)
            {
                isPassed = true;
                result = TestResult.Pass;
            }
            else
            {
                isPassed = false;
                result = TestResult.Fail;
            }

            // 6. Increment application.TheoryAttemptCount
            application.TheoryAttemptCount += 1;
            var currentAttempt = application.TheoryAttemptCount;

            // 7. Create TheoryTest record
            var theoryTest = new TheoryTest
            {
                ApplicationId = applicationId,
                ExaminerId = examinerId,
                AttemptNumber = currentAttempt,
                Score = request.IsAbsent ? null : request.Score,
                PassingScore = minPassScore,
                Result = result,
                IsAbsent = request.IsAbsent,
                Notes = request.Notes,
                ConductedAt = DateTime.UtcNow
            };

            await _theoryRepository.AddAsync(theoryTest);

            // 8. Transition application based on result
            DateTime? retakeEligibleAfter = null;
            if (isPassed)
            {
                // Pass → Status = PracticalTest, CurrentStage = "07: Practical"
                application.Status = ApplicationStatus.PracticalTest;
                application.CurrentStage = ApplicationStages.Practical;
            }
            else if (currentAttempt >= maxAttempts)
            {
                // Fail, reached max → Status = Rejected, RejectionReason = "MaxTheoryAttemptsReached"
                application.Status = ApplicationStatus.Rejected;
                application.RejectionReason = "MaxTheoryAttemptsReached";
            }
            else
            {
                // Fail, not max → Status unchanged (TheoryTest), compute retake eligible date
                var coolingDaysStr = await _settingsService.GetAsync("COOLING_PERIOD_DAYS");
                int coolingDays = int.TryParse(coolingDaysStr, out var cd) ? cd : 7;
                retakeEligibleAfter = theoryTest.ConductedAt.AddDays(coolingDays);
            }

            _applicationRepository.Update(application);
            await _unitOfWork.SaveChangesAsync();

            // 9. Write AuditLog entry
            await _auditService.LogAsync(
                "SUBMIT_THEORY_RESULT",
                "TheoryTest",
                theoryTest.Id.ToString(),
                null,
                $"Result: {result}, Score: {request.Score?.ToString() ?? "N/A"}, Attempt: {currentAttempt}");

            // 10. Dispatch notifications
            var notificationTitleAr = "";
            var notificationTitleEn = "";
            var notificationMessageAr = "";
            var notificationMessageEn = "";

            if (isPassed)
            {
                // Pass notification
                notificationTitleAr = "اجتزت الاختبار النظري بنجاح";
                notificationTitleEn = "Theory Test Passed";
                notificationMessageAr = $"مبارك! حصلت على {request.Score}% وتجاوزت حد النجاح ({minPassScore}%). يمكنك الآن حجز موعد الاختبار العملي.";
                notificationMessageEn = $"Congratulations! You scored {request.Score}% and passed the minimum threshold ({minPassScore}%). You may now book your practical test.";
            }
            else if (currentAttempt >= maxAttempts)
            {
                // Final rejection notification
                notificationTitleAr = "تم إغلاق الطلب — استُنفدت جميع المحاولات";
                notificationTitleEn = "Application Closed — All Attempts Exhausted";
                notificationMessageAr = $"لقد استنفدت جميع محاولات الاختبار النظري ({maxAttempts} محاولات). يرجى تقديم طلب جديد.";
                notificationMessageEn = $"You have exhausted all theory test attempts ({maxAttempts} attempts). Please submit a new application.";
            }
            else
            {
                // Fail (retake available) notification
                var retakeDate = retakeEligibleAfter?.ToString("yyyy-MM-dd") ?? "unknown";
                notificationTitleAr = "لم تجتز الاختبار النظري";
                notificationTitleEn = "Theory Test Not Passed";
                notificationMessageAr = $"حصلت على {request.Score ?? 0}%. يمكنك إعادة الاختبار بعد {retakeDate}. المحاولة {currentAttempt} من {maxAttempts}.";
                notificationMessageEn = $"You scored {request.Score ?? 0}%. You may retake after {retakeDate}. Attempt {currentAttempt} of {maxAttempts}.";
            }

            await _notificationService.SendAsync(new NotificationRequest
            {
                UserId = application.ApplicantId,
                ApplicationId = applicationId,
                EventType = NotificationEventType.StatusChanged,
                TitleAr = notificationTitleAr,
                TitleEn = notificationTitleEn,
                MessageAr = notificationMessageAr,
                MessageEn = notificationMessageEn,
                InApp = true,
                Push = true,
                Email = true,
                Sms = true
            });

            // Map response
            var dto = _mapper.Map<TheoryTestDto>(theoryTest);
            dto.RetakeEligibleAfter = retakeEligibleAfter;
            dto.ApplicationStatus = application.Status.ToString();

            return ApiResponse<TheoryTestDto>.Ok(dto, "Theory test result recorded successfully.");
        }

        public async Task<ApiResponse<PagedResult<TheoryTestDto>>> GetHistoryAsync(Guid applicationId, Guid userId, string role, int page = 1, int pageSize = 10)
        {
            // Load application (404 if missing)
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null)
            {
                return ApiResponse<PagedResult<TheoryTestDto>>.Fail(404, "Application not found.");
            }

            // Ownership check for Applicant role (403 if not owner)
            if (role == "Applicant" && application.ApplicantId != userId)
            {
                return ApiResponse<PagedResult<TheoryTestDto>>.Fail(403, "You do not have permission to view this application's test history.");
            }

            // Query all TheoryTest records by ApplicationId ordered by ConductedAt asc
            var allTests = await _theoryRepository.GetAllByApplicationIdAsync(applicationId);
            var testList = allTests.ToList();

            // Calculate pagination
            var totalCount = testList.Count;
            var pagedItems = testList
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Map to DTOs
            var dtos = pagedItems.Select(t =>
            {
                var dto = _mapper.Map<TheoryTestDto>(t);
                
                // Calculate retake eligible after if last attempt failed
                if (t.Result == TestResult.Fail || t.Result == TestResult.Absent)
                {
                    var coolingDaysStr = _settingsService.GetAsync("COOLING_PERIOD_DAYS").Result;
                    int coolingDays = int.TryParse(coolingDaysStr, out var cd) ? cd : 7;
                    dto.RetakeEligibleAfter = t.ConductedAt.AddDays(coolingDays);
                }

                return dto;
            }).ToList();

            var pagedResult = new PagedResult<TheoryTestDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };

            return ApiResponse<PagedResult<TheoryTestDto>>.Ok(pagedResult);
        }

        public async Task<bool> IsInCoolingPeriodAsync(Guid applicationId)
        {
            // Get the latest failed/absent theory test
            var latestTest = await _theoryRepository.GetLatestByApplicationIdAsync(applicationId);
            
            // Return false if no prior fails exist (first attempt)
            if (latestTest == null)
            {
                return false;
            }

            // If the latest test was a pass, cooling period doesn't apply
            if (latestTest.Result == TestResult.Pass)
            {
                return false;
            }

            // Check if cooling period has elapsed
            var coolingDaysStr = await _settingsService.GetAsync("COOLING_PERIOD_DAYS");
            int coolingDays = int.TryParse(coolingDaysStr, out var cd) ? cd : 7;

            var eligibleDate = latestTest.ConductedAt.AddDays(coolingDays);
            return DateTime.UtcNow < eligibleDate;
        }

        public async Task<bool> HasReachedMaxAttemptsAsync(Guid applicationId)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId);
            if (application == null)
            {
                return false;
            }

            var maxAttemptsStr = await _settingsService.GetAsync("MAX_THEORY_ATTEMPTS");
            int maxAttempts = int.TryParse(maxAttemptsStr, out var ma) ? ma : 3;

            return application.TheoryAttemptCount >= maxAttempts;
        }
    }
}