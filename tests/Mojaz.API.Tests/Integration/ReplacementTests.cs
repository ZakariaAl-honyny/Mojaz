using Xunit;
using FluentAssertions;
using Mojaz.Application.DTOs.LicenseReplacement;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Mojaz.Shared;
using System.Net.Http.Json;

namespace Mojaz.API.Tests.Integration;

public class ReplacementTests : IntegrationTestBase
{
    private async Task<List<Guid>> CreateMockDocumentsAsync(int count = 1)
    {
        var docIds = new List<Guid>();
        for (int i = 0; i < count; i++)
        {
            var doc = new ApplicationDocument 
            { 
                Id = Guid.NewGuid(), 
                OriginalFileName = $"doc_{i}.pdf", 
                FilePath = $"http://storage/doc_{i}.pdf",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            DbContext.ApplicationDocuments.Add(doc);
            docIds.Add(doc.Id);
        }
        await DbContext.SaveChangesAsync();
        return docIds;
    }

    private async Task<Guid> CreateMockPaymentAsync(Guid applicationId, decimal amount = 100m)
    {
        var payment = new PaymentTransaction 
        { 
            Id = Guid.NewGuid(), 
            ApplicationId = applicationId, 
            Amount = amount, 
            Status = PaymentStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        DbContext.PaymentTransactions.Add(payment);
        await DbContext.SaveChangesAsync();
        return payment.Id;
    }

    [Fact(Skip = "Integration test requires full API context - to be fixed in dedicated sprint")]
    public async Task FullReplacementFlow_LostLicense_IssuesNewLicense()
    {
        // 1. Setup: Create user and active license
        var userId = Guid.NewGuid();
        var oldLicenseId = Guid.NewGuid();
        
        var license = new License 
        { 
            Id = oldLicenseId, 
            HolderId = userId, 
            Status = LicenseStatus.Active, 
            LicenseNumber = "MOJ-2024-12345678" 
        };
        DbContext.Licenses.Add(license);
        await DbContext.SaveChangesAsync();
        
        var docIds = await CreateMockDocumentsAsync();
        await AuthenticateAsUserAsync(userId);

        // 2. Eligibility Check
        var eligibility = await GetAsJsonAsync<ApiResponse<ReplacementEligibilityDto>>("/api/v1/licenses/mine/replacement-eligibility");
        eligibility.Success.Should().BeTrue();
        eligibility.Data.Should().NotBeNull();

        // 3. Submit Replacement Request
        var request = new CreateReplacementRequest 
        { 
            LicenseId = oldLicenseId,
            Reason = ReplacementReason.Lost, 
            DocumentIds = docIds
        };
        var submitResult = await PostAsJsonAsync<ApiResponse<CreateReplacementResponse>>("/api/v1/applications/replacement", request);
        submitResult.Success.Should().BeTrue();
        var applicationId = submitResult.Data.ApplicationId;

        // 4. Complete Payment
        var paymentId = await CreateMockPaymentAsync(applicationId);
        var paymentRequest = new PaymentConfirmRequest 
        { 
            PaymentId = paymentId
        };
        var paymentResult = await PostAsJsonAsync<ApiResponse<object>>($"/api/v1/applications/{applicationId}/process-payment", paymentRequest);
        paymentResult.Success.Should().BeTrue();

        // 5. Administrator Issues License
        var adminId = Guid.NewGuid();
        await AuthenticateAsUserAsync(adminId, "Admin");
        
        var issueResult = await PostAsJsonAsync<ApiResponse<object>>($"/api/v1/licenses/issue-replacement/{applicationId}", new { IssuerId = adminId });
        issueResult.Success.Should().BeTrue();

        // 6. Final Verification
        var updatedLicense = await DbContext.Licenses.FirstOrDefaultAsync(l => l.Id == oldLicenseId);
        updatedLicense.Status.Should().Be(LicenseStatus.Replaced);

        var newLicense = await DbContext.Licenses.FirstOrDefaultAsync(l => l.HolderId == userId && l.Status == LicenseStatus.Active);
        newLicense.Should().NotBeNull();
        newLicense.LicenseNumber.Should().NotBe(oldLicenseId.ToString());
    }

    [Fact(Skip = "Integration test requires full API context - to be fixed in dedicated sprint")]
    public async Task FullReplacementFlow_StolenLicense_RequiresReviewAndIssuance()
    {
        // 1. Setup
        var userId = Guid.NewGuid();
        var oldLicenseId = Guid.NewGuid();
        DbContext.Licenses.Add(new License { Id = oldLicenseId, HolderId = userId, Status = LicenseStatus.Active });
        await DbContext.SaveChangesAsync();
        
        var docIds = await CreateMockDocumentsAsync();
        await AuthenticateAsUserAsync(userId);

        // 2. Submit Replacement (Stolen)
        var request = new CreateReplacementRequest 
        { 
            LicenseId = oldLicenseId,
            Reason = ReplacementReason.Stolen, 
            DocumentIds = docIds
        };
        var submitResult = await PostAsJsonAsync<ApiResponse<CreateReplacementResponse>>("/api/v1/applications/replacement", request);
        var applicationId = submitResult.Data.ApplicationId;

        // 3. Payment
        var paymentId = await CreateMockPaymentAsync(applicationId);
        await PostAsJsonAsync<ApiResponse<object>>($"/api/v1/applications/{applicationId}/process-payment", new PaymentConfirmRequest { PaymentId = paymentId });

        // 4. Verify Application is Under Review
        var application = await DbContext.Applications.FirstOrDefaultAsync(a => a.Id == applicationId);
        application.CurrentStage.Should().Be("UnderReview");

        // 5. Receptionist Verifies Police Report
        var receptionistId = Guid.NewGuid();
        await AuthenticateAsUserAsync(receptionistId, "Receptionist");
        
        var verifyResult = await PatchAsJsonAsync($"/api/v1/administrative/applications/{applicationId}/verify-stolen-report", new { IsVerified = true });
        verifyResult.StatusCode.Should().Be(HttpStatusCode.OK);

        // 6. Administrator Issues License
        var adminId = Guid.NewGuid();
        await AuthenticateAsUserAsync(adminId, "Admin");
        var issueResult = await PostAsJsonAsync<ApiResponse<object>>($"/api/v1/licenses/issue-replacement/{applicationId}", new { IssuerId = adminId });
        issueResult.Success.Should().BeTrue();

        // 7. Final Verification
        var updatedLicense = await DbContext.Licenses.FirstOrDefaultAsync(l => l.Id == oldLicenseId);
        updatedLicense.Status.Should().Be(LicenseStatus.Replaced);
    }

    [Fact(Skip = "Integration test requires full API context - to be fixed in dedicated sprint")]
    public async Task CreateReplacement_AlreadyReplacedLicense_ReturnsBadRequest()
    {
        // Setup: License already replaced
        var userId = Guid.NewGuid();
        var oldLicenseId = Guid.NewGuid();
        DbContext.Licenses.Add(new License { Id = oldLicenseId, HolderId = userId, Status = LicenseStatus.Replaced });
        await DbContext.SaveChangesAsync();
        
        var docIds = await CreateMockDocumentsAsync();
        await AuthenticateAsUserAsync(userId);

        var request = new CreateReplacementRequest 
        { 
            LicenseId = oldLicenseId,
            Reason = ReplacementReason.Lost, 
            DocumentIds = docIds 
        };
        var response = await Client.PostAsJsonAsync("/api/v1/applications/replacement", request);
        
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact(Skip = "Integration test requires full API context - to be fixed in dedicated sprint")]
    public async Task IssueLicense_UnpaidApplication_ReturnsBadRequest()
    {
        // Setup: Application created but not paid
        var userId = Guid.NewGuid();
        var oldLicenseId = Guid.NewGuid();
        DbContext.Licenses.Add(new License { Id = oldLicenseId, HolderId = userId, Status = LicenseStatus.Active });
        await DbContext.SaveChangesAsync();
        
        var docIds = await CreateMockDocumentsAsync();
        await AuthenticateAsUserAsync(userId);
        var request = new CreateReplacementRequest 
        { 
            LicenseId = oldLicenseId, 
            Reason = ReplacementReason.Lost, 
            DocumentIds = docIds 
        };
        var submitResult = await PostAsJsonAsync<ApiResponse<CreateReplacementResponse>>("/api/v1/applications/replacement", request);
        var applicationId = submitResult.Data.ApplicationId;

        // Try to issue without payment
        var adminId = Guid.NewGuid();
        await AuthenticateAsUserAsync(adminId, "Admin");
        var response = await Client.PostAsJsonAsync($"/api/v1/licenses/issue-replacement/{applicationId}", new { IssuerId = adminId });
        
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact(Skip = "Integration test requires full API context - to be fixed in dedicated sprint")]
    public async Task IssueLicense_UnverifiedStolenReport_ReturnsBadRequest()
    {
        // Setup: Stolen application, paid, but not verified
        var userId = Guid.NewGuid();
        var oldLicenseId = Guid.NewGuid();
        DbContext.Licenses.Add(new License { Id = oldLicenseId, HolderId = userId, Status = LicenseStatus.Active });
        await DbContext.SaveChangesAsync();
        
        var docIds = await CreateMockDocumentsAsync();
        await AuthenticateAsUserAsync(userId);
        var request = new CreateReplacementRequest 
        { 
            LicenseId = oldLicenseId, 
            Reason = ReplacementReason.Stolen, 
            DocumentIds = docIds 
        };
        var submitResult = await PostAsJsonAsync<ApiResponse<CreateReplacementResponse>>("/api/v1/applications/replacement", request);
        var applicationId = submitResult.Data.ApplicationId;
        
        var paymentId = await CreateMockPaymentAsync(applicationId);
        await PostAsJsonAsync<ApiResponse<object>>($"/api/v1/applications/{applicationId}/process-payment", new PaymentConfirmRequest { PaymentId = paymentId });

        // Try to issue without verification
        var adminId = Guid.NewGuid();
        await AuthenticateAsUserAsync(adminId, "Admin");
        var response = await Client.PostAsJsonAsync($"/api/v1/licenses/issue-replacement/{applicationId}", new { IssuerId = adminId });
        
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
