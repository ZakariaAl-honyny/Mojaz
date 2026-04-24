# [i18n] Translate Payment Module

## Overview

Translate hardcoded text in payment components (PaymentSection, PaymentHistoryList, PaymentSimModal, ReceiptDownloadButton, DocumentStatusBadge, DocumentLightbox).

## CRITICAL RULE

> **You are ONLY allowed to modify these files:**
> - `src/frontend/src/locales/ar/payment.json`
> - `src/frontend/src/locales/en/payment.json`
> - `src/frontend/src/locales/ar/document.json`
> - `src/frontend/src/locales/en/document.json`
> 
> **Do NOT touch any other JSON files. Do NOT modify any TSX/TS files.**

## Hardcoded Text Found

### PaymentHistoryList.tsx (5 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 75 | `"Payment History"` | `payment.historyTitle` |
| 130 | `"Submitted"` | `payment.status.submitted` |
| 131 | `"Approved"` | `payment.status.approved` |
| 132 | `"Rejected"` | `payment.status.rejected` |
| 133 | `"Submitted"` | `payment.status.submitted` |

### PaymentSimModal.tsx (5 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 60 | `"Failed to initiate payment"` | `payment.errors.initiateFailed` |
| 140 | `"Gateway Connection..."` | `payment.modal.gatewayConnection` |
| 151 | `"Done"` | Already exists - fix fallback |
| 160 | `"Retry"` | Already exists - fix fallback |
| 167 | `"Close"` | Already exists - fix fallback |

### ReceiptDownloadButton.tsx (4 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 35 | `"Receipt downloaded successfully"` | Already exists - fix fallback |
| 38 | `"Failed to download receipt"` | Already exists - fix fallback |
| 57 | `"Downloading..."` | Already exists - fix fallback |
| 57 | `"Download Receipt"` | Already exists - fix fallback |

### DocumentStatusBadge.tsx (1 string)
| Line | Text | Suggested Key |
|------|------|---------------|
| 35 | `"Unknown"` | `document.status.unknown` |

### DocumentLightbox.tsx (1 string)
| Line | Text | Suggested Key |
|------|------|---------------|
| 166 | `"Cancel"` | `common.cancel` (verify exists) |

## Translation Structure Required

Add these keys to `ar/payment.json` and `en/payment.json`:

```json
{
  "status": {
    "submitted": "مُقدّم",
    "approved": "موافق عليه",
    "rejected": "مرفوض"
  },
  "errors": {
    "initiateFailed": "فشل بدء الدفع"
  },
  "modal": {
    "gatewayConnection": "جارٍ الاتصال بالبوابة..."
  }
}
```

Add to `ar/document.json` and `en/document.json`:

```json
{
  "status": {
    "unknown": "غير معروف"
  }
}
```

## Verification

After completing translations:
1. Run `npm run build` to verify no errors
2. Check payment and document components render correctly