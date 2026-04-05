using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Enums;
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
        [HttpGet]
        [Authorize]

        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Page size (default: 20)</param>
        /// <returns>Paged list of notifications</returns>
        [ProducesResponseType(typeof(Mojaz.Shared.PagedResult<Mojaz.Domain.Entities.Notification>), 200)]
        public async Task<IActionResult> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            // Assume repository is injected via NotificationService
            var notifications = await _notificationService.GetUserNotificationsAsync(userId, page, pageSize);
            return Ok(notifications);
        }

        /// <summary>
        /// Mark a notification as read.
        /// </summary>
        [HttpPatch("{id}/read")]
        [Authorize]
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
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _notificationService.MarkAllAsReadAsync(userId);
            return Ok(new { Success = result });
        }
    }
}
