using FluentAssertions;
using Mojaz.Application.DTOs.Renewal;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace Mojaz.API.Tests.Integration;

public class RenewalFlowTest : IntegrationTestBase
{
    [Fact]
    public async Task FullRenewalFlow_Succeeds()
    {
        // 1. Arrange: Seed data
        var userId = Guid.NewGuid();
        var categoryId = Guid.NewGuid();
        var oldLicenseId = Guid.NewGuid();

        DbContext.Users.Add(new User { Id = userId, NationalId = "1234567890", FullNameAr = "User", FullNameEn = "User" });
        DbContext.LicenseCategories.Add(new LicenseCategory { Id = categoryId, NameAr = "B", NameEn = "B", Code = LicenseCategoryCode.B, ValidityYears = 10 });
        DbContext.Licenses.Add(new License 
        { 
            Id = oldLicenseId, 
            HolderId = userId, 
            LicenseCategoryId = categoryId, 
            LicenseNumber = "OLD-123", 
            Status = LicenseStatus.Active,
            ExpiresAt = DateTime.UtcNow.AddDays(10),
            IssuedAt = DateTime.UtcNow.AddYears(-5)
        });
        await DbContext.SaveChangesAsync();

        await AuthenticateAsUserAsync(userId, "Applicant");

        // 2. Create Renewal
        var createRequest = new CreateRenewalRequest { OldLicenseId = oldLicenseId, LicenseCategoryId = categoryId };
        var createResponse = await Client.PostAsJsonAsync("/api/v1/licenses/renewal", createRequest);
        createResponse.EnsureSuccessStatusCode();
        
        var createResult = await createResponse.Content.ReadFromJsonAsync<ApiResponse<Guid>>();
        var applicationId = createResult!.Data;

        // 3. Submit Medical Result (as Doctor)
        await AuthenticateAsUserAsync(Guid.NewGuid(), "Doctor");
        var medicalExamId = Guid.NewGuid();
        DbContext.MedicalExaminations.Add(new MedicalExamination { Id = medicalExamId, ApplicationId = applicationId, FitnessResult = MedicalFitnessResult.Fit, ExaminedAt = DateTime.UtcNow });
        await DbContext.SaveChangesAsync();
        
        var medicalResponse = await Client.PostAsync($"/api/v1/licenses/renewal/{applicationId}/medical-result?medicalExaminationId={medicalExamId}", null);
        medicalResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        // 4. Pay Fee
        await AuthenticateAsUserAsync(userId, "Applicant");
        var payRequest = new PaymentRequest { Amount = 250, PaymentMethod = "CreditCard", TransactionId = "TXN123" };
        var payResponse = await Client.PostAsJsonAsync($"/api/v1/licenses/renewal/{applicationId}/pay", payRequest);
        payResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        // 5. Issue License (as Manager)
        await AuthenticateAsUserAsync(Guid.NewGuid(), "Manager");
        var issueResponse = await Client.PostAsync($"/api/v1/licenses/renewal/{applicationId}/issue", null);
        issueResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        var issueResult = await issueResponse.Content.ReadFromJsonAsync<ApiResponse<IssueLicenseResponse>>();
        issueResult!.Success.Should().BeTrue();
        issueResult.Data!.LicenseNumber.Should().StartWith("MOJ-");

        // 6. Verify Deactivation
        var oldLicense = await DbContext.Licenses.FindAsync(oldLicenseId);
        oldLicense!.Status.Should().Be(LicenseStatus.Renewed);
    }
}