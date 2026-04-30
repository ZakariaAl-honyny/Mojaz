using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Persistence.Repositories;

public class AppointmentRepository : Repository<Appointment>, IAppointmentRepository
{
    public AppointmentRepository(MojazDbContext context) : base(context)
    {
    }

    public async Task<Appointment?> GetByIdWithApplicationAsync(int id, CancellationToken ct = default)
    {
        return await _dbSet
            .Include(x => x.Application)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task<Appointment?> GetByApplicationIdAsync(int applicationId, AppointmentType type, CancellationToken ct = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(x => 
                x.ApplicationId == applicationId && 
                x.AppointmentType == type && 
                !x.IsDeleted, ct);
    }

    public async Task<IReadOnlyList<Appointment>> GetByApplicationIdAsync(int applicationId, CancellationToken ct = default)
    {
        return await _dbSet
            .Where(x => x.ApplicationId == applicationId && !x.IsDeleted)
            .OrderByDescending(x => x.ScheduledDate)
            .ThenByDescending(x => x.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Appointment>> GetByApplicationIdsAsync(List<int> applicationIds, CancellationToken ct = default)
    {
        if (applicationIds == null || !applicationIds.Any())
        {
            return new List<Appointment>();
        }

        return await _dbSet
            .Where(x => applicationIds.Contains(x.ApplicationId) && !x.IsDeleted)
            .OrderByDescending(x => x.ScheduledDate)
            .ThenByDescending(x => x.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Appointment>> GetByBranchAndDateAsync(int branchId, DateOnly date, CancellationToken ct = default)
    {
        return await _dbSet
            .Where(x => 
                x.BranchId == branchId && 
                x.ScheduledDate == date &&
                x.Status != AppointmentStatus.Cancelled &&
                !x.IsDeleted)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Appointment>> GetByBranchAndDateRangeAsync(int branchId, DateOnly startDate, DateOnly endDate, CancellationToken ct = default)
    {
        return await _dbSet
            .Where(x => 
                x.BranchId == branchId && 
                x.ScheduledDate >= startDate && 
                x.ScheduledDate <= endDate &&
                x.Status != AppointmentStatus.Cancelled &&
                !x.IsDeleted)
            .OrderBy(x => x.ScheduledDate)
            .ThenBy(x => x.TimeSlot)
            .ToListAsync(ct);
    }

    public async Task<int> GetBookedSlotCountAsync(int branchId, DateOnly date, string timeSlot, CancellationToken ct = default)
    {
        return await _dbSet
            .CountAsync(x => 
                x.BranchId == branchId && 
                x.ScheduledDate == date && 
                x.TimeSlot == timeSlot &&
                x.Status != AppointmentStatus.Cancelled &&
                !x.IsDeleted, ct);
    }

    public async Task<Appointment?> GetByIdForRescheduleAsync(int id, CancellationToken ct = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, ct);
    }

    public async Task<IReadOnlyList<Appointment>> GetUpcomingWithRemindersAsync(int hoursAhead, int hoursWindow, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var targetTimeStart = now.AddHours(hoursAhead - hoursWindow);
        var targetTimeEnd = now.AddHours(hoursAhead);

        // Convert UTC times to DateOnly and TimeOnly for comparison
        var targetDate = DateOnly.FromDateTime(targetTimeStart);
        
        return await _dbSet
            .Where(x => 
                !x.IsDeleted &&
                !x.ReminderSent &&
                x.Status != AppointmentStatus.Cancelled &&
                x.Status != AppointmentStatus.Completed &&
                x.ScheduledDate == targetDate)
            .ToListAsync(ct);
    }
}