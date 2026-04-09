using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Mojaz.Domain.Interfaces;

public interface IAppointmentRepository : IRepository<Appointment>
{
    Task<Appointment?> GetByIdWithApplicationAsync(Guid id, CancellationToken ct = default);
    Task<Appointment?> GetByApplicationIdAsync(Guid applicationId, AppointmentType type, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetByApplicationIdAsync(Guid applicationId, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetByBranchAndDateAsync(Guid branchId, DateOnly date, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetByBranchAndDateRangeAsync(Guid branchId, DateOnly startDate, DateOnly endDate, CancellationToken ct = default);
    Task<int> GetBookedSlotCountAsync(Guid branchId, DateOnly date, string timeSlot, CancellationToken ct = default);
    Task<Appointment?> GetByIdForRescheduleAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetUpcomingWithRemindersAsync(int hoursAhead, int hoursWindow, CancellationToken ct = default);
}