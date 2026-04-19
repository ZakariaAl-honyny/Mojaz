using FluentValidation;
using DrivingLicenseIssuanceSystem.Application.DTOs.Document;
using DrivingLicenseIssuanceSystem.Domain.Enums;

namespace DrivingLicenseIssuanceSystem.Application.Validators;

public class UploadDocumentValidator : AbstractValidator<UploadDocumentRequest>
{
    private static readonly string[] AllowedExtensions = { ".pdf", ".jpg", ".jpeg", ".png" };
    private const int MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB

    public UploadDocumentValidator()
    {
        RuleFor(x => x.DocumentType)
            .IsInEnum()
            .WithMessage("Invalid document type.");

        RuleFor(x => x.File)
            .NotNull()
            .WithMessage("File is required.");

        RuleFor(x => x.File)
            .Must(file => file != null && file.Length > 0)
            .WithMessage("File cannot be empty.");

        RuleFor(x => x.File)
            .Must(file => file == null || file.Length <= MaxFileSizeBytes)
            .WithMessage($"File size must not exceed {MaxFileSizeBytes / (1024 * 1024)}MB.");

        RuleFor(x => x.File)
            .Must(file => file == null || AllowedExtensions.Contains(Path.GetExtension(file.FileName).ToLowerInvariant()))
            .WithMessage($"File extension must be one of: {string.Join(", ", AllowedExtensions)}");
    }
}