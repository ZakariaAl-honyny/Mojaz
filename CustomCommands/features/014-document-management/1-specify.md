# Feature 014: Document Upload (Applicant) and Document Review (Employee)

## WHAT WE'RE BUILDING:
File upload for 8 document types with validation, and employee review interface.

## REQUIREMENTS:
### Backend: Upload (multipart, PDF/JPG/PNG, max 5MB, MIME verification), List, Delete (soft), Review (approve/reject)
### 8 Document Types: IdCopy, PersonalPhoto, MedicalReport, TrainingCertificate (mandatory); AddressProof, GuardianConsent, PreviousLicense, AccessibilityDocuments (conditional)
### Frontend Applicant: Upload cards with drag&drop, preview, progress, status badge
### Frontend Employee: Review panel with lightbox, approve/reject buttons, bulk approve

## ACCEPTANCE CRITERIA:
- [ ] Upload validates type/size/MIME
- [ ] Drag & drop works
- [ ] Preview shows thumbnail/icon
- [ ] Employee can approve/reject
- [ ] Rejection triggers notification
- [ ] Conditional documents shown
