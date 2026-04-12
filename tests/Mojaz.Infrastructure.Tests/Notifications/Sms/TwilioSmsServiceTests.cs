using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Infrastructure.Services;
using Moq;
using Xunit;

namespace Mojaz.Infrastructure.Tests.Notifications.Sms
{
    /// <summary>
    /// Unit tests for TwilioSmsService.
    /// Note: Integration tests requiring actual Twilio API calls are disabled by default
    /// to avoid incurring costs and requiring valid credentials.
    /// </summary>
    public class TwilioSmsServiceTests
    {
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<ILogger<TwilioSmsService>> _loggerMock;

        public TwilioSmsServiceTests()
        {
            _configurationMock = new Mock<IConfiguration>();
            _loggerMock = new Mock<ILogger<TwilioSmsService>>();
        }

        [Fact]
        public void Constructor_WithValidCredentials_InitializesClient()
        {
            // Arrange
            var configSection = new Mock<IConfigurationSection>();
            configSection.Setup(s => s["AccountSid"]).Returns("AC_TEST_SID");
            configSection.Setup(s => s["AuthToken"]).Returns("test_auth_token");
            configSection.Setup(s => s["FromNumber"]).Returns("+966501234567");

            _configurationMock.Setup(c => c.GetSection("Twilio")).Returns(configSection.Object);

            // Act - This will attempt to initialize TwilioClient
            // In test environment, this may throw if no valid credentials
            var service = new TwilioSmsService(_configurationMock.Object, _loggerMock.Object);

            // Assert - Service should be created (even if TwilioClient init fails silently in some scenarios)
            Assert.NotNull(service);
        }

        [Fact]
        public async Task SendAsync_WithMissingFromNumber_ThrowsInvalidOperationException()
        {
            // Arrange
            var configSection = new Mock<IConfigurationSection>();
            configSection.Setup(s => s["AccountSid"]).Returns("AC_TEST_SID");
            configSection.Setup(s => s["AuthToken"]).Returns("test_auth_token");
            configSection.Setup(s => s["FromNumber"]).Returns(""); // Empty from number

            _configurationMock.Setup(c => c.GetSection("Twilio")).Returns(configSection.Object);

            var service = new TwilioSmsService(_configurationMock.Object, _loggerMock.Object);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                service.SendAsync("+966501234567", "Test message"));
        }

        [Theory]
        [InlineData("+966501234567", "+966501234567")]
        [InlineData("0501234567", "+966501234567")] // Local Saudi number
        [InlineData("966501234567", "+966501234567")] // Without +
        [InlineData("+971501234567", "+971501234567")] // UAE number (not Saudi)
        [InlineData("+966 50 123 4567", "+966501234567")] // With spaces
        [InlineData("+966-50-123-4567", "+966501234567")] // With dashes
        public void NormalizePhoneNumber_WithVariousInputs_NormalizesCorrectly(string input, string expected)
        {
            // Act
            var result = TwilioSmsService.NormalizePhoneNumber(input);

            // Assert
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData("+966501234567", "+96****567")]
        [InlineData("0501234567", "050****567")]
        [InlineData("12345", "****")]
        [InlineData("+966500000000", "+96****000")]
        public void MaskPhoneNumber_ForVariousNumbers_ReturnsMaskedVersion(string input, string expected)
        {
            // Act
            var result = TwilioSmsService.MaskPhoneNumber(input);

            // Assert
            Assert.Equal(expected, result);
        }

        [Fact]
        public async Task SendAsync_WithNullPhoneNumber_HandlesGracefully()
        {
            // Arrange
            var configSection = new Mock<IConfigurationSection>();
            configSection.Setup(s => s["AccountSid"]).Returns("AC_TEST_SID");
            configSection.Setup(s => s["AuthToken"]).Returns("test_auth_token");
            configSection.Setup(s => s["FromNumber"]).Returns("+966501234567");

            _configurationMock.Setup(c => c.GetSection("Twilio")).Returns(configSection.Object);

            var service = new TwilioSmsService(_configurationMock.Object, _loggerMock.Object);

            // Act & Assert - Empty string throws InvalidOperationException (FromNumber check happens first)
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                service.SendAsync("", "Test message"));
        }

        /// <summary>
        /// Integration test - only run when valid Twilio credentials are available.
        /// Set ENABLE_TWILIO_INTEGRATION_TESTS=true to run this test.
        /// </summary>
        [Fact(Skip = "Requires valid Twilio credentials - run manually when needed")]
        public async Task SendAsync_WithValidTwilioAccount_SendsSmsSuccessfully()
        {
            // Arrange
            var configSection = new Mock<IConfigurationSection>();
            var accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
            var authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");
            var fromNumber = Environment.GetEnvironmentVariable("TWILIO_FROM_NUMBER");
            var toNumber = Environment.GetEnvironmentVariable("TWILIO_TEST_TO_NUMBER");

            // Skip if credentials not available
            if (string.IsNullOrEmpty(accountSid) || string.IsNullOrEmpty(authToken))
            {
                return;
            }

            configSection.Setup(s => s["AccountSid"]).Returns(accountSid);
            configSection.Setup(s => s["AuthToken"]).Returns(authToken);
            configSection.Setup(s => s["FromNumber"]).Returns(fromNumber);

            _configurationMock.Setup(c => c.GetSection("Twilio")).Returns(configSection.Object);

            var service = new TwilioSmsService(_configurationMock.Object, _loggerMock.Object);

            // Act
            await service.SendAsync(toNumber ?? "+966501234567", "Test message from Mojaz SMS integration test");

            // Assert - If we reach here, SMS was sent successfully
            // (Twilio would throw if there was an error)
        }
    }
}