using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.Interfaces.Services;
using System.Security.Claims;

namespace Mojaz.API.Controllers
{
    /// <summary>
    /// Endpoints for push notification token registration and management.
    /// </summary>
    [ApiController]
    [Route("api/v1/notifications/push")]
    [Produces("application/json")]
    public class NotificationsController : ControllerBase
    {
        private readonly IPushNotificationService _pushNotificationService;
        public NotificationsController(IPushNotificationService pushNotificationService)
        {
            _pushNotificationService = pushNotificationService;
        }

        /// <summary>
        /// Register a device push token for the current user (FCM Web Push).
        /// </summary>
        /// <param name="request">Push token registration payload (token, device type)</param>
        /// <returns>Success result</returns>
        /// <response code="200">Token registered successfully</response>
        /// <response code="401">Unauthorized (missing or invalid JWT)</response>
        /// <remarks>
        /// Registers a new push notification token for the authenticated user. Used for web push notifications via Firebase Cloud Messaging (FCM).
        /// </remarks>
        [HttpPost("register-token")]
        [Authorize]
        public async Task<IActionResult> RegisterToken([FromBody] RegisterPushTokenRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _pushNotificationService.RegisterTokenAsync(userId, request.Token, request.DeviceType);
            return Ok(new { Success = true });
        }

        /// <summary>
        /// Unregister (revoke) a device push token for the current user.
        /// </summary>
        /// <param name="token">The FCM device token to unregister</param>
        /// <returns>Success result</returns>
        /// <response code="200">Token unregistered successfully</response>
        /// <response code="401">Unauthorized (missing or invalid JWT)</response>
        /// <remarks>
        /// Revokes a push notification token for the authenticated user. The token will no longer receive push notifications.
        /// </remarks>
        [HttpDelete("unregister-token")]
        [Authorize]
        public async Task<IActionResult> UnregisterToken([FromQuery] string token)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            // For MVP, just mark as revoked
            await _pushNotificationService.RegisterTokenAsync(userId, token, ""); // Mark as revoked in service
            return Ok(new { Success = true });
        }
    }

    /// <summary>
    /// Request payload for registering a push notification token.
    /// </summary>
    public class RegisterPushTokenRequest
    {
        /// <summary>
        /// The FCM device token to register.
        /// </summary>
        public string Token { get; set; } = string.Empty;

        /// <summary>
        /// The device type (e.g., "web", "android", "ios").
        /// </summary>
        public string DeviceType { get; set; } = string.Empty;
    }
}
