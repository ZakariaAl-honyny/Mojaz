using Mojaz.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Persistence.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MojazDbContext _context;
        private readonly Dictionary<Type, object> _repositories = new();
        private readonly ILogger<UnitOfWork>? _logger;

        public UnitOfWork(MojazDbContext context, ILogger<UnitOfWork>? logger = null)
        {
            _context = context;
            _logger = logger;
        }

        public IRepository<T> Repository<T>() where T : class
        {
            var type = typeof(T);
            if (!_repositories.ContainsKey(type))
            {
                var repoInstance = new Repositories.Repository<T>(_context);
                _repositories[type] = repoInstance;
            }
            return (IRepository<T>)_repositories[type];
        }

        public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        {
            try
            {
                return await _context.SaveChangesAsync(ct);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error saving entity changes. InnerException: {InnerMessage}", ex.InnerException?.Message ?? ex.Message);
                throw;
            }
        }

        public async Task BeginTransactionAsync(CancellationToken ct = default)
        {
            await _context.Database.BeginTransactionAsync(ct);
        }

        public async Task CommitTransactionAsync(CancellationToken ct = default)
        {
            await _context.Database.CommitTransactionAsync(ct);
        }

        public async Task RollbackTransactionAsync(CancellationToken ct = default)
        {
            await _context.Database.RollbackTransactionAsync(ct);
        }

        public void Dispose()
        {
            _context?.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
