# Feature 020: Practical Test Recording with Additional Training Flag

> **Status:** To be generated via `/speckit.clarify`

## WHAT WE'RE BUILDING:
Practical test recording with additional training requirement on failure and test history.

## REQUIREMENTS:
- Same structure as theory test
- Additional training flag on failure
- Additional hours tracking
- Test history endpoint

## API Endpoints:
- POST /practical-tests/{appId}/result
- GET /tests/{appId}/history

## ACCEPTANCE CRITERIA:
- [ ] Examiner records result
- [ ] Additional training flag works
- [ ] Hours tracked
- [ ] Test history returns all attempts
- [ ] Max attempts enforced
