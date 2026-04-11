# License Replacement (استبدال الرخصة)

## Overview (نظرة عامة)
The License Replacement feature allows applicants to request a new physical or digital license when their current one is **Lost**, **Damaged**, or **Stolen**. The system ensures that the replacement process is secure, documented, and integrated with the existing license lifecycle.

**Primary Goals:**
- Provide a streamlined replacement request wizard for applicants.
- Implement a verification workflow for high-risk replacements (e.g., Stolen).
- Maintain a complete audit trail of issued and replaced licenses.

---

## User Flow: Applicant (رحلة المستخدم: مقدم الطلب)

### 1. Eligibility Check (التحقق من الأهلية)
Before starting the process, the system verifies that the user has an active license that can be replaced.
- **Endpoint**: `GET /api/v1/licenses/mine/replacement-eligibility`
- **Requirement**: User must have a license with a status other than `Expired` or `Revoked`.

### 2. Submission Wizard (معالج تقديم الطلب)
The applicant goes through a multi-step wizard:

| Step | Action | Requirement | Bilingual Label (AR/EN) |
| :--- | :--- | :--- | :--- |
| **1** | **Select Reason** | Choose one: Lost, Damaged, or Stolen | اختيار السبب / Select Reason |
| **2** | **Declaration** | Sign a digital declaration of truthfulness | الإقرار الرقمي / Digital Declaration |
| **3** | **Upload** | Based on reason: <br>- **Stolen**: Police Report<br>- **Damaged**: Photo of License<br>- **Lost**: N/A | تحميل المستندات / Upload Documents |
| **4** | **Review** | Confirm all details are correct | مراجعة الطلب / Review Request |
| **5** | **Payment** | Pay the replacement fee | دفع الرسوم / Payment |

### 3. Outcome (النتيجة)
- **Lost/Damaged**: The application is typically auto-approved and moves to `ReadyToIssue`.
- **Stolen**: The application enters `UnderReview` status pending employee verification.

---

## User Flow: Employee (رحلة المستخدم: الموظف)

### 1. Reviewing Reports (مراجعة البلاغات)
For "Stolen" license requests, a **Receptionist** must verify the submitted police report.
- **Action**: Access the **Review Queue** $\rightarrow$ Select Replacement Application $\rightarrow$ Verify Police Report.
- **Endpoint**: `PATCH /api/v1/administrative/applications/{id}/verify-stolen-report`
- **Decision**: 
  - **Approve**: Application moves to `Approved` $\rightarrow$ `ReadyToIssue`.
  - **Reject**: Application is returned to the applicant with comments for re-upload.

### 2. Issuing the Replacement (إصدار الرخصة البديلة)
Once the application is `ReadyToIssue`, the system:
1. Generates a **new License Number**.
2. Creates a new `License` record.
3. Marks the previous license status as **Replaced** (مستبدلة).

---

## Business Rules (قواعد العمل)

### 1. Documentation Requirements (متطلبات التوثيق)
| Reason (السبب) | Required Document (المستند المطلوب) | Validation Rule |
| :--- | :--- | :--- |
| **Lost (مفقودة)** | Digital Declaration | Signed declaration is mandatory. |
| **Damaged (تالفة)** | License Photo | A clear photo of the damaged card is required. |
| **Stolen (مسروقة)** | Police Report | A valid PDF police report is mandatory. |

### 2. Fee Structure (هيكل الرسوم)
- Fees are retrieved from the `FeeStructures` table where `ServiceType = 'Replacement'`.
- The fee is a flat rate, regardless of the license category.

### 3. License Lifecycle (دورة حياة الرخصة)
- **Old License**: Transition status to `Replaced`. It can no longer be used for verification.
- **New License**: Inherits all categories and details from the old license but receives a unique issuance date and number.

---

## Technical Details (التفاصيل التقنية)

### 1. Key API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/licenses/mine/replacement-eligibility` | Checks if the applicant is eligible for replacement. |
| `POST` | `/api/v1/applications/replacement` | Initiates the replacement application. |
| `POST` | `/api/v1/applications/{id}/documents` | Uploads required proof (Police Report/Photo). |
| `PATCH` | `/api/v1/administrative/applications/{id}/verify-stolen-report` | Admin approval for stolen reports. |

### 2. Data Model Extensions
- **`LicenseReplacement` Entity**:
  - `ReplacementReason`: Enum (`Lost`, `Damaged`, `Stolen`).
  - `IsReportVerified`: Boolean (True if approved by employee).
  - `ReviewComments`: String (Employee notes).
- **`License` Entity**:
  - `Status`: Extended to include `Replaced` status.

---

## Testing Scenarios (سيناريوهات الاختبار)

The following scenarios are covered in the integration tests:

- **Scenario A: Lost License (Automatic)**
  - Flow: Eligible $\rightarrow$ Reason: Lost $\rightarrow$ Declaration $\rightarrow$ Payment $\rightarrow$ `ReadyToIssue`.
- **Scenario B: Stolen License (Manual)**
  - Flow: Eligible $\rightarrow$ Reason: Stolen $\rightarrow$ Police Report Upload $\rightarrow$ Payment $\rightarrow$ `UnderReview` $\rightarrow$ Receptionist Approval $\rightarrow$ `ReadyToIssue`.
- **Scenario C: Damaged License (Verification)**
  - Flow: Eligible $\rightarrow$ Reason: Damaged $\rightarrow$ Photo Upload $\rightarrow$ Payment $\rightarrow$ `ReadyToIssue`.
  - *Edge Case*: Verify that the submit button is disabled if the photo is missing.
