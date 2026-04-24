# [i18n] Translate Landing Module

## Overview

Translate all hardcoded text in landing page components (Hero, CTASection, ServiceGrid, Features, FAQSection, CategorySection, StatsSection, WorkflowTimeline).

## CRITICAL RULE

> **You are ONLY allowed to modify these files:**
> - `src/frontend/src/locales/ar/landing.json`
> - `src/frontend/src/locales/en/landing.json`
> 
> **Do NOT touch any other JSON files. Do NOT modify any TSX/TS files.**

## Hardcoded Text Found

### Hero.tsx (6 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 46 | Badge text | `landing.hero.badge` (KEY MISSING) |
| 79 | CTA button | Should use `landing.hero.cta.start` (wrong key) |
| 86 | Secondary button | `landing.hero.howItWorks` (KEY MISSING) |
| 99-102 | `'Active Users'`, `'Issued Licenses'`, `'Processing Speed'`, `'Daily Service'` | `landing.hero.statsLabel` (via array) |
| 120 | `"Scroll"` | `landing.hero.scroll` |

### CTASection.tsx (4 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 37 | `جاهز لبدء` (title) | `landing.cta.title` |
| 38 | `احصل على رخصتك الآن` (subtitle) | `landing.cta.subtitle` |
| 47 | `ابدأ الآن` (primary button) | `landing.cta.primaryButton` |
| 53 | `تواصل معنا` (secondary button) | `landing.cta.secondaryButton` |

### Features.tsx (7 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| Multiple | All feature titles and descriptions are hardcoded | Need full review |

### CategorySection.tsx (1 string)
| Line | Text | Suggested Key |
|------|------|---------------|
| - | Category names may need translation | Verify in landing.json |

## Existing Translation Coverage

The following keys ALREADY exist in landing.json:
- `hero.title`, `hero.subtitle`, `hero.cta`
- `services.*`
- `workflow.*`
- `categories.*`
- `stats.*`
- `faq.*`
- `features.*`

## Translation Structure Required

Add these keys to both `ar/landing.json` and `en/landing.json`:

```json
{
  "hero": {
    "badge": "منصة حكومية موحدة",
    "howItWorks": "كيف يعمل النظام",
    "scroll": "قم بالتمرير",
    "stats": {
      "activeUsers": "مستخدم نشط",
      "issuedLicenses": "رخصة مُصدرة",
      "processingSpeed": "سرعة المعالجة",
      "dailyService": "خدمة يومية"
    }
  },
  "cta": {
    "title": "جاهز لبدء؟",
    "subtitle": "احصل على رخصتك الآن",
    "primaryButton": "ابدأ الآن",
    "secondaryButton": "تواصل معنا"
  }
}
```

## Verification

After completing translations:
1. Run `npm run build` to verify no errors
2. Check that landing page renders correctly in both Arabic and English
