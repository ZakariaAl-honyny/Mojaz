using System.IO;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Infrastructure
{
    /// <summary>
    /// Interface for file storage abstraction.
    /// </summary>
    public interface IFileStorageService
    {
        /// <summary>
        /// Saves the stream to storage. Returns the relative stored path.
        /// </summary>
        Task<string> SaveAsync(Stream fileStream, string storedFileName, string contentType);

        /// <summary>
        /// Reads a stored file. Returns (content, contentType).
        /// </summary>
        Task<(Stream content, string contentType)> ReadAsync(string storedFilePath);

        /// <summary>
        /// Soft-removes the file from storage (may be a no-op or physical delete depending on impl).
        /// </summary>
        Task DeleteAsync(string storedFilePath);
    }
}