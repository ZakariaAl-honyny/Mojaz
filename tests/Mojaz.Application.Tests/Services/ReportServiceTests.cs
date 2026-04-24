using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Reports.Dtos;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Constants;
using Mojaz.Shared;
using Xunit;

// Type aliases to avoid namespace conflicts
using ApplicationEntity = Mojaz.Domain.Entities.Application;
using MedicalExaminationEntity = Mojaz.Domain.Entities.MedicalExamination;
using TheoryTestEntity = Mojaz.Domain.Entities.TheoryTest;
using PracticalTestEntity = Mojaz.Domain.Entities.PracticalTest;
using LicenseEntity = Mojaz.Domain.Entities.License;
using SystemSettingEntity = Mojaz.Domain.Entities.SystemSetting;
using UserEntity = Mojaz.Domain.Entities.User;

namespace Mojaz.Application.Tests.Services;

public class ReportServiceTests
{
    private readonly Mock<IRepository<ApplicationEntity>> _applicationRepositoryMock;
    private readonly Mock<IRepository<MedicalExaminationEntity>> _medicalRepositoryMock;
    private readonly Mock<IRepository<TheoryTestEntity>> _theoryRepositoryMock;
    private readonly Mock<IRepository<PracticalTestEntity>> _practicalRepositoryMock;
    private readonly Mock<IRepository<LicenseEntity>> _licenseRepositoryMock;
    private readonly Mock<IRepository<SystemSettingEntity>> _settingsRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly ReportService _service;

    public ReportServiceTests()
    {
        _applicationRepositoryMock = new Mock<IRepository<ApplicationEntity>>();
        _medicalRepositoryMock = new Mock<IRepository<MedicalExaminationEntity>>();
        _theoryRepositoryMock = new Mock<IRepository<TheoryTestEntity>>();
        _practicalRepositoryMock = new Mock<IRepository<PracticalTestEntity>>();
        _licenseRepositoryMock = new Mock<IRepository<LicenseEntity>>();
        _settingsRepositoryMock = new Mock<IRepository<SystemSettingEntity>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();

        _service = new ReportService(
            _applicationRepositoryMock.Object,
            _medicalRepositoryMock.Object,
            _theoryRepositoryMock.Object,
            _practicalRepositoryMock.Object,
            _licenseRepositoryMock.Object,
            _settingsRepositoryMock.Object,
            _unitOfWorkMock.Object);
    }

    #region GetStatusDistributionAsync Tests

    [Fact]
    public async Task GetStatusDistributionAsync_WithNoApplications_ReturnsEmptyList()
    {
        // Arrange
        var mockDbSet = new Mock<DbSet<ApplicationEntity>>();
        mockDbSet.Setup(x => x.AsNoTracking()).Returns(mockDbSet.Object);
        mockDbSet.Setup(x => x.Where(It.IsAny<System.Linq.Expressions.Expression<Func<ApplicationEntity, bool>>>()))
            .Returns(mockDbSet.Object);
        mockDbSet.Setup(x => x.CountAsync(It.IsAny<System.Linq.Expressions.Expression<Func<ApplicationEntity, bool>>>(), default))
            .ReturnsAsync(0);

        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetStatusDistributionAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data.Should().BeEmpty();
    }

    [Fact]
    public async Task GetStatusDistributionAsync_WithApplications_ReturnsCorrectDistribution()
    {
        // Arrange
        var applications = new List<ApplicationEntity>
        {
            new() { Id = Guid.NewGuid(), Status = ApplicationStatus.Submitted, IsDeleted = false },
            new() { Id = Guid.NewGuid(), Status = ApplicationStatus.Submitted, IsDeleted = false },
            new() { Id = Guid.NewGuid(), Status = ApplicationStatus.Approved, IsDeleted = false },
            new() { Id = Guid.NewGuid(), Status = ApplicationStatus.Draft, IsDeleted = false },
            new() { Id = Guid.NewGuid(), Status = ApplicationStatus.Rejected, IsDeleted = false }
        }.AsQueryable();

        var mockDbSet = CreateMockDbSet(applications);
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetStatusDistributionAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data.Should().HaveCount(5);
    }

