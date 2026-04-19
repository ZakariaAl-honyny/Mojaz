using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Services;
using DrivingLicenseIssuanceSystem.Application.Services;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Domain.Interfaces;
using Moq;
using Xunit;

namespace DrivingLicenseIssuanceSystem.Application.Tests.Services;

public class Gate4ValidationServiceTests
{
    private readonly Mock<IRepository<DrivingLicenseIssuanceSystem.Domain.Entities.Application>> _applicationRepositoryMock;
    private readonly Mock<IRepository<DrivingLicenseIssuanceSystem.Domain.Entities.User>> _userRepositoryMock;
    private readonly Mock<IRepository<TheoryTest>> _theoryTestRepositoryMock;
    private readonly Mock<IRepository<PracticalTest>> _practicalTestRepositoryMock;
    private readonly Mock<IRepository<MedicalExamination>> _medicalExamRepositoryMock;
    private readonly Mock<IRepository<PaymentTransaction>> _paymentRepositoryMock;
    private readonly Gate4ValidationService _service;

    public Gate4ValidationServiceTests()
    {
        _applicationRepositoryMock = new Mock<IRepository<DrivingLicenseIssuanceSystem.Domain.Entities.Application>>();
        _userRepositoryMock = new Mock<IRepository<DrivingLicenseIssuanceSystem.Domain.Entities.User>>();
        _theoryTestRepositoryMock = new Mock<IRepository<TheoryTest>>();
        _practicalTestRepositoryMock = new Mock<IRepository<PracticalTest>>();
        _medicalExamRepositoryMock = new Mock<IRepository<MedicalExamination>>();
        _paymentRepositoryMock = new Mock<IRepository<PaymentTransaction>>();

        _service = new Gate4ValidationService(
            _applicationRepositoryMock.Object,
            _userRepositoryMock.Object,
            _theoryTestRepositoryMock.Object,
            _practicalTestRepositoryMock.Object,
            _medicalExamRepositoryMock.Object,
            _paymentRepositoryMock.Object);
    }

    [Fact]
    public async Task ValidateAsync_WhenAllConditionsPassed_ShouldReturnFullyPassed()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var applicantId = Guid.NewGuid();
        var application = new DrivingLicenseIssuanceSystem.Domain.Entities.Application { Id = applicationId, ApplicantId = applicantId };
        var applicant = new DrivingLicenseIssuanceSystem.Domain.Entities.User { Id = applicantId, NationalId = "1234567890" };

        SetupMocks(applicationId, application, applicant, true, true, true, true, true, true);

        // Act
        var result = await _service.ValidateAsync(applicationId);

