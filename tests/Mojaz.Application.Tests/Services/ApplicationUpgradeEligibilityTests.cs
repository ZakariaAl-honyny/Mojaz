using Moq;
using DrivingLicenseIssuanceSystem.Application.Services;
using DrivingLicenseIssuanceSystem.Application.DTOs.Application;
using DrivingLicenseIssuanceSystem.Domain.Interfaces;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using AutoMapper;
using Hangfire;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Services;
using System.Linq.Expressions;
using FluentAssertions;

namespace DrivingLicenseIssuanceSystem.Application.Tests.Services;

public class ApplicationUpgradeEligibilityTests
{
    [Fact]
    public void ApplicationService_CanBeCreated()
    {
        // Arrange
        var mockAppRepo = new Mock<IRepository<DrivingLicenseIssuanceSystem.Domain.Entities.Application>>();
        var mockUserRepo = new Mock<IRepository<User>>();
        var mockCatRepo = new Mock<IRepository<LicenseCategory>>();
        var mockSettingsRepo = new Mock<IRepository<SystemSetting>>();
        var mockUow = new Mock<IUnitOfWork>();
        var mockMapper = new Mock<IMapper>();
        var mockAudit = new Mock<IAuditService>();
        var mockNotification = new Mock<INotificationService>();

        // Act
        var service = new ApplicationService(
            mockAppRepo.Object,
            mockUserRepo.Object,
            mockCatRepo.Object,
            mockSettingsRepo.Object,
            mockUow.Object,
            mockMapper.Object,
            mockAudit.Object,
            mockNotification.Object
        );

        // Assert
        service.Should().NotBeNull();
    }
}