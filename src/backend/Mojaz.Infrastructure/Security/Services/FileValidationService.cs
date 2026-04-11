using FileSignatures;
using FileSignatures.Formats;
using Mojaz.Application.Interfaces.Security;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared.Constants;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Security.Services;

public class FileValidationService : IFileValidationService
{
    private readonly ISystemSettingsService _settingsService;
    private static readonly IFileFormatInspector Inspector = new FileFormatInspector();

    public FileValidationService(ISystemSettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    public async Task<bool> ValidateSignatureAsync(Stream fileStream, string fileName)
    {
        if (fileStream == null || fileStream.Length == 0) return false;

        // Reset stream position if possible
        if (fileStream.CanSeek) fileStream.Position = 0;

        var format = Inspector.DetermineFileFormat(fileStream);
        
        // If we can't determine the format, it might be a plain text file or unknown binary
        if (format == null)
        {
            // Allow .txt as a special case if needed, otherwise fail
            var ext = Path.GetExtension(fileName).ToLower();
            return ext == ".txt" || ext == ".csv";
        }

        var extension = Path.GetExtension(fileName).TrimStart('.').ToLower();
        
        // Basic check: Does the detected format match the extension?
        // Note: FileSignatures might have multiple extensions or slightly different naming
        return format.Extension.Equals(extension, StringComparison.OrdinalIgnoreCase) || 
               (format is Image && (extension == "jpg" || extension == "jpeg" || extension == "png"));
    }

    public async Task<bool> ValidateSizeAsync(long sizeInBytes)
    {
        var maxSizeStr = await _settingsService.GetAsync(SecurityConstants.Settings.MaxFileSizeBytes);
        if (long.TryParse(maxSizeStr, out var maxSize))
        {
            return sizeInBytes <= maxSize;
        }

        // Fallback to 5MB
        return sizeInBytes <= 5 * 1024 * 1024;
    }
}
