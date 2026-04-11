using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces;

/// <summary>
/// Repository interface for PracticalTest entity operations
/// </summary>
public interface IPracticalRepository : IRepository<PracticalTest>
{
    /// <summary>
    /// Gets the latest practical test for an application
    /// </summary>
    Task<PracticalTest?> GetLatestByApplicationIdAsync(Guid applicationId);

    /// <summary>
    /// Gets all practical tests for an application
    /// </summary>
    Task<IReadOnlyList<PracticalTest>> GetAllByApplicationIdAsync(Guid applicationId);

    /// <summary>
    /// Gets the count of practical tests for an application
    /// </summary>
    Task<int> GetAttemptCountAsync(Guid applicationId);
}