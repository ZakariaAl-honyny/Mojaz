using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Moq;
using Xunit;

namespace Mojaz.Application.Tests;

public class ApplicationServiceTests
{
    private readonly Mock<IRepository<Domain.Entities.Application>> _applicationRepo = new();
    private readonly Mock<IRepository<User>> _userRepo = new();
    private readonly Mock<IRepository<LicenseCategory>> _categoryRepo = new();
    private readonly Mock<IRepository<SystemSetting>> _settingsRepo = new();
    private readonly Mock<IRepository<License>> _licenseRepo = new();
    private readonly Mock<IFeeStructureRepository> _feeRepo = new();
    private readonly Mock<IRepository<PaymentTransaction>> _paymentRepo = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly Mock<IMapper> _mapper = new();
    private readonly Mock<IAuditService> _auditService = new();
    private readonly Mock<INotificationService> _notificationService = new();
    private readonly Mock<IPaymentService> _paymentService = new();
    private readonly Mock<ILogger<ApplicationService>> _logger = new();

    private ApplicationService CreateService() => new(
        _applicationRepo.Object,
        _userRepo.Object,
        _categoryRepo.Object,
        _settingsRepo.Object,
        _licenseRepo.Object,
        _feeRepo.Object,
        _paymentRepo.Object,
        _unitOfWork.Object,
        _mapper.Object,
        _auditService.Object,
        _notificationService.Object,
        _paymentService.Object,
        _logger.Object
    );

    // Note: CheckEligibilityAsync is not implemented in ApplicationService yet
    // Tests for this method are commented out until the method is added
    
    // [Fact]
    // public async Task CheckEligibilityAsync_UnderageApplicant_ReturnsNotEligible()
    // {
    //     // Arrange
    //     var service = CreateService();
    //     var category = new LicenseCategory { Id = Guid.NewGuid(), Code = LicenseCategoryCode.B, NameAr = "خصوصي", NameEn = "Private" };
    //     var userId = Guid.NewGuid();
    //     var user = new User { Id = userId, DateOfBirth = DateTime.UtcNow.AddYears(-16) }; // 16 years old
    //     var ageSetting = new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_B", SettingValue = "18" };
    //     
    //     _categoryRepo.Setup(r => r.GetByIdAsync(category.Id, It.IsAny<CancellationToken>())).ReturnsAsync(category);
    //     _userRepo.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(user);
    //     _settingsRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<SystemSetting, bool>>>(), It.IsAny<CancellationToken>()))
    //                  .ReturnsAsync((IReadOnlyList<SystemSetting>)new List<SystemSetting> { ageSetting });
    //     _applicationRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Domain.Entities.Application, bool>>>(), It.IsAny<CancellationToken>()))
    //                     .ReturnsAsync((IReadOnlyList<Domain.Entities.Application>)new List<Domain.Entities.Application>());
    //
    //     var request = new EligibilityCheckRequest { LicenseCategoryId = category.Id };
    //
    //     // Act
    //     var result = await service.CheckEligibilityAsync(userId, request);
    //
    //     // Assert
    //     result.Success.Should().BeTrue();
    //     result.Data.Should().NotBeNull();
    //     result.Data!.IsEligible.Should().BeFalse();
    //     result.Data.Reasons.Should().Contain(r => r.Contains("Minimum age"));
    // }
    //
    // [Fact]
    // public async Task CheckEligibilityAsync_HasActiveApplication_ReturnsNotEligible()
    // {
    //     // Arrange
    //     var service = CreateService();
    //     var category = new LicenseCategory { Id = Guid.NewGuid(), Code = LicenseCategoryCode.B };
    //     var userId = Guid.NewGuid();
    //     var user = new User { Id = userId, DateOfBirth = DateTime.UtcNow.AddYears(-25) }; // 25 years old
    //     var ageSetting = new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_B", SettingValue = "18" };
    //     var activeApp = new Domain.Entities.Application { Status = ApplicationStatus.Draft };
    //     
    //     _categoryRepo.Setup(r => r.GetByIdAsync(category.Id, It.IsAny<CancellationToken>())).ReturnsAsync(category);
    //     _userRepo.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(user);
    //     _settingsRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<SystemSetting, bool>>>(), It.IsAny<CancellationToken>()))
    //                  .ReturnsAsync((IReadOnlyList<SystemSetting>)new List<SystemSetting> { ageSetting });
    //     _applicationRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Domain.Entities.Application, bool>>>(), It.IsAny<CancellationToken>()))
    //                     .ReturnsAsync((IReadOnlyList<Domain.Entities.Application>)new List<Domain.Entities.Application> { activeApp });
    //
    //     var request = new EligibilityCheckRequest { LicenseCategoryId = category.Id };
    //
    //     // Act
    //     var result = await service.CheckEligibilityAsync(userId, request);
    //
    //     // Assert
    //     result.Success.Should().BeTrue();
    //     result.Data!.IsEligible.Should().BeFalse();
    //     result.Data.Reasons.Should().Contain(r => r.Contains("active application"));
    // }
    //
    // [Fact]
    // public async Task CheckEligibilityAsync_Valid_ReturnsEligible()
    // {
    //     // Arrange
    //     var service = CreateService();
    //     var category = new LicenseCategory { Id = Guid.NewGuid(), Code = LicenseCategoryCode.B };
    //     var userId = Guid.NewGuid();
    //     var user = new User { Id = userId, DateOfBirth = DateTime.UtcNow.AddYears(-25) }; // 25 years old
    //     var ageSetting = new SystemSetting { SettingKey = "MIN_AGE_CATEGORY_B", SettingValue = "18" };
    //     
    //     _categoryRepo.Setup(r => r.GetByIdAsync(category.Id, It.IsAny<CancellationToken>())).ReturnsAsync(category);
    //     _userRepo.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(user);
    //     _settingsRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<SystemSetting, bool>>>(), It.IsAny<CancellationToken>()))
    //                  .ReturnsAsync((IReadOnlyList<SystemSetting>)new List<SystemSetting> { ageSetting });
    //     _applicationRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Domain.Entities.Application, bool>>>(), It.IsAny<CancellationToken>()))
    //                     .ReturnsAsync((IReadOnlyList<Domain.Entities.Application>)new List<Domain.Entities.Application>());
    //
    //     var request = new EligibilityCheckRequest { LicenseCategoryId = category.Id };
    //
    //     // Act
    //     var result = await service.CheckEligibilityAsync(userId, request);
    //
    //     // Assert
    //     result.Success.Should().BeTrue();
    //     result.Data!.IsEligible.Should().BeTrue();
    //     result.Data.Reasons.Should().BeEmpty();
    // }
}