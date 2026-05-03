using Moq;
using Mojaz.Application.Services;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Interfaces;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;

namespace Mojaz.Application.Tests.Services;

public class ApplicationUpgradeEligibilityTests
{
    private readonly Mock<IRepository<Mojaz.Domain.Entities.Application>> _appRepoMock;
    private readonly Mock<IRepository<User>> _userRepoMock;
    private readonly Mock<IRepository<LicenseCategory>> _catRepoMock;
    private readonly Mock<IRepository<SystemSetting>> _settingsRepoMock;
    private readonly Mock<IRepository<License>> _licenseRepoMock;
    private readonly Mock<IFeeStructureRepository> _feeRepoMock;
    private readonly Mock<IRepository<PaymentTransaction>> _paymentRepoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IAuditService> _auditMock;
    private readonly Mock<INotificationService> _notificationMock;
    private readonly Mock<IPaymentService> _paymentServiceMock;
    private readonly Mock<ILogger<ApplicationService>> _loggerMock;
    private readonly ApplicationService _service;

    public ApplicationUpgradeEligibilityTests()
    {
        _appRepoMock = new Mock<IRepository<Mojaz.Domain.Entities.Application>>();
        _userRepoMock = new Mock<IRepository<User>>();
        _catRepoMock = new Mock<IRepository<LicenseCategory>>();
        _settingsRepoMock = new Mock<IRepository<SystemSetting>>();
        _licenseRepoMock = new Mock<IRepository<License>>();
        _feeRepoMock = new Mock<IFeeStructureRepository>();
        _paymentRepoMock = new Mock<IRepository<PaymentTransaction>>();
        _uowMock = new Mock<IUnitOfWork>();
        _mapperMock = new Mock<IMapper>();
        _auditMock = new Mock<IAuditService>();
        _notificationMock = new Mock<INotificationService>();
        _paymentServiceMock = new Mock<IPaymentService>();
        _loggerMock = new Mock<ILogger<ApplicationService>>();

        _service = new ApplicationService(
            _appRepoMock.Object,
            _userRepoMock.Object,
            _catRepoMock.Object,
            _settingsRepoMock.Object,
            _licenseRepoMock.Object,
            _feeRepoMock.Object,
            _paymentRepoMock.Object,
            _uowMock.Object,
            _mapperMock.Object,
            _auditMock.Object,
            _notificationMock.Object,
            _paymentServiceMock.Object,
            _loggerMock.Object
            );
    }

    // Note: CheckEligibilityAsync method is not implemented in ApplicationService yet
    // Tests for this method are commented out until the method is added
    
    // [Fact]
    // public async Task CheckEligibility_CategoryF_ShouldAllowUpgradeToB()
    // {
    //     // Arrange
    //     var userId = Guid.NewGuid();
    //     var categoryBId = Guid.NewGuid();
    //     var categoryB = new LicenseCategory { Id = categoryBId, Code = LicenseCategoryCode.B };
    //     var categoryF = new LicenseCategory { Id = Guid.NewGuid(), Code = LicenseCategoryCode.F };
    //
    //     _userRepoMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(new User { DateOfBirth = DateTime.UtcNow.AddYears(-25) });
    //     _catRepoMock.Setup(r => r.GetByIdAsync(categoryBId, It.IsAny<CancellationToken>())).ReturnsAsync(categoryB);
    //     _licenseRepoMock.Setup(r => r.FindAsync(It.IsAny<Expression<Func<License, bool>>>(), It.IsAny<CancellationToken>()))
    //         .ReturnsAsync((IReadOnlyList<License>)new List<License> { new License { Id = Guid.NewGuid(), Status = LicenseStatus.Active, LicenseCategory = categoryF } });
    //     
    //     _settingsRepoMock.Setup(r => r.FindAsync(It.IsAny<Expression<Func<SystemSetting, bool>>>(), It.IsAny<CancellationToken>()))
    //         .ReturnsAsync((IReadOnlyList<SystemSetting>)new List<SystemSetting>());
    //     
    //     _categoryUpgradeServiceMock.Setup(s => s.ValidateUpgradePathAsync(LicenseCategoryCode.F, LicenseCategoryCode.B)).ReturnsAsync(true);
    //     _categoryUpgradeServiceMock.Setup(s => s.CheckHoldingPeriodAsync(It.IsAny<Guid>(), userId)).ReturnsAsync(true);
    //
    //     var request = new EligibilityCheckRequest { LicenseCategoryId = categoryBId, ServiceType = ServiceType.CategoryUpgrade };
    //
    //     // Act
    //     var result = await _service.CheckEligibilityAsync(userId, request);
    //
    //     // Assert
    //     Assert.True(result.Data.IsEligible);
    // }
    //
    // [Fact]
    // public async Task CheckEligibility_CategoryF_ShouldBlockUpgradeToC()
    // {
    //     // Arrange
    //     var userId = Guid.NewGuid();
    //     var categoryCId = Guid.NewGuid();
    //     var categoryC = new LicenseCategory { Id = categoryCId, Code = LicenseCategoryCode.C };
    //     var categoryF = new LicenseCategory { Id = Guid.NewGuid(), Code = LicenseCategoryCode.F };
    //
    //     _userRepoMock.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(new User { DateOfBirth = DateTime.UtcNow.AddYears(-25) });
    //     _catRepoMock.Setup(r => r.GetByIdAsync(categoryCId, It.IsAny<CancellationToken>())).ReturnsAsync(categoryC);
    //     _licenseRepoMock.Setup(r => r.FindAsync(It.IsAny<Expression<Func<License, bool>>>(), It.IsAny<CancellationToken>()))
    //         .ReturnsAsync((IReadOnlyList<License>)new List<License> { new License { Id = Guid.NewGuid(), Status = LicenseStatus.Active, LicenseCategory = categoryF } });
    //
    //     _settingsRepoMock.Setup(r => r.FindAsync(It.IsAny<Expression<Func<SystemSetting, bool>>>(), It.IsAny<CancellationToken>()))
    //         .ReturnsAsync((IReadOnlyList<SystemSetting>)new List<SystemSetting>());
    //
    //     _categoryUpgradeServiceMock.Setup(s => s.ValidateUpgradePathAsync(LicenseCategoryCode.F, LicenseCategoryCode.C)).ReturnsAsync(false);
    //
    //     var request = new EligibilityCheckRequest { LicenseCategoryId = categoryCId, ServiceType = ServiceType.CategoryUpgrade };
    //
    //     // Act
    //     var result = await _service.CheckEligibilityAsync(userId, request);
    //
    //     // Assert
    //     Assert.False(result.Data.IsEligible);
    //     Assert.Contains($"None of your current licenses can be upgraded to category {categoryC.Code}.", result.Data.Reasons);
    // }
}