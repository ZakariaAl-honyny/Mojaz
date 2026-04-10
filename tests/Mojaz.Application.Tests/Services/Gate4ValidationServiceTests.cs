using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Moq;
using Xunit;

namespace Mojaz.Application.Tests.Services;

public class Gate4ValidationServiceTests
{
    private readonly Mock<IRepository<Mojaz.Domain.Entities.Application>> _applicationRepositoryMock;
    private readonly Mock<IRepository<Mojaz.Domain.Entities.User>> _userRepositoryMock;
    private readonly Mock<IRepository<TheoryTest>> _theoryTestRepositoryMock;
    private readonly Mock<IRepository<PracticalTest>> _practicalTestRepositoryMock;
    private readonly Mock<IRepository<MedicalExamination>> _medicalExamRepositoryMock;
    private readonly Mock<IRepository<PaymentTransaction>> _paymentRepositoryMock;
    private readonly Gate4ValidationService _service;

    public Gate4ValidationServiceTests()
    {
        _applicationRepositoryMock = new Mock<IRepository<Mojaz.Domain.Entities.Application>>();
        _userRepositoryMock = new Mock<IRepository<Mojaz.Domain.Entities.User>>();
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
        var application = new Mojaz.Domain.Entities.Application { Id = applicationId, ApplicantId = applicantId };
        var applicant = new Mojaz.Domain.Entities.User { Id = applicantId, NationalId = "1234567890", IsSecurityBlocked = false };

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
        var application = new Mojaz.Domain.Entities.Application { Id = applicationId, ApplicantId = applicantId };
        var applicant = new Mojaz.Domain.Entities.User { Id = applicantId, NationalId = "1234567890", IsSecurityBlocked = false };

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
        var application = new Mojaz.Domain.Entities.Application { Id = applicationId, ApplicantId = applicantId };
        var applicant = new Mojaz.Domain.Entities.User { Id = applicantId, NationalId = "1234567890", IsSecurityBlocked = true };

        SetupMocks(applicationId, application, applicant, true, true, false, true, true, true);

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
        var application = new Mojaz.Domain.Entities.Application { Id = applicationId, ApplicantId = applicantId };
        var applicant = new Mojaz.Domain.Entities.User { Id = applicantId, NationalId = "1234567890", IsSecurityBlocked = false };

        SetupMocks(applicationId, application, applicant, true, true, true, true, false, true);

        // Act
        var result = await _service.ValidateAsync(applicationId);

        // Assert
        result.IsFullyPassed.Should().BeFalse();
        result.Conditions.First(c => c.Key == "MedicalCertificateValid").IsPassed.Should().BeFalse();
    }

    private void SetupMocks(Guid applicationId, Mojaz.Domain.Entities.Application application, Mojaz.Domain.Entities.User applicant, 
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
