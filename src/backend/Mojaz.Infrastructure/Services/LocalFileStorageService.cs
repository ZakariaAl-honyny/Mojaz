using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Services;

/// <summary>
/// Local file system implementation of IFileStorageService.
/// </summary>
public class LocalFileStorageService : IFileStorageService
{
    private readonly ISystemSettingsService _systemSettingsService;
    private readonly string _basePath;

    public LocalFileStorageService(ISystemSettingsService systemSettingsService)
    {
        _systemSettingsService = systemSettingsService;
        var basePathTask = _systemSettingsService.GetAsync("FileStorage:BasePath");
        basePathTask.Wait();
        _basePath = basePathTask.Result ?? "uploads";
        
        // Ensure base directory exists
        if (!Directory.Exists(_basePath))
        {
            Directory.CreateDirectory(_basePath);
        }
    }

    public async Task<string> SaveAsync(Stream fileStream, string storedFileName, string contentType)
    {
        try
        {
            // Create year/month subdirectories
            var yearMonthPath = Path.Combine(_basePath, DateTime.UtcNow.ToString("yyyy/MM"));
            if (!Directory.Exists(yearMonthPath))
            {
                Directory.CreateDirectory(yearMonthPath);
            }

            var fullPath = Path.Combine(yearMonthPath, storedFileName);
            
            // Save file to disk
            using (var fileStreamOutput = File.Create(fullPath))
            {
                await fileStream.CopyToAsync(fileStreamOutput);
            }

            // Return relative path from base
            var relativePath = Path.GetRelativePath(_basePath, fullPath);
            return relativePath.Replace(Path.DirectorySeparatorChar, '/');
        }
        catch (Exception ex)
        {
            throw new IOException($"Failed to save file: {ex.Message}", ex);
        }
    }

    public async Task<(Stream content, string contentType)> ReadAsync(string storedFilePath)
    {
        try
        {
            var fullPath = Path.Combine(_basePath, storedFilePath.Replace('/', Path.DirectorySeparatorChar));
            
            if (!File.Exists(fullPath))
            {
                throw new FileNotFoundException($"File not found: {storedFilePath}");
            }

            var fileStream = File.OpenRead(fullPath);
            
            // Determine content type from file extension if not provided
            string contentTypeToUse = GetContentTypeFromExtension(Path.GetExtension(fullPath));

            return (fileStream, contentTypeToUse);
        }
        catch (Exception ex)
        {
            throw new IOException($"Failed to read file: {ex.Message}", ex);
        }
    }

    public async Task DeleteAsync(string storedFilePath)
    {
        try
        {
            var fullPath = Path.Combine(_basePath, storedFilePath.Replace('/', Path.DirectorySeparatorChar));
            
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
            // If file doesn't exist, consider it already deleted (idempotent operation)
        }
        catch (Exception ex)
        {
            throw new IOException($"Failed to delete file: {ex.Message}", ex);
        }
    }

    private string GetContentTypeFromExtension(string extension)
    {
        return extension.ToLower() switch
        {
            ".pdf" => "application/pdf",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            _ => "application/octet-stream"
        };
    }
}