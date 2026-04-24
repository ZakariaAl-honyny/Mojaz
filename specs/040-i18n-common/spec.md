# [i18n] Translate Common & Shared Components

## Overview

Translate hardcoded text in common/shared components (ThemeToggler, LanguageSwitcher, StatusBadge, PreferencesForm) and fix existing bugs.

## CRITICAL RULE

> **You are ONLY allowed to modify these files:**
> - `src/frontend/src/locales/ar/common.json`
> - `src/frontend/src/locales/en/common.json`
> - `src/frontend/src/locales/ar/status.json`
> - `src/frontend/src/locales/en/status.json`
> 
> **Do NOT touch any other JSON files. Do NOT modify any TSX/TS files.**

## Hardcoded Text Found

### ThemeToggler.tsx (2 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 17 | `aria-label="Toggle theme"` | `common.themeToggle` |
| 21 | `Toggle theme` | `common.themeToggle` |

### LanguageSwitcher.tsx (2 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 30 | `Switch to English` / `تغيير إلى العربية` | `common.switchToEnglish` / `common.switchToArabic` |
| 34 | `English` / `العربية` | `common.english` / `common.arabic` |

### StatusBadge.tsx (BUG - key mismatch)
| Issue |
|-------|
| Uses `.toLowerCase()` but translation files have UPPERCASE keys |
| Status shows untranslated (e.g., "Draft" instead of "مسودة") |

### PreferencesForm.tsx (10 strings - ALL MISSING from translation files)
| Line | Translation Key Used | Status |
|------|----------------------|--------|
| 54 | `settings.notifications.email` | MISSING |
| 55 | `settings.notifications.emailDesc` | MISSING |
| 61 | `settings.notifications.sms` | MISSING |
| 62 | `settings.notifications.smsDesc` | MISSING |
| 68 | `settings.notifications.push` | MISSING |
| 69 | `settings.notifications.pushDesc` | MISSING |
| 78 | `settings.notifications.title` | MISSING |
| 81 | `settings.notifications.description` | MISSING |
| 120 | `settings.notifications.inApp` | MISSING |
| 123 | `settings.notifications.inAppDesc` | MISSING |

## Translation Structure Required

Add to `ar/common.json` and `en/common.json`:

```json
{
  "themeToggle": "تبديل السمة",
  "switchToEnglish": "تغيير إلى الإنجليزية",
  "switchToArabic": "تغيير إلى العربية",
  "english": "English",
  "arabic": "العربية",
  "loading": "جاري التحميل...",
  "settings": {
    "notifications": {
      "title": "تفضيلات الإشعارات",
      "description": "اختر كيفية تلقي الإشعارات",
      "email": "البريد الإلكتروني",
      "emailDesc": "تلقي الإشعارات عبر البريد الإلكتروني",
      "sms": "الرسائل النصية",
      "smsDesc": "تلقي الإشعارات عبر الرسائل النصية",
      "push": "الإشعارات الفورية",
      "pushDesc": "تلقي الإشعارات على جهازك",
      "inApp": "الإشعارات داخل التطبيق",
      "inAppDesc": "ستظل تتلقى الإشعارات داخل التطبيق"
    }
  }
}
```

## Bug Fix Required

### StatusBadge.tsx - FIX NEEDED (NOT translation file change)

The component at `src/frontend/src/components/domain/application/StatusBadge.tsx` line needs to remove `.toLowerCase()`:

```typescript
// BEFORE (broken):
const translatedStatus = t(status.toString().toLowerCase() as any) || status;

// AFTER (fixed):
const translatedStatus = t(status.toString() as any) || status;
```

**NOTE:** This is a CODE FIX, not a translation task. The translation files already have the correct keys (UPPERCASE: "Draft", "Submitted", etc.).

## Verification

After completing translations:
1. Run `npm run build` to verify no errors
2. Check ThemeToggler, LanguageSwitcher, PreferencesForm work correctly