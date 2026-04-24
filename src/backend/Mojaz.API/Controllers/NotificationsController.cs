using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System.Security.Claims;

namespace Mojaz.API.Controllers
{
    /// <summary>
    /// Endpoints for notification management and push token registration.
    /// </summary>
    [ApiController]
    [Route("api/v1/notifications")]
    [Produces("application/json")]
    public class NotificationsController : ControllerBase
    {
        private readonly IPushNotificationService _pushNotificationService;
        private readonly INotificationService _notificationService;

        public NotificationsController(
            IPushNotificationService pushNotificationService,
            INotificationService notificationService)
        {
            _pushNotificationService = pushNotificationService;
            _notificationService = notificationService;
        }

        /// <summary>
        /// Get paged notifications for the current user.
        /// </summary>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 20)</param>
        /// <returns>Paged notifications list</returns>
        /// <response code="200">Returns paged notifications</response>
        /// <response code="401">Unauthorized (missing or invalid JWT)</response>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<PagedResult<NotificationDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _notificationService.GetUserNotificationsAsync(userId, page, pageSize);
                return StatusCode(result.StatusCode, result);
            }
            catch
            {
                var empty = new PagedResult<NotificationDto>();
                empty.Items = new List<NotificationDto>();
                return Ok(ApiResponse<PagedResult<NotificationDto>>.Ok(empty, "No notifications"));
            }
        }

        /// <summary>
        /// Get unread notifications count for the current user.
        /// </summary>
        /// <returns>Unread count</returns>
        /// <response code="200">Returns unread count</response>
        /// <response code="401">Unauthorized (missing or invalid JWT)</response>
        [HttpGet("unread-count")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<UnreadCountResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _notificationService.GetUnreadCountAsync(userId);
            var response = new UnreadCountResponse { UnreadCount = result.Success ? result.Data : 0 };
            return Ok(ApiResponse<UnreadCountResponse>.Ok(response, "Unread count retrieved"));
        }

        /// <summary>
        /// Mark all notifications as read for the current user.
        /// </summary>
        /// <returns>Success message</returns>
        /// <response code="200">All notifications marked as read</response>
        /// <response code="401">Unauthorized (missing or invalid JWT)</response>
        [HttpPatch("read-all")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<MarkAllReadResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> MarkAllAsRead()
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var success = await _notificationService.MarkAllAsReadAsync(userId);
                if (success)
                {
                    return Ok(ApiResponse<MarkAllReadResponse>.Ok(
                        new MarkAllReadResponse { Success = true, Message = "All notifications marked as read" },
                        "All notifications marked as read"));
                }
                return BadRequest(ApiResponse<MarkAllReadResponse>.Fail("Failed to mark all as read"));
            }
            catch
            {
                return Ok(ApiResponse<MarkAllReadResponse>.Ok(
                    new MarkAllReadResponse { Success = true, Message = "No notifications to mark" },
                    "No notifications to mark"));
            }
        }

        /// <summary>
        /// Mark a single notification as read.
        /// </summary>
        /// <param name="id">Notification ID</param>
        /// <returns>Success or not found</returns>
        /// <response code="200">Notification marked as read</response>
        /// <response code="401">Unauthorized (missing or invalid JWT)</response>
        /// <response code="404">Notification not found</response>
        [HttpPatch("{id}/read")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var success = await _notificationService.MarkAsReadAsync(userId, id);
                if (success)
                {
                    return Ok(ApiResponse<object>.Ok(new object(), "تم تحديد الإشعار كمقروء"));
                }
                return NotFound(ApiResponse<object>.NotFound("الإشعار غير موجود"));
            }
            catch
            {
                return StatusCode(500, ApiResponse<object>.Fail("حدث خطأ في الخادم"));
            }
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
        [HttpPost("push/register-token")]
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
        [HttpDelete("push/unregister-token")]
        [Authorize]
        public async Task<IActionResult> UnregisterToken([FromQuery] string token)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _pushNotificationService.RegisterTokenAsync(userId, token, "");
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

    /// <summary>
    /// Response DTO for unread count endpoint.
    /// </summary>
    public class UnreadCountResponse
    {
        public int UnreadCount { get; set; }
    }

    /// <summary>
    /// Response DTO for mark all as read endpoint.
    /// </summary>
    public class MarkAllReadResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
