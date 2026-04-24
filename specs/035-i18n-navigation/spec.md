# [i18n] Translate Navigation & Layout Module

## Overview

Translate all hardcoded text in navigation and layout components (Navbar, PublicHeader, Sidebar, TopNav, Footer).

## CRITICAL RULE

> **You are ONLY allowed to modify these files:**
> - `src/frontend/src/locales/ar/navigation.json` (CREATE)
> - `src/frontend/src/locales/en/navigation.json` (CREATE)
> - `src/frontend/src/locales/ar/footer.json` (CREATE)
> - `src/frontend/src/locales/en/footer.json` (CREATE)
>
> **Do NOT touch any other JSON files. Do NOT modify any TSX/TS files.**

## Hardcoded Text Found

### PublicHeader.tsx (6 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 53 | `نظام إصدار رخص القادة الالكتروني` | `navigation.header.brand` |
| 57 | `Mojaz Digital` | `navigation.header.tagline` |
| 63 | `الرئيسية` | `navigation.header.nav.home` |
| 64 | `عن المنصة` | `navigation.header.nav.about` |
| 65 | `الخدمات` | `navigation.header.nav.services` |
| 66 | `المراكز` | `navigation.header.nav.centers` |

### Sidebar.tsx (6 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 136 | `نظام إصدار رخص القادة الالكتروني` | `navigation.sidebar.brand` |
| 139 | `Gov Platform` | `navigation.sidebar.tagline` |
| 165 | `'User Name'` | `navigation.sidebar.userPlaceholder` |
| 166 | `'Role'` | `navigation.sidebar.rolePlaceholder` |
| 107-111 | Report fallbacks | `navigation.sidebar.reports.*` |

### TopNav.tsx (3 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 72 | `الدعم` | `navigation.topNav.support` |
| 85 | `'User Name'` | `navigation.topNav.userPlaceholder` |
| 88 | `'Applicant'` | `navigation.topNav.rolePlaceholder` |

### Footer.tsx (21+ strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 35 | `Gov Digital Platform` | `footer.tagline` |
| 39 | `نظام إصدار رخص القادة الالكتروني هي المنصة الحكومية الموحدة...` | `footer.description` |
| 57-62 | Services links | `footer.services.*` |
| 67-72 | About links | `footer.about.*` |
| 77-82 | Legal links | `footer.legal.*` |
| 90-93 | Awards | `footer.awards.*` |
| 103 | Copyright text | `footer.copyright` |
| 106 | `Powered by Gaea System` | `footer.poweredBy` |

## File Structure Required

Create the following new translation files:

### navigation.json (AR)
```json
{
  "header": {
    "brand": "نظام إصدار رخص القادة الالكتروني",
    "tagline": "Mojaz Digital",
    "nav": {
      "home": "الرئيسية",
      "about": "عن المنصة",
      "services": "الخدمات",
      "centers": "المراكز"
    }
  },
  "sidebar": {
    "brand": "نظام إصدار رخص القادة الالكتروني",
    "tagline": "Gov Platform",
    "userPlaceholder": "User Name",
    "rolePlaceholder": "Role",
    "reports": {
      "applications": "Applications Report",
      "financial": "Financial Report",
      "users": "Users Report",
      "performance": "Performance Report",
      "audits": "Audit Logs"
    }
  },
  "topNav": {
    "support": "الدعم",
    "userPlaceholder": "User Name",
    "rolePlaceholder": "Applicant"
  }
}
```

### navigation.json (EN)
```json
{
  "header": {
    "brand": "Mojaz",
    "tagline": "Mojaz Digital",
    "nav": {
      "home": "Home",
      "about": "About",
      "services": "Services",
      "centers": "Centers"
    }
  },
  "sidebar": {
    "brand": "Mojaz",
    "tagline": "Gov Platform",
    "userPlaceholder": "User Name",
    "rolePlaceholder": "Role",
    "reports": {
      "applications": "Applications Report",
      "financial": "Financial Report",
      "users": "Users Report",
      "performance": "Performance Report",
      "audits": "Audit Logs"
    }
  },
  "topNav": {
    "support": "Support",
    "userPlaceholder": "User Name",
    "rolePlaceholder": "Applicant"
  }
}
```

### footer.json (AR & EN)
Create with all service, about, legal, and award links.

## Verification

After completing translations:
1. Run `npm run build` to verify no errors
2. Check that all navigation elements render correctly in both languages