    [Fact]
    public async Task GetStatusDistributionAsync_WithDateFilter_FiltersCorrectly()
    {
        // Arrange
        var filter = new ReportingFilter
        {
            StartDate = DateTime.UtcNow.AddDays(-30),
            EndDate = DateTime.UtcNow
        };

        var mockDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        // Act
        var result = await _service.GetStatusDistributionAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task GetStatusDistributionAsync_WithBranchFilter_FiltersCorrectly()
    {
        // Arrange
        var branchId = Guid.NewGuid();
        var filter = new ReportingFilter { BranchId = branchId };

        var mockDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        // Act
        var result = await _service.GetStatusDistributionAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    #endregion

    #region GetServiceStatsAsync Tests

    [Fact]
    public async Task GetServiceStatsAsync_WithValidData_ReturnsServiceStats()
    {
        // Arrange
        var mockDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetServiceStatsAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task GetServiceStatsAsync_WithNoData_ReturnsEmptyList()
    {
        // Arrange
        var mockDbSet = new Mock<DbSet<ApplicationEntity>>();
        mockDbSet.Setup(x => x.AsNoTracking()).Returns(mockDbSet.Object);
        
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetServiceStatsAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    #endregion

    #region GetDelayedApplicationsAsync Tests

    [Fact]
    public async Task GetDelayedApplicationsAsync_WithDefaultThreshold_ReturnsPaginatedResults()
    {
        // Arrange
        var mockSettingsDbSet = new Mock<DbSet<SystemSettingEntity>>();
        _settingsRepositoryMock.Setup(x => x.Query()).Returns(mockSettingsDbSet.Object);

        var mockApplicationDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockApplicationDbSet.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetDelayedApplicationsAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task GetDelayedApplicationsAsync_WithCustomPage_ReturnsCorrectPage()
    {
        // Arrange
        var filter = new ReportingFilter();
        const int page = 2;
        const int pageSize = 5;

        var mockApplicationDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockApplicationDbSet.Object);

        // Act
        var result = await _service.GetDelayedApplicationsAsync(filter, page, pageSize);

        // Assert
        result.Success.Should().BeTrue();
        result.Data!.Page.Should().Be(page);
        result.Data!.PageSize.Should().Be(pageSize);
    }

    [Fact]
    public async Task GetDelayedApplicationsAsync_WithNoDelayedApplications_ReturnsEmptyPage()
    {
        // Arrange
        var mockApplicationDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockApplicationDbSet.Object);

        var mockSettingsDbSet = new Mock<DbSet<SystemSettingEntity>>();
        _settingsRepositoryMock.Setup(x => x.Query()).Returns(mockSettingsDbSet.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetDelayedApplicationsAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
    }

    #endregion

    #region GetTestPerformanceAsync Tests

    [Fact]
    public async Task GetTestPerformanceAsync_WithNoTests_ReturnsEmptyList()
    {
        // Arrange
        var mockDbSet = new Mock<DbSet<TheoryTestEntity>>();
        _theoryRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        var mockPracticalDbSet = new Mock<DbSet<PracticalTestEntity>>();
        _practicalRepositoryMock.Setup(x => x.Query()).Returns(mockPracticalDbSet.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetTestPerformanceAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task GetTestPerformanceAsync_WithTheoryAndPractical_ReturnsCombinedStats()
    {
        // Arrange
        var filter = new ReportingFilter();

        var mockTheoryDbSet = new Mock<DbSet<TheoryTestEntity>>();
        _theoryRepositoryMock.Setup(x => x.Query()).Returns(mockTheoryDbSet.Object);

        var mockPracticalDbSet = new Mock<DbSet<PracticalTestEntity>>();
        _practicalRepositoryMock.Setup(x => x.Query()).Returns(mockPracticalDbSet.Object);

        // Act
        var result = await _service.GetTestPerformanceAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task GetTestPerformanceAsync_WithDateFilter_FiltersTheoryTests()
    {
        // Arrange
        var filter = new ReportingFilter
        {
            StartDate = DateTime.UtcNow.AddDays(-30),
            EndDate = DateTime.UtcNow
        };

        var mockTheoryDbSet = new Mock<DbSet<TheoryTestEntity>>();
        _theoryRepositoryMock.Setup(x => x.Query()).Returns(mockTheoryDbSet.Object);

        var mockPracticalDbSet = new Mock<DbSet<PracticalTestEntity>>();
        _practicalRepositoryMock.Setup(x => x.Query()).Returns(mockPracticalDbSet.Object);

        // Act
        var result = await _service.GetTestPerformanceAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    #endregion

    #region GetBranchThroughputAsync Tests

    [Fact]
    public async Task GetBranchThroughputAsync_WithApplications_ReturnsBranchStats()
    {
        // Arrange
        var mockDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetBranchThroughputAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task GetBranchThroughputAsync_WithDateRange_FiltersApplications()
    {
        // Arrange
        var filter = new ReportingFilter
        {
            StartDate = DateTime.UtcNow.AddMonths(-1),
            EndDate = DateTime.UtcNow
        };

        var mockDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        // Act
        var result = await _service.GetBranchThroughputAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    #endregion

    #region GetEmployeeActivityAsync Tests

    [Fact]
    public async Task GetEmployeeActivityAsync_WithFinalizedApplications_ReturnsEmployeeActivity()
    {
        // Arrange
        var mockDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        var mockUserRepository = new Mock<IRepository<UserEntity>>();
        _unitOfWorkMock.Setup(x => x.Repository<UserEntity>()).Returns(mockUserRepository.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetEmployeeActivityAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task GetEmployeeActivityAsync_WithDateRange_FiltersByDate()
    {
        // Arrange
        var filter = new ReportingFilter
        {
            StartDate = DateTime.UtcNow.AddDays(-30),
            EndDate = DateTime.UtcNow
        };

        var mockDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        var mockUserRepository = new Mock<IRepository<UserEntity>>();
        _unitOfWorkMock.Setup(x => x.Repository<UserEntity>()).Returns(mockUserRepository.Object);

        // Act
        var result = await _service.GetEmployeeActivityAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    #endregion

    #region GetIssuanceTimelineAsync Tests

    [Fact]
    public async Task GetIssuanceTimelineAsync_WithLicenses_ReturnsDailyCounts()
    {
        // Arrange
        var mockDbSet = new Mock<DbSet<LicenseEntity>>();
        _licenseRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetIssuanceTimelineAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task GetIssuanceTimelineAsync_WithDateRange_FiltersByIssuedDate()
    {
        // Arrange
        var filter = new ReportingFilter
        {
            StartDate = DateTime.UtcNow.AddMonths(-3),
            EndDate = DateTime.UtcNow
        };

        var mockDbSet = new Mock<DbSet<LicenseEntity>>();
        _licenseRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        // Act
        var result = await _service.GetIssuanceTimelineAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task GetIssuanceTimelineAsync_WithCategoryFilter_FiltersByCategory()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var filter = new ReportingFilter { LicenseCategoryId = categoryId };

        var mockDbSet = new Mock<DbSet<LicenseEntity>>();
        _licenseRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        // Act
        var result = await _service.GetIssuanceTimelineAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task GetIssuanceTimelineAsync_WithNoLicenses_ReturnsEmptyList()
    {
        // Arrange
        var mockDbSet = new Mock<DbSet<LicenseEntity>>();
        mockDbSet.Setup(x => x.AsNoTracking()).Returns(mockDbSet.Object);
        
        _licenseRepositoryMock.Setup(x => x.Query()).Returns(mockDbSet.Object);

        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetIssuanceTimelineAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
    }

    #endregion

    #region ExportReportsToCsvAsync Tests

    [Fact]
    public async Task ExportReportsToCsvAsync_WithValidData_ReturnsCsvBytes()
    {
        // Arrange
        var filter = new ReportingFilter();

        var mockApplicationDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockApplicationDbSet.Object);

        // Act
        var result = await _service.ExportReportsToCsvAsync(filter);

        // Assert
        result.Should().NotBeNull();
        result.Should().NotBeEmpty();
    }

    [Fact]
    public async Task ExportReportsToCsvAsync_WithEmptyData_ReturnsValidCsv()
    {
        // Arrange
        var filter = new ReportingFilter();

        var mockApplicationDbSet = new Mock<DbSet<ApplicationEntity>>();
        _applicationRepositoryMock.Setup(x => x.Query()).Returns(mockApplicationDbSet.Object);

        // Act
        var result = await _service.ExportReportsToCsvAsync(filter);

        // Assert
        result.Should().NotBeNull();
        var csvContent = System.Text.Encoding.UTF8.GetString(result);
        csvContent.Should().Contain("Report Type");
    }

    #endregion

    #region GetDashboardSummaryAsync Tests

    [Fact]
    public async Task GetDashboardSummaryAsync_WithFilter_ReturnsSummary()
    {
        // Arrange
        var filter = new ReportingFilter();

        // Act
        var result = await _service.GetDashboardSummaryAsync(filter);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
    }

    #endregion

    #region Helper Methods

    private static Mock<DbSet<T>> CreateMockDbSet<T>(IQueryable<T> source) where T : class
    {
        var mockDbSet = new Mock<DbSet<T>>();
        mockDbSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(source.Provider);
        mockDbSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(source.Expression);
        mockDbSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(source.ElementType);
        mockDbSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(source.GetEnumerator());
        return mockDbSet;
    }

    #endregion
}