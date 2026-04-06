# Feature 017: Medical Exam Recording by Doctor with Result Notification

> **Status:** To be generated via `/speckit.clarify`

## WHAT WE'RE BUILDING:
Medical examination recording system with fitness results, validity tracking, and notifications.

## REQUIREMENTS:
- Doctor records fitness result (Fit/Unfit/ConditionalFit/RequiresReexam)
- Blood type, notes, report reference
- Validity period from settings (MEDICAL_VALIDITY_DAYS)
- Notification on result, audit log
- Gate validation for medical expiry

## API Endpoints:
- POST /medical-exams
- GET /medical-exams/{appId}
- PATCH /medical-exams/{id}/result

## ACCEPTANCE CRITERIA:
- [ ] Doctor can record medical exam
- [ ] Fitness result options work
- [ ] Validity period from settings
- [ ] Notification sent on result
- [ ] Audit log created
