using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Mojaz.Domain.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Persistence.Interceptors
{
    public class AuditInterceptor : SaveChangesInterceptor
    {
        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            AuditEntities(eventData.Context);
            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            AuditEntities(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private void AuditEntities(DbContext? context)
        {
            if (context == null) return;

            var entries = context.ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added || 
                           e.State == EntityState.Modified || 
                           e.State == EntityState.Deleted)
                .ToList();

            foreach (var entry in entries)
            {
                if (entry.Entity is AuditLog) continue; // Skip audit entities to avoid infinite loop

                var auditEntry = new AuditLog
                {
                    UserId = GetUserId(context),
                    ActionType = GetActionType(entry.State),
                    EntityName = entry.Entity.GetType().Name,
                    EntityId = GetEntityId(entry)?.ToString() ?? string.Empty,
                    Payload = string.Empty,
                    Timestamp = DateTime.UtcNow
                };

                switch (entry.State)
                {
                    case EntityState.Added:
                        auditEntry.Payload = SerializeEntity(entry.Entity);
                        break;
                    case EntityState.Deleted:
                        auditEntry.Payload = SerializeEntity(entry.Entity);
                        break;
                    case EntityState.Modified:
                        var oldValues = SerializeEntity(entry.OriginalValues.ToObject());
                        var newValues = SerializeEntity(entry.CurrentValues.ToObject());
                        auditEntry.Payload = JsonConvert.SerializeObject(new { Old = oldValues, New = newValues });
                        break;
                }

                context.Set<AuditLog>().Add(auditEntry);
            }
        }

        private Guid? GetUserId(DbContext? context)
        {
            // In a real implementation, you would get the current user from HttpContext or similar
            // For now, we'll return null as this should be set by the service layer
            return null;
        }

        private string GetActionType(EntityState state)
        {
            return state switch
            {
                EntityState.Added => "CREATE",
                EntityState.Deleted => "DELETE",
                EntityState.Modified => "UPDATE",
                _ => throw new ArgumentOutOfRangeException(nameof(state), state, null)
            };
        }

        private object? GetEntityId(EntityEntry entry)
        {
            // Try to find the primary key value
            if (entry.Metadata.FindPrimaryKey() is var pk && pk != null)
            {
                return pk.Properties.Select(p => entry.Property(p.Name).CurrentValue).FirstOrDefault();
            }
            return null;
        }

        private string SerializeEntity(object? entity)
        {
            if (entity == null) return "{}";
            
            try
            {
                return JsonConvert.SerializeObject(entity, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
            }
            catch
            {
                return "{}";
            }
        }
    }
}