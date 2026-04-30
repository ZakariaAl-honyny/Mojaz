using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Mojaz.Domain.Interfaces;

public interface IAppointmentRepository : IRepository<Appointment>
{
    Task<Appointment?> GetByIdWithApplicationAsync(int id, CancellationToken ct = default);
    Task<Appointment?> GetByApplicationIdAsync(int applicationId, AppointmentType type, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetByApplicationIdAsync(int applicationId, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetByApplicationIdsAsync(List<int> applicationIds, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetByBranchAndDateAsync(int branchId, DateOnly date, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetByBranchAndDateRangeAsync(int branchId, DateOnly startDate, DateOnly endDate, CancellationToken ct = default);
    Task<int> GetBookedSlotCountAsync(int branchId, DateOnly date, string timeSlot, CancellationToken ct = default);
    Task<Appointment?> GetByIdForRescheduleAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<Appointment>> GetUpcomingWithRemindersAsync(int hoursAhead, int hoursWindow, CancellationToken ct = default);
}