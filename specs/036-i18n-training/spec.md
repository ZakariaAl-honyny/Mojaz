# [i18n] Translate Training Module

## Overview

Translate hardcoded text in training-related components (ExemptionModal, ExemptionCard, GateLockIndicator).

## CRITICAL RULE

> **You are ONLY allowed to modify these files:**
> - `src/frontend/src/locales/ar/training.json`
> - `src/frontend/src/locales/en/training.json`
> 
> **Do NOT touch any other JSON files. Do NOT modify any TSX/TS files.**

## Hardcoded Text Found

### ExemptionModal.tsx (8 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 72 | `"Review Exemption Request"` | `training.exemption.reviewTitle` |
| 89 | `"Exemption Reason"` | `training.exemption.reasonLabel` |
| 97-98 | `"Rejection Reason (Required)"` | `training.exemption.rejectionLabel` |
| 103 | `"Explain why this exemption was rejected..."` | `training.exemption.rejectionPlaceholder` |
| 120 | `"Reject"` | `training.exemption.rejectButton` |
| 130 | `"Approve Exemption"` | `training.exemption.approveButton` |
| 137 | `"Cancel"` | `common.cancel` (verify exists) |
| 144 | `"Confirm Rejection"` | `training.exemption.confirmRejectButton` |

### ExemptionCard.tsx (3 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 46 | `'N/A'` | Already exists: `training.history.notApplicable` |
| 54 | `"No reason provided"` | `training.exemption.noReasonProvided` |
| 69 | `"Review Request"` | `training.exemption.reviewButton` |

### GateLockIndicator.tsx (3 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 38 | `"GATE 03"` | `common.gates.defaultLabel` |
| 42 | `"Requirements Pending"` | `common.gates.requirementsPending` |
| 45 | `"Gate Cleared"` | `common.gates.gateCleared` |

## Translation Structure Required

Add these keys to both `ar/training.json` and `en/training.json`:

```json
{
  "exemption": {
    "reviewTitle": "مراجعة طلب الإعفاء",
    "reasonLabel": "سبب الإعفاء",
    "rejectionLabel": "سبب الرفض (مطلوب)",
    "rejectionPlaceholder": "اشرح سبب رفض هذا الإعفاء...",
    "rejectButton": "رفض",
    "approveButton": "الموافقة على الإعفاء",
    "confirmRejectButton": "تأكيد الرفض",
    "noReasonProvided": "لم يتم تقديم سبب",
    "reviewButton": "مراجعة الطلب"
  },
  "gate": {
    "requirementsPending": "في انتظار المتطلبات",
    "gateCleared": "البوابة خالية",
    "defaultLabel": "البوابة 03"
  }
}
```

## Verification

After completing translations:
1. Run `npm run build` to verify no errors
2. Check training exemption forms render correctly