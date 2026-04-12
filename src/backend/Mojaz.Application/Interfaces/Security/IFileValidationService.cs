using System.IO;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Security;

public interface IFileValidationService
{
    /// <summary>
    /// Validates a file's binary signature against its extension and a list of allowed MIME types.
    /// </summary>
    /// <param name="fileStream">The contents of the file.</param>
    /// <param name="fileName">The name of the file (to extract extension).</param>
    /// <returns>True if the file signature matches its extension and is in the allowed list.</returns>
    Task<bool> ValidateSignatureAsync(Stream fileStream, string fileName);

    /// <summary>
    /// Checks if the file size is within the configured limit.
    /// </summary>
    Task<bool> ValidateSizeAsync(long sizeInBytes);
}
