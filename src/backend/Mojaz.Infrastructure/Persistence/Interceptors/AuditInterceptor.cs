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
                if (entry.Entity is AuditLog) continue;

                var auditEntry = new AuditLog
                {
                    UserId = GetUserId(context),
                    ActionType = GetActionType(entry.State),
                    EntityName = entry.Entity.GetType().Name,
                    EntityId = GetEntityId(entry)?.ToString() ?? string.Empty,
                    Timestamp = DateTime.UtcNow
                };

                var auditData = new Dictionary<string, object?>();

                if (entry.State == EntityState.Added)
                {
                    foreach (var prop in entry.CurrentValues.Properties)
                    {
                        auditData[prop.Name] = entry.CurrentValues[prop];
                    }
                    auditEntry.Payload = JsonConvert.SerializeObject(new { NewValues = auditData });
                }
                else if (entry.State == EntityState.Deleted)
                {
                    foreach (var prop in entry.OriginalValues.Properties)
                    {
                        auditData[prop.Name] = entry.OriginalValues[prop];
                    }
                    auditEntry.Payload = JsonConvert.SerializeObject(new { OldValues = auditData });
                }
                else if (entry.State == EntityState.Modified)
                {
                    var oldValues = new Dictionary<string, object?>();
                    var newValues = new Dictionary<string, object?>();

                    foreach (var prop in entry.OriginalValues.Properties)
                    {
                        var originalValue = entry.OriginalValues[prop];
                        var currentValue = entry.CurrentValues[prop];

                        if (!Equals(originalValue, currentValue))
                        {
                            oldValues[prop.Name] = originalValue;
                            newValues[prop.Name] = currentValue;
                        }
                    }
                    auditEntry.Payload = JsonConvert.SerializeObject(new { Old = oldValues, New = newValues });
                }

                context.Set<AuditLog>().Add(auditEntry);
            }
        }

        private Guid? GetUserId(DbContext? context)
        {
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
            if (entry.Metadata.FindPrimaryKey() is var pk && pk != null)
            {
                return pk.Properties.Select(p => entry.Property(p.Name).CurrentValue).FirstOrDefault();
            }
            return null;
        }
    }
}