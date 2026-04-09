using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Mojaz.Application.DTOs.Training;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Constants;
using AutoMapper;
using Xunit;
using System.Threading;
using Mojaz.Application.Mappings;
using Mojaz.Shared;

namespace Mojaz.Application.Tests.Services;

public class TrainingServiceTests
{
    private readonly Mock<ITrainingRepository> _trainingRepositoryMock;
    private readonly Mock<IRepository<Domain.Entities.Application>> _applicationRepositoryMock;
    private readonly Mock<IRepository<LicenseCategory>> _categoryRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<ISystemSettingsService> _settingsServiceMock;
    private readonly IMapper _mapper;
    private readonly TrainingService _service;

    public TrainingServiceTests()
    {
        _trainingRepositoryMock = new Mock<ITrainingRepository>();
        _applicationRepositoryMock = new Mock<IRepository<Domain.Entities.Application>>();
        _categoryRepositoryMock = new Mock<IRepository<LicenseCategory>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _auditServiceMock = new Mock<IAuditService>();
        _notificationServiceMock = new Mock<INotificationService>();
        _settingsServiceMock = new Mock<ISystemSettingsService>();

        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<TrainingProfile>();
        });
        _mapper = config.CreateMapper();

        _service = new TrainingService(
            _trainingRepositoryMock.Object,
            _applicationRepositoryMock.Object,
            _categoryRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _mapper,
            _auditServiceMock.Object,
            _notificationServiceMock.Object,
            _settingsServiceMock.Object);
    }

    [Fact]
    public async Task UpdateHoursAsync_WhenRequirementMet_ShouldAdvanceStageToTheory()
    {
        // Arrange
        var trainingId = Guid.NewGuid();
        var applicationId = Guid.NewGuid();
        var trainingRecord = new TrainingRecord
        {
            Id = trainingId,
            ApplicationId = applicationId,
            CompletedHours = 10,
            TotalHoursRequired = 20,
            TrainingStatus = TrainingStatus.InProgress
        };

        var application = new Domain.Entities.Application
        {
            Id = applicationId,
            CurrentStage = ApplicationStages.Training
        };

        _trainingRepositoryMock.Setup(x => x.GetByIdAsync(trainingId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(trainingRecord);
        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        var request = new UpdateTrainingHoursRequest { HoursToAdd = 10 };

        // Act
        var result = await _service.UpdateHoursAsync(trainingId, request);

        // Assert
        result.Success.Should().BeTrue();
        trainingRecord.TrainingStatus.Should().Be(TrainingStatus.Completed);
        application.CurrentStage.Should().Be(ApplicationStages.Theory);
        _applicationRepositoryMock.Verify(x => x.Update(application), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.AtLeastOnce);
    }

    [Fact]
    public async Task ApproveExemptionAsync_ShouldAdvanceStageToTheory()
    {
        // Arrange
        var trainingId = Guid.NewGuid();
        var applicationId = Guid.NewGuid();
        var trainingRecord = new TrainingRecord
        {
            Id = trainingId,
            ApplicationId = applicationId,
            TrainingStatus = TrainingStatus.ExemptionPending,
            TotalHoursRequired = 20
        };

        var application = new Domain.Entities.Application
        {
            Id = applicationId,
            CurrentStage = ApplicationStages.Training
        };

        _trainingRepositoryMock.Setup(x => x.GetByIdAsync(trainingId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(trainingRecord);
        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        var request = new ExemptionActionRequest { ActionBy = Guid.NewGuid(), Notes = "Approved" };

        // Act
        var result = await _service.ApproveExemptionAsync(trainingId, request);

        // Assert
        result.Success.Should().BeTrue();
        trainingRecord.IsExempted.Should().BeTrue();
        trainingRecord.TrainingStatus.Should().Be(TrainingStatus.Completed);
        application.CurrentStage.Should().Be(ApplicationStages.Theory);
        _applicationRepositoryMock.Verify(x => x.Update(application), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ShouldFetchRequiredHoursFromSettings()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var application = new Domain.Entities.Application { Id = applicationId, LicenseCategoryId = categoryId };
        var category = new LicenseCategory { Id = categoryId, Code = LicenseCategoryCode.B };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        _categoryRepositoryMock.Setup(x => x.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);
        _settingsServiceMock.Setup(x => x.GetAsync("MIN_TRAINING_HOURS_CATEGORY_B"))
            .ReturnsAsync("15");

        var request = new CreateTrainingRecordRequest
        {
            ApplicationId = applicationId,
            SchoolName = "Test School",
            HoursCompleted = 5,
            TrainingDate = DateTime.UtcNow
        };

        // Act
        var result = await _service.CreateAsync(request);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.TotalHoursRequired.Should().Be(15);
        _trainingRepositoryMock.Verify(x => x.AddAsync(It.IsAny<TrainingRecord>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}
