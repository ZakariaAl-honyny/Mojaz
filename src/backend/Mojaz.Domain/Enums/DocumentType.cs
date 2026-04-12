namespace Mojaz.Domain.Enums;

public enum DocumentType
{
    // Mandatory (always required for new license issuance)
    IdCopy = 1,
    PersonalPhoto = 2,
    MedicalReport = 3,
    TrainingCertificate = 4,

    // Conditional
    AddressProof = 5,          // Required when applicant is Resident
    GuardianConsent = 6,       // Required when applicant age < 18
    PreviousLicense = 7,       // Required when previous license declared / Renewal / Upgrade service
    AccessibilityDocuments = 8 // Required when SupportNeeds == true
}
