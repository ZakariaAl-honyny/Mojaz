using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared.Models;
using System.Security.Claims;

namespace Mojaz.API.Controllers
{
    /// <summary>
    /// Endpoints for in-app and unified notifications.
    /// </summary>
    [ApiController]
    [Route("api/v1/notifications")]
    [Produces("application/json")]
    public class UnifiedNotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public UnifiedNotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>
        /// Get all notifications for the current user (paginated).
        /// </summary>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Page size (default: 20)</param>
        /// <returns>Paged list of notifications</returns>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<PagedResult<NotificationDto>>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 401)]
        public async Task<IActionResult> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _notificationService.GetUserNotificationsAsync(userId, page, pageSize);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Get unread notification count for the current user.
        /// </summary>
        /// <returns>Unread count</returns>
        [HttpGet("unread-count")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<int>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 401)]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _notificationService.GetUnreadCountAsync(userId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Mark a single notification as read.
        /// </summary>
        /// <param name="id">Notification ID to mark as read</param>
        /// <returns>Success result</returns>
        [HttpPatch("{id}/read")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 401)]
        [ProducesResponseType(typeof(ApiResponse<object>), 404)]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _notificationService.MarkAsReadAsync(userId, id);
            return Ok(new { Success = result });
        }

        /// <summary>
        /// Mark all notifications as read for the current user.
        /// </summary>
        [HttpPatch("read-all")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _notificationService.MarkAllAsReadAsync(userId);
            if (result)
            {
                return Ok(ApiResponse<object>.Ok(new { }, "All notifications marked as read."));
            }
            return Ok(ApiResponse<object>.Ok(new { }, "No unread notifications to mark."));
        }
    }
}
