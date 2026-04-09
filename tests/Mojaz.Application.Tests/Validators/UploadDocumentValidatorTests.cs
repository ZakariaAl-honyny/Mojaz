using System;
using System.IO;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Mojaz.Application.DTOs.Document;
using Mojaz.Application.Validators;
using Xunit;

namespace Mojaz.Application.Tests.Validators;

public class UploadDocumentValidatorTests
{
    private readonly UploadDocumentValidator _validator = new();

    #region File Null/Empty Tests

    [Fact]
    public void Validate_FileIsNull_ReturnsValidationError()
    {
        // Arrange
        var request = new UploadDocumentRequest
        {
            DocumentType = Domain.Enums.DocumentType.IdCopy,
            File = null!
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("File is required"));
    }

    [Fact]
    public void Validate_FileIsEmpty_ReturnsValidationError()
    {
        // Arrange
        var file = new TestFormFile("", 0, "application/pdf");
        
        var request = new UploadDocumentRequest
        {
            DocumentType = Domain.Enums.DocumentType.IdCopy,
            File = file
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("empty"));
    }

    #endregion

    #region File Size Tests

    [Fact]
    public void Validate_FileTooLarge_ReturnsValidationError()
    {
        // Arrange - 6MB file (over 5MB limit)
        var file = new TestFormFile("test.pdf", 6 * 1024 * 1024, "application/pdf");
        
        var request = new UploadDocumentRequest
        {
            DocumentType = Domain.Enums.DocumentType.IdCopy,
            File = file
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("5MB"));
    }

    [Fact]
    public void Validate_FileAtMaxSize_ReturnsSuccess()
    {
        // Arrange - exactly 5MB
        var file = new TestFormFile("test.pdf", 5 * 1024 * 1024, "application/pdf");
        
        var request = new UploadDocumentRequest
        {
            DocumentType = Domain.Enums.DocumentType.IdCopy,
            File = file
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_FileBelowMaxSize_ReturnsSuccess()
    {
        // Arrange - 1MB file
        var file = new TestFormFile("test.pdf", 1024 * 1024, "application/pdf");
        
        var request = new UploadDocumentRequest
        {
            DocumentType = Domain.Enums.DocumentType.IdCopy,
            File = file
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    #endregion

    #region File Extension Tests

    [Theory]
    [InlineData(".pdf", true)]
    [InlineData(".jpg", true)]
    [InlineData(".jpeg", true)]
    [InlineData(".png", true)]
    [InlineData(".PDF", true)]  // Case insensitive
    [InlineData(".JPG", true)]
    [InlineData(".exe", false)]
    [InlineData(".doc", false)]
    [InlineData(".docx", false)]
    [InlineData(".gif", false)]
    [InlineData(".svg", false)]
    public void Validate_ExtensionWhitelist(string extension, bool shouldBeValid)
    {
        // Arrange
        var file = new TestFormFile($"test{extension}", 1024, "application/octet-stream");
        
        var request = new UploadDocumentRequest
        {
            DocumentType = Domain.Enums.DocumentType.IdCopy,
            File = file
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        if (shouldBeValid)
        {
            result.IsValid.Should().BeTrue();
        }
        else
        {
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("extension"));
        }
    }

    #endregion

    #region Document Type Tests

    [Fact]
    public void Validate_InvalidDocumentType_ReturnsValidationError()
    {
        // Arrange
        var file = new TestFormFile("test.pdf", 1024, "application/pdf");
        
        var request = new UploadDocumentRequest
        {
            DocumentType = (Domain.Enums.DocumentType)99, // Invalid
            File = file
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Invalid document type"));
    }

    [Theory]
    [InlineData(Domain.Enums.DocumentType.IdCopy)]
    [InlineData(Domain.Enums.DocumentType.PersonalPhoto)]
    [InlineData(Domain.Enums.DocumentType.MedicalReport)]
    [InlineData(Domain.Enums.DocumentType.TrainingCertificate)]
    [InlineData(Domain.Enums.DocumentType.AddressProof)]
    [InlineData(Domain.Enums.DocumentType.GuardianConsent)]
    [InlineData(Domain.Enums.DocumentType.PreviousLicense)]
    [InlineData(Domain.Enums.DocumentType.AccessibilityDocuments)]
    public void Validate_ValidDocumentTypes_ReturnsSuccess(Domain.Enums.DocumentType docType)
    {
        // Arrange
        var file = new TestFormFile("test.pdf", 1024, "application/pdf");
        
        var request = new UploadDocumentRequest
        {
            DocumentType = docType,
            File = file
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    #endregion

    #region Combined Valid Tests

    [Fact]
    public void Validate_ValidPdf_ReturnsSuccess()
    {
        // Arrange
        var file = new TestFormFile("id-copy.pdf", 1024 * 500, "application/pdf");
        
        var request = new UploadDocumentRequest
        {
            DocumentType = Domain.Enums.DocumentType.IdCopy,
            File = file
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
    }

    [Fact]
    public void Validate_ValidJpeg_ReturnsSuccess()
    {
        // Arrange
        var file = new TestFormFile("photo.jpg", 1024 * 500, "image/jpeg");
        
        var request = new UploadDocumentRequest
        {
            DocumentType = Domain.Enums.DocumentType.PersonalPhoto,
            File = file
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_ValidPng_ReturnsSuccess()
    {
        // Arrange
        var file = new TestFormFile("photo.png", 1024 * 500, "image/png");
        
        var request = new UploadDocumentRequest
        {
            DocumentType = Domain.Enums.DocumentType.PersonalPhoto,
            File = file
        };

        // Act
        var result = _validator.Validate(request);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    #endregion
}

/// <summary>
/// Test helper class to simulate IFormFile
/// </summary>
public class TestFormFile : Microsoft.AspNetCore.Http.IFormFile
{
    private readonly string _fileName;
    private readonly long _length;
    private readonly string _contentType;

    public TestFormFile(string fileName, long length, string contentType)
    {
        _fileName = fileName;
        _length = length;
        _contentType = contentType;
    }

    public string ContentDisposition => "form-data";
    public string ContentType => _contentType;
    public string FileName => _fileName;
    public long Length => _length;
    public string Name => "File";
    public IHeaderDictionary Headers { get; } = new HeaderDictionary();

    public Stream OpenReadStream() => new MemoryStream();
    public void CopyTo(Stream target) { }
    public Task CopyToAsync(Stream target, CancellationToken cancellationToken = default) => Task.CompletedTask;
}