        // Assert
        result.IsFullyPassed.Should().BeTrue();
        result.Conditions.Should().HaveCount(6);
        result.Conditions.All(c => c.IsPassed).Should().BeTrue();
    }

    [Fact]
    public async Task ValidateAsync_WhenTheoryTestFailed_ShouldReturnNotFullyPassed()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var applicantId = Guid.NewGuid();
        var application = new DrivingLicenseIssuanceSystem.Domain.Entities.Application { Id = applicationId, ApplicantId = applicantId };
        var applicant = new DrivingLicenseIssuanceSystem.Domain.Entities.User { Id = applicantId, NationalId = "1234567890" };

        SetupMocks(applicationId, application, applicant, false, true, true, true, true, true);

        // Act
        var result = await _service.ValidateAsync(applicationId);

        // Assert
        result.IsFullyPassed.Should().BeFalse();
        result.Conditions.First(c => c.Key == "TheoryTestPassed").IsPassed.Should().BeFalse();
    }

    [Fact]
    public async Task ValidateAsync_WhenSecurityBlocked_ShouldReturnNotFullyPassed()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var applicantId = Guid.NewGuid();
        var application = new DrivingLicenseIssuanceSystem.Domain.Entities.Application { Id = applicationId, ApplicantId = applicantId };
        var applicant = new DrivingLicenseIssuanceSystem.Domain.Entities.User { Id = applicantId, NationalId = "1234567890", IsSecurityBlocked = true };

        // Setup specific mock for security blocked scenario
        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>())).ReturnsAsync(application);
        _userRepositoryMock.Setup(x => x.GetByIdAsync(application.ApplicantId, It.IsAny<CancellationToken>())).ReturnsAsync(applicant);

        // Setup mocks for other conditions that should pass
        var theoryResult = TestResult.Pass;
        _theoryTestRepositoryMock.Setup(x => x.FindAsync(It.IsAny<Expression<Func<TheoryTest, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<TheoryTest> { new TheoryTest { ApplicationId = applicationId, Result = theoryResult, CreatedAt = DateTime.UtcNow } });

        var practicalResult = TestResult.Pass;
        _practicalTestRepositoryMock.Setup(x => x.FindAsync(It.IsAny<Expression<Func<PracticalTest, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<PracticalTest> { new PracticalTest { ApplicationId = applicationId, Result = practicalResult, CreatedAt = DateTime.UtcNow } });

        var medicalResult = MedicalFitnessResult.Fit;
        var validUntil = DateTime.UtcNow.AddDays(30);
        _medicalExamRepositoryMock.Setup(x => x.FindAsync(It.IsAny<Expression<Func<MedicalExamination, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<MedicalExamination> { new MedicalExamination { ApplicationId = applicationId, FitnessResult = medicalResult, ValidUntil = validUntil, CreatedAt = DateTime.UtcNow } });

        var paymentStatus = PaymentStatus.Paid;
        _paymentRepositoryMock.Setup(x => x.FindAsync(It.IsAny<Expression<Func<PaymentTransaction, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<PaymentTransaction> { new PaymentTransaction { ApplicationId = applicationId, Status = paymentStatus } });

        // Act
        var result = await _service.ValidateAsync(applicationId);

        // Assert
        result.IsFullyPassed.Should().BeFalse();
        result.Conditions.First(c => c.Key == "SecurityStatusClean").IsPassed.Should().BeFalse();
    }

    [Fact]
    public async Task ValidateAsync_WhenMedicalExpired_ShouldReturnNotFullyPassed()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var applicantId = Guid.NewGuid();
        var application = new DrivingLicenseIssuanceSystem.Domain.Entities.Application { Id = applicationId, ApplicantId = applicantId };
        var applicant = new DrivingLicenseIssuanceSystem.Domain.Entities.User { Id = applicantId, NationalId = "1234567890" };

        SetupMocks(applicationId, application, applicant, true, true, true, true, false, true);

        // Act
        var result = await _service.ValidateAsync(applicationId);

        // Assert
        result.IsFullyPassed.Should().BeFalse();
        result.Conditions.First(c => c.Key == "MedicalCertificateValid").IsPassed.Should().BeFalse();
    }

    private void SetupMocks(Guid applicationId, DrivingLicenseIssuanceSystem.Domain.Entities.Application application, DrivingLicenseIssuanceSystem.Domain.Entities.User applicant, 
        bool theoryPass, bool practicalPass, bool securityClean, bool identityValid, bool medicalValid, bool paymentsCleared)
    {
        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>())).ReturnsAsync(application);
        _userRepositoryMock.Setup(x => x.GetByIdAsync(application.ApplicantId, It.IsAny<CancellationToken>())).ReturnsAsync(applicant);

        // Theory
        var theoryResult = theoryPass ? TestResult.Pass : TestResult.Fail;
        _theoryTestRepositoryMock.Setup(x => x.FindAsync(It.IsAny<Expression<Func<TheoryTest, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<TheoryTest> { new TheoryTest { ApplicationId = applicationId, Result = theoryResult, CreatedAt = DateTime.UtcNow } });

        // Practical
        var practicalResult = practicalPass ? TestResult.Pass : TestResult.Fail;
        _practicalTestRepositoryMock.Setup(x => x.FindAsync(It.IsAny<Expression<Func<PracticalTest, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<PracticalTest> { new PracticalTest { ApplicationId = applicationId, Result = practicalResult, CreatedAt = DateTime.UtcNow } });

        // Medical
        var medicalResult = medicalValid ? MedicalFitnessResult.Fit : MedicalFitnessResult.Unfit;
        var validUntil = medicalValid ? DateTime.UtcNow.AddDays(30) : DateTime.UtcNow.AddDays(-1);
        _medicalExamRepositoryMock.Setup(x => x.FindAsync(It.IsAny<Expression<Func<MedicalExamination, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<MedicalExamination> { new MedicalExamination { ApplicationId = applicationId, FitnessResult = medicalResult, ValidUntil = validUntil, CreatedAt = DateTime.UtcNow } });

        // Payments
        var paymentStatus = paymentsCleared ? PaymentStatus.Paid : PaymentStatus.Pending;
        _paymentRepositoryMock.Setup(x => x.FindAsync(It.IsAny<Expression<Func<PaymentTransaction, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<PaymentTransaction> { new PaymentTransaction { ApplicationId = applicationId, Status = paymentStatus } });
    }
}
