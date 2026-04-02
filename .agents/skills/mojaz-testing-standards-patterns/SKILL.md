---
description: Testing standards and patterns
globs: ["**/Tests/**", "**/*.test.*", "**/*.spec.*"]
alwaysApply: false
---

# Testing Standards

## Backend (xUnit + Moq + FluentAssertions)
Naming: MethodName_Scenario_ExpectedResult

```csharp
[Fact]
public async Task CreateApplicationAsync_UnderageApplicant_ReturnsValidationError()
{
    // Arrange
    var request = new CreateApplicationRequest { ... };
    _settingsService.Setup(s => s.GetAsync("MIN_AGE_CATEGORY_B"))
        .ReturnsAsync("18");
    
    // Act
    var result = await _sut.CreateApplicationAsync(request);
    
    // Assert
    result.Success.Should().BeFalse();
    result.StatusCode.Should().Be(400);
    result.Errors.Should().Contain(e => e.Contains("age"));
}
Frontend (Jest + React Testing Library)
Naming: "should [behavior] when [condition]"

TypeScript

describe('ApplicationWizard', () => {
  it('should show age error when applicant is underage for category', () => {
    // ...
  });
});
E2E (Playwright)
Test complete user flows
Test in both Arabic and English
Test Dark and Light modes
Test responsive breakpoints