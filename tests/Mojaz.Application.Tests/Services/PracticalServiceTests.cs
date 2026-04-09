using AutoMapper;
using Moq;
using Mojaz.Application.DTOs.Practical;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Tests.Services
{
    public class PracticalServiceTests
    {
        private readonly Mock<IPracticalRepository> _practicalRepoMock;
        private readonly Mock<IRepository<ApplicationEntity>> _appRepoMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IAuditService> _auditServiceMock;
        private readonly Mock<INotificationService> _notificationServiceMock;
        private readonly Mock<ISystemSettingsService> _settingsServiceMock;
        private readonly PracticalService _sut;

        public PracticalServiceTests()
        {
            _practicalRepoMock = new Mock<IPracticalRepository>();
            _appRepoMock = new Mock<IRepository<ApplicationEntity>>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _auditServiceMock = new Mock<IAuditService>();
            _notificationServiceMock = new Mock<INotificationService>();
            _settingsServiceMock = new Mock<ISystemSettingsService>();

            _settingsServiceMock.Setup(s => s.GetAsync("MIN_PASS_SCORE_PRACTICAL")).ReturnsAsync("75");
            _settingsServiceMock.Setup(s => s.GetAsync("MAX_PRACTICAL_ATTEMPTS")).ReturnsAsync("3");
            _settingsServiceMock.Setup(s => s.GetAsync("COOLING_PERIOD_DAYS_PRACTICAL")).ReturnsAsync("7");

            _sut = new PracticalService(
                _practicalRepoMock.Object,
                _appRepoMock.Object,
                _unitOfWorkMock.Object,
                _mapperMock.Object,
                _auditServiceMock.Object,
                _notificationServiceMock.Object,
                _settingsServiceMock.Object);
        }

        [Fact]
        public async Task SubmitResultAsync_PassResult_TransitionsToApproved()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical, PracticalAttemptCount = 0 };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            var result = await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 80, IsAbsent = false }, Guid.NewGuid());

            Assert.True(result.Success);
            Assert.Equal(ApplicationStatus.Approved, application.Status);
            Assert.Equal(ApplicationStages.FinalApproval, application.CurrentStage);
        }

        [Fact]
        public async Task SubmitResultAsync_PassResult_SendsPassNotification()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, ApplicantId = Guid.NewGuid(), Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 80, IsAbsent = false }, Guid.NewGuid());

            _notificationServiceMock.Verify(n => n.SendAsync(It.Is<NotificationRequest>(r => r.EventType == NotificationEventType.TestResultReady && r.TitleEn.Contains("passed"))), Times.Once);
        }

        [Fact]
        public async Task SubmitResultAsync_PassResult_CreatesAuditLog()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 80, IsAbsent = false }, Guid.NewGuid());

            _auditServiceMock.Verify(a => a.LogAsync("SUBMIT_PRACTICAL_RESULT", "PracticalTest", It.IsAny<string>(), null, It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task SubmitResultAsync_WrongStage_ReturnsBadRequest()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, CurrentStage = ApplicationStages.Theory };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, It.IsAny<CancellationToken>())).ReturnsAsync(application);

            var result = await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 80 }, Guid.NewGuid());

            Assert.False(result.Success);
            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async Task SubmitResultAsync_ApplicationNotFound_ReturnsNotFound()
        {
            _appRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((ApplicationEntity)null);

            var result = await _sut.SubmitResultAsync(Guid.NewGuid(), new SubmitPracticalResultRequest { Score = 80 }, Guid.NewGuid());

            Assert.False(result.Success);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task SubmitResultAsync_FailResultWithAdditionalTraining_SetsAdditionalTrainingRequired()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 60, IsAbsent = false, RequiresAdditionalTraining = true, AdditionalHoursRequired = 5 }, Guid.NewGuid());

            Assert.True(application.AdditionalTrainingRequired);
        }

        [Fact]
        public async Task SubmitResultAsync_FailResultWithAdditionalTraining_RecordsAdditionalHours()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 60, IsAbsent = false, RequiresAdditionalTraining = true, AdditionalHoursRequired = 5 }, Guid.NewGuid());

            _practicalRepoMock.Verify(r => r.AddAsync(It.Is<PracticalTest>(pt => pt.AdditionalHoursRequired == 5), default), Times.Once);
        }

        [Fact]
        public async Task SubmitResultAsync_FailResult_IncrementsPracticalAttemptCount()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical, PracticalAttemptCount = 0 };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 50 }, Guid.NewGuid());

            Assert.Equal(1, application.PracticalAttemptCount);
        }

        [Fact]
        public async Task SubmitResultAsync_FailResult_SendsFailNotification()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 50 }, Guid.NewGuid());

            _notificationServiceMock.Verify(n => n.SendAsync(It.Is<NotificationRequest>(r => r.EventType == NotificationEventType.TestResultReady && r.TitleEn.Contains("did not pass"))), Times.Once);
        }

        [Fact]
        public async Task SubmitResultAsync_AbsentResult_CountsAsFailedAttempt()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical, PracticalAttemptCount = 0 };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { IsAbsent = true }, Guid.NewGuid());

            Assert.Equal(1, application.PracticalAttemptCount);
            _practicalRepoMock.Verify(r => r.AddAsync(It.Is<PracticalTest>(pt => pt.Result == TestResult.Absent), default), Times.Once);
        }

        [Fact]
        public async Task HasAdditionalTrainingRequiredAsync_FlagSet_ReturnsTrue()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, AdditionalTrainingRequired = true };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);

            var result = await _sut.HasAdditionalTrainingRequiredAsync(appId);

            Assert.True(result);
        }

        [Fact]
        public async Task SubmitResultAsync_TerminalFail_TransitionsToRejected()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical, PracticalAttemptCount = 2 };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 50 }, Guid.NewGuid());

            Assert.Equal(ApplicationStatus.Rejected, application.Status);
            Assert.Equal("MaxPracticalAttemptsReached", application.RejectionReason);
        }

        [Fact]
        public async Task SubmitResultAsync_TerminalFail_SendsRejectionNotification()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical, PracticalAttemptCount = 2 };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 50 }, Guid.NewGuid());

            _notificationServiceMock.Verify(n => n.SendAsync(It.Is<NotificationRequest>(r => r.EventType == NotificationEventType.ApplicationRejected)), Times.Once);
        }

        [Fact]
        public async Task SubmitResultAsync_AtMaxAttempts_ReturnsBadRequest()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, Status = ApplicationStatus.InReview, CurrentStage = ApplicationStages.Practical, PracticalAttemptCount = 3 };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);

            var result = await _sut.SubmitResultAsync(appId, new SubmitPracticalResultRequest { Score = 50 }, Guid.NewGuid());

            Assert.False(result.Success);
            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async Task HasReachedMaxAttemptsAsync_AtLimit_ReturnsTrue()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, PracticalAttemptCount = 3 };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);

            var result = await _sut.HasReachedMaxAttemptsAsync(appId);

            Assert.True(result);
        }

        [Fact]
        public async Task IsInCoolingPeriodAsync_WithinPeriod_ReturnsTrue()
        {
            var appId = Guid.NewGuid();
            var test = new PracticalTest { ConductedAt = DateTime.UtcNow.AddDays(-3), Result = TestResult.Fail };
            _practicalRepoMock.Setup(r => r.GetLatestByApplicationIdAsync(appId)).ReturnsAsync(test);

            var result = await _sut.IsInCoolingPeriodAsync(appId);

            Assert.True(result);
        }

        [Fact]
        public async Task IsInCoolingPeriodAsync_AfterPeriod_ReturnsFalse()
        {
            var appId = Guid.NewGuid();
            var test = new PracticalTest { ConductedAt = DateTime.UtcNow.AddDays(-10), Result = TestResult.Fail };
            _practicalRepoMock.Setup(r => r.GetLatestByApplicationIdAsync(appId)).ReturnsAsync(test);

            var result = await _sut.IsInCoolingPeriodAsync(appId);

            Assert.False(result);
        }

        [Fact]
        public async Task IsInCoolingPeriodAsync_NoPreviousFail_ReturnsFalse()
        {
            var appId = Guid.NewGuid();
            _practicalRepoMock.Setup(r => r.GetLatestByApplicationIdAsync(appId)).ReturnsAsync((PracticalTest)null);

            var result = await _sut.IsInCoolingPeriodAsync(appId);

            Assert.False(result);
        }

        [Fact]
        public async Task GetHistoryAsync_Applicant_ReturnsOwnHistory()
        {
            var appId = Guid.NewGuid();
            var applicantId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, ApplicantId = applicantId, Status = ApplicationStatus.InReview };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);

            var tests = new List<PracticalTest> { new PracticalTest { Result = TestResult.Fail } };
            _practicalRepoMock.Setup(r => r.GetAllByApplicationIdAsync(appId)).ReturnsAsync(tests);
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            var result = await _sut.GetHistoryAsync(appId, applicantId, "Applicant");

            Assert.True(result.Success);
            Assert.NotEmpty(result.Data.Items);
        }

        [Fact]
        public async Task GetHistoryAsync_OtherApplicant_ReturnsForbidden()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, ApplicantId = Guid.NewGuid() };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);

            var result = await _sut.GetHistoryAsync(appId, Guid.NewGuid(), "Applicant");

            Assert.False(result.Success);
            Assert.Equal(403, result.StatusCode);
        }

        [Fact]
        public async Task GetHistoryAsync_Manager_ReturnsFullHistory()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, ApplicantId = Guid.NewGuid(), Status = ApplicationStatus.InReview };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _practicalRepoMock.Setup(r => r.GetAllByApplicationIdAsync(appId)).ReturnsAsync(new List<PracticalTest> { new PracticalTest() });
            _mapperMock.Setup(m => m.Map<PracticalTestDto>(It.IsAny<PracticalTest>())).Returns(new PracticalTestDto());

            var result = await _sut.GetHistoryAsync(appId, Guid.NewGuid(), "Manager");

            Assert.True(result.Success);
            Assert.Single(result.Data.Items);
        }

        [Fact]
        public async Task GetHistoryAsync_NoRecords_ReturnsEmptyPagedResult()
        {
            var appId = Guid.NewGuid();
            var application = new ApplicationEntity { Id = appId, ApplicantId = Guid.NewGuid(), Status = ApplicationStatus.InReview };
            _appRepoMock.Setup(r => r.GetByIdAsync(appId, default)).ReturnsAsync(application);
            _practicalRepoMock.Setup(r => r.GetAllByApplicationIdAsync(appId)).ReturnsAsync(new List<PracticalTest>());

            var result = await _sut.GetHistoryAsync(appId, Guid.NewGuid(), "Manager");

            Assert.True(result.Success);
            Assert.Empty(result.Data.Items);
        }

        [Fact]
        public async Task GetHistoryAsync_ApplicationNotFound_Returns404()
        {
            _appRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((ApplicationEntity)null);

            var result = await _sut.GetHistoryAsync(Guid.NewGuid(), Guid.NewGuid(), "Applicant");

            Assert.False(result.Success);
            Assert.Equal(404, result.StatusCode);
        }
    }
}
