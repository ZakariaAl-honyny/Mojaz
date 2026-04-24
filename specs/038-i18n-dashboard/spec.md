# [i18n] Translate Dashboard Module

## Overview

Translate hardcoded text in dashboard pages and notification components (dashboard page.tsx, NotificationList, TimeSlotPicker).

## CRITICAL RULE

> **You are ONLY allowed to modify these files:**
> - `src/frontend/src/locales/ar/dashboard.json`
> - `src/frontend/src/locales/en/dashboard.json`
> - `src/frontend/src/locales/ar/notification.json`
> - `src/frontend/src/locales/en/notification.json`
> - `src/frontend/src/locales/ar/appointment.json`
> - `src/frontend/src/locales/en/appointment.json`
> 
> **Do NOT touch any other JSON files. Do NOT modified any TSX/TS files.**

## Hardcoded Text Found

### dashboard/page.tsx (25 strings)
Status data (lines 89-93):
| Line | Text | Suggested Key |
|------|------|---------------|
| 89 | `مكتمل` | `dashboard.status.completed` |
| 90 | `قيد المراجعة` | `dashboard.status.inReview` |
| 91 | `مستقدم` | `dashboard.status.submitted` |
| 92 | `ملغي` | `dashboard.status.cancelled` |
| 93 | `مسودة` | `dashboard.status.draft` |

Day names (lines 97-103):
| Line | Text | Suggested Key |
|------|------|---------------|
| 97-103 | Arabic day names | `dashboard.days.sunday` - `saturday` |

Activity items (lines 107-111):
| Line | Text | Suggested Key |
|------|------|---------------|
| 107 | `طلب جديد` | `dashboard.activity.newApplication` |
| 108 | `رخصة مُصدرة` | `dashboard.activity.licenseIssued` |
| 109 | `دفعة مستلمة` | `dashboard.activity.paymentReceived` |
| 110 | `مستخدم جديد` | `dashboard.activity.newUser` |
| 111 | `طلب مرفوض` | `dashboard.activity.applicationRejected` |

Line chart legends (lines 203-204):
| Line | Text | Suggested Key |
|------|------|---------------|
| 203 | `طلبات` | `dashboard.chart.applications` |
| 204 | `مكتمل` | `dashboard.chart.completed` |

### NotificationList.tsx (namespace bug)
| Line | Issue |
|------|-------|
| 22 | Uses `useTranslations('notifications')` but file has namespace `notification` (singular) |

### TimeSlotPicker.tsx (2 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 111 | `Morning` | `appointment.morning` |
| 112 | `Afternoon` | `appointment.afternoon` |

## Translation Structure Required

Add these keys to `ar/dashboard.json` and `en/dashboard.json`:

```json
{
  "status": {
    "completed": "مكتمل",
    "inReview": "قيد المراجعة",
    "submitted": "مُقدّم",
    "cancelled": "ملغي",
    "draft": "مسودة"
  },
  "days": {
    "sunday": "الأحد",
    "monday": "الاثنين",
    "tuesday": "الثلاثاء",
    "wednesday": "الأربعاء",
    "thursday": "الخميس",
    "friday": "الجمعة",
    "saturday": "السبت"
  },
  "activity": {
    "newApplication": "طلب جديد",
    "licenseIssued": "رخصة مُصدرة",
    "paymentReceived": "دفعة مستلمة",
    "newUser": "مستخدم جديد",
    "applicationRejected": "طلب مرفوض"
  },
  "chart": {
    "applications": "طلبات",
    "completed": "مكتمل"
  }
}
```

Add to `ar/appointment.json` and `en/appointment.json`:

```json
{
  "morning": "صباحاً",
  "afternoon": "مساءً"
}
```

## Verification

After completing translations:
1. Run `npm run build` to verify no errors
2. Check dashboard renders correctly in both languages