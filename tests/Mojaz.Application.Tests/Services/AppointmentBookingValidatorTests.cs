using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Mojaz.Application.DTOs.Appointments;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Xunit;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Tests.Services;

public class AppointmentBookingValidatorTests
{
    private readonly Mock<IAppointmentRepository> _appointmentRepositoryMock;
    private readonly Mock<IRepository<ApplicationEntity>> _applicationRepositoryMock;
    private readonly Mock<ISystemSettingsService> _systemSettingsServiceMock;
    private readonly AppointmentBookingValidator _validator;

    public AppointmentBookingValidatorTests()
    {
        _appointmentRepositoryMock = new Mock<IAppointmentRepository>();
        _applicationRepositoryMock = new Mock<IRepository<ApplicationEntity>>();
        _systemSettingsServiceMock = new Mock<ISystemSettingsService>();
        
        _validator = new AppointmentBookingValidator(
            _appointmentRepositoryMock.Object,
            _applicationRepositoryMock.Object,
            _systemSettingsServiceMock.Object);
    }

    #region ValidateBookingAsync Tests

    [Fact]
    public async Task ValidateBookingAsync_ApplicationNotFound_ReturnsError()
    {
        // Arrange
        var request = new CreateAppointmentRequest
        {
            ApplicationId = Guid.NewGuid(),
            Type = AppointmentType.PracticalTest,
            BranchId = Guid.NewGuid(),
            ScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5)),
            TimeSlot = "09:00"
        };

        _applicationRepositoryMock
            .Setup(x => x.GetByIdAsync(request.ApplicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((ApplicationEntity?)null);

        // Act
        var result = await _validator.ValidateBookingAsync(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain("Application not found");
    }

    [Fact]
    public async Task ValidateBookingAsync_ApplicationNotInCorrectStatus_ReturnsError()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var application = new ApplicationEntity
        {
            Id = applicationId,
            Status = ApplicationStatus.Draft // Not in allowed statuses
        };

        var request = new CreateAppointmentRequest
        {
            ApplicationId = applicationId,
            Type = AppointmentType.PracticalTest,
            BranchId = Guid.NewGuid(),
            ScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5)),
            TimeSlot = "09:00"
        };

        _applicationRepositoryMock
            .Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        // Act
        var result = await _validator.ValidateBookingAsync(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.Contains("does not allow booking"));
    }

    [Fact]
    public async Task ValidateBookingAsync_ExistingActiveAppointment_ReturnsError()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var branchId = Guid.NewGuid();
        
        var application = new ApplicationEntity
        {
            Id = applicationId,
            Status = ApplicationStatus.Submitted
        };

        var existingAppointment = new Appointment
        {
            Id = Guid.NewGuid(),
            ApplicationId = applicationId,
            AppointmentType = AppointmentType.PracticalTest,
            Status = "Scheduled"
        };

        var request = new CreateAppointmentRequest
        {
            ApplicationId = applicationId,
            Type = AppointmentType.PracticalTest,
            BranchId = branchId,
            ScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5)),
            TimeSlot = "09:00"
        };

        _applicationRepositoryMock
            .Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        _appointmentRepositoryMock
            .Setup(x => x.GetByApplicationIdAsync(applicationId, AppointmentType.PracticalTest, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingAppointment);

        // Act
        var result = await _validator.ValidateBookingAsync(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.Contains("active") && e.Contains("already exists"));
    }

    [Fact]
    public async Task ValidateBookingAsync_PastDate_ReturnsError()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var application = new ApplicationEntity
        {
            Id = applicationId,
            Status = ApplicationStatus.Submitted
        };

        var request = new CreateAppointmentRequest
        {
            ApplicationId = applicationId,
            Type = AppointmentType.PracticalTest,
            BranchId = Guid.NewGuid(),
            ScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)), // Past date
            TimeSlot = "09:00"
        };

        _applicationRepositoryMock
            .Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        _appointmentRepositoryMock
            .Setup(x => x.GetByApplicationIdAsync(applicationId, AppointmentType.PracticalTest, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Appointment?)null);

        // Act
        var result = await _validator.ValidateBookingAsync(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain("Cannot book an appointment for a past date");
    }

    [Fact]
    public async Task ValidateBookingAsync_SlotFull_ReturnsError()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var branchId = Guid.NewGuid();
        var scheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5));
        
        var application = new ApplicationEntity
        {
            Id = applicationId,
            Status = ApplicationStatus.Submitted
        };

        var request = new CreateAppointmentRequest
        {
            ApplicationId = applicationId,
            Type = AppointmentType.PracticalTest,
            BranchId = branchId,
            ScheduledDate = scheduledDate,
            TimeSlot = "09:00"
        };

        _applicationRepositoryMock
            .Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        _appointmentRepositoryMock
            .Setup(x => x.GetByApplicationIdAsync(applicationId, AppointmentType.PracticalTest, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Appointment?)null);

        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MIN_BOOKING_DAYS_AHEAD"))
            .ReturnsAsync(1);
        
        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MAX_BOOKING_DAYS_AHEAD"))
            .ReturnsAsync(30);
        
        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MAX_APPOINTMENTS_PER_SLOT"))
            .ReturnsAsync(2);

        // Slot is fully booked (2 appointments)
        _appointmentRepositoryMock
            .Setup(x => x.GetBookedSlotCountAsync(branchId, scheduledDate, "09:00", It.IsAny<CancellationToken>()))
            .ReturnsAsync(2);

        // Act
        var result = await _validator.ValidateBookingAsync(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.Contains("fully booked"));
    }

    [Fact]
    public async Task ValidateBookingAsync_ValidRequest_ReturnsSuccess()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var branchId = Guid.NewGuid();
        var scheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5));
        
        var application = new ApplicationEntity
        {
            Id = applicationId,
            Status = ApplicationStatus.Submitted
        };

        var request = new CreateAppointmentRequest
        {
            ApplicationId = applicationId,
            Type = AppointmentType.PracticalTest,
            BranchId = branchId,
            ScheduledDate = scheduledDate,
            TimeSlot = "09:00"
        };

        _applicationRepositoryMock
            .Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        _appointmentRepositoryMock
            .Setup(x => x.GetByApplicationIdAsync(applicationId, AppointmentType.PracticalTest, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Appointment?)null);

        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MIN_BOOKING_DAYS_AHEAD"))
            .ReturnsAsync(1);
        
        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MAX_BOOKING_DAYS_AHEAD"))
            .ReturnsAsync(30);
        
        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MAX_APPOINTMENTS_PER_SLOT"))
            .ReturnsAsync(2);

        _appointmentRepositoryMock
            .Setup(x => x.GetBookedSlotCountAsync(branchId, scheduledDate, "09:00", It.IsAny<CancellationToken>()))
            .ReturnsAsync(1); // Only 1 booked, so still available

        _systemSettingsServiceMock
            .Setup(x => x.GetAsync("WORKING_HOURS_START"))
            .ReturnsAsync("08:00");
        
        _systemSettingsServiceMock
            .Setup(x => x.GetAsync("WORKING_HOURS_END"))
            .ReturnsAsync("16:00");

        // Act
        var result = await _validator.ValidateBookingAsync(request);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    #endregion

    #region ValidateRescheduleAsync Tests

    [Fact]
    public async Task ValidateRescheduleAsync_AppointmentNotFound_ReturnsError()
    {
        // Arrange
        var appointmentId = Guid.NewGuid();
        var request = new RescheduleAppointmentRequest
        {
            NewScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10)),
            NewTimeSlot = "10:00"
        };

        _appointmentRepositoryMock
            .Setup(x => x.GetByIdForRescheduleAsync(appointmentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Appointment?)null);

        // Act
        var result = await _validator.ValidateRescheduleAsync(appointmentId, request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain("Appointment not found");
    }

    [Fact]
    public async Task ValidateRescheduleAsync_MaxRescheduleReached_ReturnsError()
    {
        // Arrange
        var appointmentId = Guid.NewGuid();
        var appointment = new Appointment
        {
            Id = appointmentId,
            RescheduleCount = 3, // Reached max
            BranchId = Guid.NewGuid(),
            TimeSlot = "09:00",
            Status = "Scheduled"
        };

        var request = new RescheduleAppointmentRequest
        {
            NewScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10)),
            NewTimeSlot = "10:00"
        };

        _appointmentRepositoryMock
            .Setup(x => x.GetByIdForRescheduleAsync(appointmentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(appointment);

        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MAX_RESCHEDULE_COUNT"))
            .ReturnsAsync(3);

        // Act
        var result = await _validator.ValidateRescheduleAsync(appointmentId, request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.Contains("Maximum reschedule limit"));
    }

    [Fact]
    public async Task ValidateRescheduleAsync_CancelledAppointment_ReturnsError()
    {
        // Arrange
        var appointmentId = Guid.NewGuid();
        var appointment = new Appointment
        {
            Id = appointmentId,
            RescheduleCount = 0,
            BranchId = Guid.NewGuid(),
            TimeSlot = "09:00",
            Status = "Cancelled" // Already cancelled
        };

        var request = new RescheduleAppointmentRequest
        {
            NewScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10)),
            NewTimeSlot = "10:00"
        };

        _appointmentRepositoryMock
            .Setup(x => x.GetByIdForRescheduleAsync(appointmentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(appointment);

        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MAX_RESCHEDULE_COUNT"))
            .ReturnsAsync(3);

        // Act
        var result = await _validator.ValidateRescheduleAsync(appointmentId, request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain("Cannot reschedule a cancelled or completed appointment");
    }

    [Fact]
    public async Task ValidateRescheduleAsync_ValidRequest_ReturnsSuccess()
    {
        // Arrange
        var appointmentId = Guid.NewGuid();
        var branchId = Guid.NewGuid();
        
        var appointment = new Appointment
        {
            Id = appointmentId,
            RescheduleCount = 1,
            BranchId = branchId,
            TimeSlot = "09:00",
            Status = "Scheduled"
        };

        var newDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10));
        
        var request = new RescheduleAppointmentRequest
        {
            NewScheduledDate = newDate,
            NewTimeSlot = "10:00"
        };

        _appointmentRepositoryMock
            .Setup(x => x.GetByIdForRescheduleAsync(appointmentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(appointment);

        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MAX_RESCHEDULE_COUNT"))
            .ReturnsAsync(3);

        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MIN_BOOKING_DAYS_AHEAD"))
            .ReturnsAsync(1);
        
        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MAX_BOOKING_DAYS_AHEAD"))
            .ReturnsAsync(30);

        _systemSettingsServiceMock
            .Setup(x => x.GetIntAsync("MAX_APPOINTMENTS_PER_SLOT"))
            .ReturnsAsync(2);

        _appointmentRepositoryMock
            .Setup(x => x.GetBookedSlotCountAsync(branchId, newDate, "10:00", It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _validator.ValidateRescheduleAsync(appointmentId, request);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    #endregion
}