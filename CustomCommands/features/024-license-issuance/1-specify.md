# Feature 024: License Generation with PDF Download

> **Status:** To be generated via `/speckit.clarify`

## WHAT WE'RE BUILDING:
License generation with number, expiry calculation, QuestPDF, and download.

## REQUIREMENTS:
- License number (MOJ-YYYY-XXXXXXXX)
- Expiry by category (A,B,F=10yr; C,D,E=5yr)
- QuestPDF with government design, bilingual, QR code, photo
- Download endpoint, notifications

## API Endpoints:
- POST /licenses/{appId}/issue
- GET /licenses/{id}
- GET /licenses/{id}/download

## ACCEPTANCE CRITERIA:
- [ ] License number generated
- [ ] Expiry by category
- [ ] PDF bilingual with QR code
- [ ] Download works
- [ ] Notification sent
