# Feature 019: Theory Test Recording with Attempt Tracking and Retake Logic

## WHAT WE'RE BUILDING:
Theory test recording with attempt counting, max attempts, cooling period, and notifications.

## REQUIREMENTS:
- Examiner records score + result
- Attempt counting (MAX_THEORY_ATTEMPTS=3)
- Cooling period (COOLING_PERIOD_DAYS=7)
- Gate 3 validation
- Notifications

## Endpoint: POST /theory-tests/{appId}/result

## ACCEPTANCE CRITERIA:
- [ ] Examiner records result
- [ ] Attempt count tracked
- [ ] Max attempts enforced
- [ ] Cooling period enforced
- [ ] Notification sent
